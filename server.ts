import express from 'express';
import { chromium, type Page, type Locator } from 'playwright';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

const PORT = 3001;

// ==========================================
// Helper Functions
// ==========================================

function parseTurkishPrice(priceStr: string): number {
  try {
    const clean = priceStr.replace('TL', '').replace(/\n/g, '').trim();
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
  } catch {
    return 999999;
  }
}

function cleanSellerName(text: string, imgAlt: string): string {
  text = text.replace('Satıcı:', '').trim();
  if (text.includes('/')) return text.split('/').pop()!.trim();
  if (imgAlt) return imgAlt;
  const first = text.split('\n')[0].trim();
  return first || 'Unknown Seller';
}

/**
 * Akakçe uses versioned CSS classes like pt_v8, pt_v9, v_v8, v_v9 etc.
 * These change with site updates. We detect the active version dynamically.
 */
async function detectSelectors(page: Page): Promise<{
  priceClass: string;
  sellerClass: string;
  rowSelector: string;
  containerSelector: string;
} | null> {
  // Try to find the price class by matching the pattern [pt_v<digit>]
  const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 50000));

  // Find active versioned class suffixes (e.g. "v8", "v9", "v10")
  const priceMatch = bodyHtml.match(/class="[^"]*pt_(v\d+)[^"]*"/);
  const sellerMatch = bodyHtml.match(/class="[^"]*[^a-z](v_(v\d+))[^"]*"/);
  const plMatch = bodyHtml.match(/class="[^"]*pl_(v\d+)[^"]*"/);
  const pwMatch = bodyHtml.match(/class="[^"]*pw_(v\d+)[^"]*"/);
  const bbMatch = bodyHtml.match(/class="[^"]*bb_(w\d*|w)[^"]*"/);

  if (!priceMatch) {
    console.log('⚠️  Could not detect price class from page HTML');
    return null;
  }

  const ver = priceMatch[1]; // e.g. "v8" or "v9"
  const priceClass = `.pt_${ver}`;
  const sellerClass = `.v_${ver}, .v_s`;
  const pl = plMatch ? `.pl_${plMatch[1]} li` : `#PL li`;
  const pw = pwMatch ? `.pw_${pwMatch[1]}` : '.pw_v8';
  const rowSelector = `#PL li, ${pl}, ${pw}`;
  const containerSelector = bbMatch ? `.bb_${bbMatch[1]}` : `[class*="bb_w"]`;

  console.log(`  Detected selectors: price="${priceClass}" seller="${sellerClass}" rows="${rowSelector}"`);

  return { priceClass, sellerClass, rowSelector, containerSelector };
}

/**
 * Robust wait: tries multiple selectors before giving up.
 * Falls back to networkidle if nothing matches.
 */
async function waitForPage(page: Page): Promise<void> {
  // Try candidate selectors that indicate the price list is loaded
  const candidates = [
    '[class*="bb_w"]',
    '[class*="pt_v"]',
    '[class*="pl_v"]',
    '#PL',
    '.fiyatListesi',
  ];

  let found = false;
  for (const sel of candidates) {
    try {
      await page.waitForSelector(sel, { timeout: 8000 });
      console.log(`  Page ready — matched selector: "${sel}"`);
      found = true;
      break;
    } catch {
      // continue trying
    }
  }

  if (!found) {
    console.log('  No known selector found, waiting for networkidle...');
    await page.waitForLoadState('networkidle', { timeout: 20000 });
  }
}

// ==========================================
// API: Check Single Product Price
// ==========================================

app.post('/api/check-price', async (req, res) => {
  const { name, url, threshold } = req.body;

  if (!name || !url || threshold === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, url, threshold' });
  }

  let browser = null;
  try {
    console.log(`\n🔍 Checking: ${name} (threshold: ${threshold} ₺)`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      locale: 'tr-TR',
    });
    const page = await context.newPage();

    await page.goto(url, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await waitForPage(page);

    // Detect current versioned selectors
    const sels = await detectSelectors(page);

    // Build final selectors — fall back to wildcard attribute selectors if detection fails
    const priceSelector   = sels?.priceClass   ?? '[class*="pt_v"]';
    const sellerSelector  = sels?.sellerClass  ?? '[class*="v_v"], .v_s';
    const rowSelector     = sels?.rowSelector  ?? '#PL li, [class*="pl_v"] li, [class*="pw_v"]';

    // --- Extract lowest (top) price ---
    const topPriceLocator: Locator = page.locator(priceSelector).first();
    const topPriceRaw = (await topPriceLocator.count()) > 0
      ? await topPriceLocator.innerText()
      : '';
    const topPriceText = topPriceRaw.replace(/\n/g, '').trim();

    if (!topPriceText) {
      throw new Error(`Price element not found. Selector tried: "${priceSelector}". Page may have changed.`);
    }

    // --- Extract top seller ---
    const topSellerContainer = page.locator(sellerSelector).first();
    const topSellerText = (await topSellerContainer.count()) > 0
      ? await topSellerContainer.innerText()
      : '';
    const topSellerImgEl = topSellerContainer.locator('img').first();
    const topSellerAlt = (await topSellerImgEl.count()) > 0
      ? (await topSellerImgEl.getAttribute('alt') ?? '')
      : '';
    const topSeller = cleanSellerName(topSellerText, topSellerAlt);
    const topSellerKey = topSeller.toLowerCase().replace(/[\s.]/g, '');

    // --- Scan seller rows for violations ---
    const violations: Record<string, { p_num: number; display: string }> = {};
    const rows = await page.locator(rowSelector).all();
    console.log(`  Found ${rows.length} seller rows`);

    for (const row of rows) {
      const priceEl = row.locator(`${priceSelector}, [class*="pt_v"]`);
      if ((await priceEl.count()) === 0) continue;

      const priceText = (await priceEl.first().innerText()).replace(/\n/g, '').trim();
      const priceNum = parseTurkishPrice(priceText);

      if (priceNum <= threshold) {
        const sellerEl = row.locator(`${sellerSelector}, [class*="v_v"], .v_s`).first();
        const sellerText = (await sellerEl.count()) > 0 ? await sellerEl.innerText() : '';
        const sellerImgEl = sellerEl.locator('img').first();
        const sellerAlt = (await sellerImgEl.count()) > 0
          ? (await sellerImgEl.getAttribute('alt') ?? '')
          : '';
        const sellerName = cleanSellerName(sellerText, sellerAlt);
        const sellerKey = sellerName.toLowerCase().replace(/[\s.]/g, '');

        if (sellerKey && sellerKey !== topSellerKey) {
          if (!violations[sellerKey] || priceNum < violations[sellerKey].p_num) {
            violations[sellerKey] = {
              p_num: priceNum,
              display: `${sellerName}(${priceText})`,
            };
          }
        }
      }
    }

    const violationStr = Object.values(violations)
      .map((v) => v.display)
      .join(' | ');

    console.log(`✅ Done: ${name} — lowest: ${topPriceText} (${topSeller}) ${violationStr ? `| 🚨 violations: ${violationStr}` : '| ✅ Normal'}`);

    return res.json({
      inspectionTime: new Date().toLocaleString('tr-TR'),
      productName: name,
      threshold,
      lowestPrice: topPriceText,
      lowestPriceNum: parseTurkishPrice(topPriceText),
      lowestPriceSeller: topSeller,
      otherViolations: violationStr,
      status: violationStr ? 'violation' : 'normal',
      url,
    });
  } catch (error: any) {
    const msg: string = error.message || String(error);
    // Shorten Playwright's verbose timeout messages for the UI
    const shortMsg = msg.includes('Timeout') || msg.includes('timeout')
      ? msg.split('\n')[0].replace(/Call log:.*/s, '').trim()
      : msg;
    console.log(`⚠️  Error checking ${name}: ${shortMsg}`);
    return res.status(500).json({
      productName: name,
      threshold,
      status: 'error',
      error: shortMsg,
      url,
    });
  } finally {
    if (browser) await browser.close();
  }
});

// ==========================================
// API: Health Check
// ==========================================

app.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', message: 'Price Monitor API is running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Price Monitor API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/status`);
});
