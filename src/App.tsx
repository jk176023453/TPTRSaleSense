import React, { useState, useRef } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  LayoutDashboard, 
  LineChart, 
  BarChart2, 
  FileText, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2,
  Package,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  Activity,
  Play,
  Square,
  Download,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Clock,
  BadgeAlert
} from 'lucide-react';

// --- Mock Data ---
const mockProducts = [
  { id: 1, name: 'Archer AX73', category: 'Wi-Fi 6 Router', ourPrice: 129.99, compA: 135.00, compB: 125.99, trend: 'down', lastUpdated: '2 hours ago', status: 'At Risk', image: 'https://picsum.photos/seed/router1/80/80' },
  { id: 2, name: 'Deco X20 (3-Pack)', category: 'Mesh System', ourPrice: 199.99, compA: 210.00, compB: 205.00, trend: 'stable', lastUpdated: '5 hours ago', status: 'Competitive', image: 'https://picsum.photos/seed/mesh1/80/80' },
  { id: 3, name: 'TL-SG108E', category: 'Switch', ourPrice: 29.99, compA: 25.99, compB: 27.99, trend: 'up', lastUpdated: '1 day ago', status: 'Expensive', image: 'https://picsum.photos/seed/switch1/80/80' },
  { id: 4, name: 'Archer C7', category: 'Wi-Fi 5 Router', ourPrice: 59.99, compA: 59.99, compB: 65.00, trend: 'stable', lastUpdated: '1 day ago', status: 'Competitive', image: 'https://picsum.photos/seed/router2/80/80' },
  { id: 5, name: 'Deco M4 (2-Pack)', category: 'Mesh System', ourPrice: 109.99, compA: 99.99, compB: 105.00, trend: 'down', lastUpdated: '3 hours ago', status: 'At Risk', image: 'https://picsum.photos/seed/mesh2/80/80' },
  { id: 6, name: 'RE650', category: 'Range Extender', ourPrice: 89.99, compA: 95.00, compB: 92.00, trend: 'up', lastUpdated: '4 hours ago', status: 'Competitive', image: 'https://picsum.photos/seed/extender1/80/80' },
];

const mockAlerts = [
  { id: 1, type: 'critical', message: 'Competitor A dropped price for Deco M4 by 9%', time: '10 mins ago' },
  { id: 2, type: 'warning', message: 'Archer AX73 is now priced higher than Competitor B', time: '1 hour ago' },
  { id: 3, type: 'info', message: 'Weekly market data pull completed successfully', time: '2 hours ago' },
  { id: 4, type: 'critical', message: 'TL-SG108E price is 15% above market average', time: '5 hours ago' },
];

const chartData = [
  { month: 'Jan', our: 40, comp: 45 },
  { month: 'Feb', our: 60, comp: 55 },
  { month: 'Mar', our: 55, comp: 65 },
  { month: 'Apr', our: 70, comp: 68 },
  { month: 'May', our: 65, comp: 75 },
  { month: 'Jun', our: 80, comp: 78 },
];

// --- Components ---

const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, isDarkMode }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking', label: 'Price Tracking', icon: LineChart },
    { id: 'monitor', label: 'Price Monitor', icon: Activity },
    { id: 'analytics', label: 'Market Analytics', icon: BarChart2 },
    { id: 'reports', label: 'Summary Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} shrink-0 ${isDarkMode ? 'bg-[#212628]' : 'bg-[#4ACBD6]'} text-white flex flex-col h-screen sticky top-0 transition-all duration-300 z-20 shadow-lg md:shadow-none`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'} border-b border-white/10 h-20`}>
        <div className="w-8 h-8 shrink-0 rounded bg-[#FFCB00] flex items-center justify-center font-bold text-lg text-white">S</div>
        {!isCollapsed && <h1 className="text-xl font-semibold tracking-wide truncate">TP-SaleSense</h1>}
      </div>
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={isCollapsed ? item.label : ''}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#FFCB00] text-white shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white shrink-0' : 'text-[#FFCB00] shrink-0'} />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 flex justify-center">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white w-full flex justify-center"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
};

const TopBar = ({ isCollapsed, setIsCollapsed, isDarkMode, setIsDarkMode }: any) => {
  return (
    <header className={`h-20 ${isDarkMode ? 'bg-[#212628] border-white/10' : 'bg-white border-[#A7A9AC]/30'} border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 transition-colors duration-300`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          className={`md:hidden p-2 ${isDarkMode ? 'text-[#A7A9AC] hover:text-white' : 'text-[#A7A9AC] hover:text-[#00A3DF]'} transition-colors`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7A9AC]" size={20} />
          <input 
            type="text" 
            placeholder="Search products, SKUs, or competitors..." 
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              isDarkMode 
                ? 'bg-[#36444B] border-white/10 text-white placeholder:text-[#A7A9AC] focus:ring-[#4ACBD6]' 
                : 'bg-slate-50 border-[#A7A9AC]/40 text-[#36444B] placeholder:text-[#A7A9AC] focus:ring-[#00A3DF]'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#FFCB00] hover:bg-white/10' : 'text-[#A7A9AC] hover:bg-slate-100 hover:text-[#00A3DF]'}`}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button className={`relative p-2 transition-colors ${isDarkMode ? 'text-[#A7A9AC] hover:text-white' : 'text-[#A7A9AC] hover:text-[#00A3DF]'}`}>
          <Bell size={22} />
          <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C11C66] rounded-full border-2 ${isDarkMode ? 'border-[#212628]' : 'border-white'}`}></span>
        </button>
        <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDarkMode ? 'border-white/10' : 'border-[#A7A9AC]/30'} cursor-pointer group`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
            isDarkMode ? 'bg-[#36444B] text-white group-hover:bg-white/10' : 'bg-slate-100 text-[#36444B] group-hover:bg-[#00A3DF]/10'
          }`}>
            <User size={20} />
          </div>
          <div className="hidden sm:block">
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#36444B]'}`}>Admin User</p>
            <p className="text-xs text-[#A7A9AC]">Pricing Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const Dashboard = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const cardBg = isDarkMode ? 'bg-[#212628] border-white/10' : 'bg-white border-[#A7A9AC]/20';
  const textColor = isDarkMode ? 'text-white' : 'text-[#36444B]';

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className={`text-2xl font-bold ${textColor}`}>Market Overview</h2>
        <p className="text-[#A7A9AC] mt-1">Weekly summary of your pricing position against competitors.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#A7A9AC] font-medium">Total Products Tracked</h3>
            <div className="p-2 bg-[#00A3DF]/20 rounded-lg text-[#00A3DF]">
              <Package size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${textColor}`}>1,248</p>
          <p className="text-sm text-[#4ACBD6] mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> +12 this week
          </p>
        </div>
        
        <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#A7A9AC] font-medium">Recent Price Changes</h3>
            <div className="p-2 bg-[#FFCB00]/20 rounded-lg text-[#FFCB00]">
              <LineChart size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${textColor}`}>34</p>
          <p className="text-sm text-[#C11C66] mt-2 flex items-center gap-1">
            <TrendingDown size={16} /> 8 require attention
          </p>
        </div>

        <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1 ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#A7A9AC] font-medium">Average Market Position</h3>
            <div className="p-2 bg-[#4ACBD6]/20 rounded-lg text-[#4ACBD6]">
              <BarChart2 size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${textColor}`}>-2.4%</p>
          <p className="text-sm text-[#4ACBD6] mt-2 flex items-center gap-1">
            <CheckCircle2 size={16} /> Below market average
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Chart Area */}
        <div className={`lg:col-span-2 p-4 sm:p-6 rounded-xl border shadow-sm flex flex-col ${cardBg}`}>
          <h3 className={`text-lg font-semibold mb-6 ${textColor}`}>Price Trend Comparison (Last 6 Months)</h3>
          
          {/* CSS Dummy Chart - Responsive Fix */}
          <div className="h-64 flex mt-auto">
            {/* Y-axis labels */}
            <div className="w-10 sm:w-12 flex flex-col justify-between text-xs text-[#A7A9AC] pb-6 pr-2 text-right shrink-0">
              <span>$150</span>
              <span>$100</span>
              <span>$50</span>
              <span>$0</span>
            </div>
            
            {/* Chart Content */}
            <div className={`flex-1 border-b border-l ${isDarkMode ? 'border-white/20' : 'border-[#A7A9AC]/30'} relative flex items-end px-1 sm:px-4 pb-0`}>
              {/* Bars */}
              <div className="w-full h-full flex items-end justify-around pt-4">
                {chartData.map((data, i) => (
                  <div key={i} className="w-1/8 sm:w-1/12 flex items-end justify-center gap-0.5 sm:gap-1 group h-full">
                    <div 
                      className="w-1/2 bg-[#00A3DF] rounded-t-sm transition-all duration-300 group-hover:bg-[#00A3DF]/80 relative"
                      style={{ height: `${data.our}%` }}
                    >
                      <div className={`opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 ${isDarkMode ? 'bg-white text-[#212628]' : 'bg-[#36444B] text-white'} text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10`}>
                        ${data.our}
                      </div>
                    </div>
                    <div 
                      className={`w-1/2 ${isDarkMode ? 'bg-[#A7A9AC]/70 group-hover:bg-[#A7A9AC]' : 'bg-[#A7A9AC]/50 group-hover:bg-[#A7A9AC]/70'} rounded-t-sm transition-all duration-300 relative`}
                      style={{ height: `${data.comp}%` }}
                    >
                      <div className={`opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 ${isDarkMode ? 'bg-white text-[#212628]' : 'bg-[#36444B] text-white'} text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10`}>
                        ${data.comp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-around text-xs text-[#A7A9AC]">
                {chartData.map((data, i) => (
                  <span key={i} className="flex-1 text-center">{data.month}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00A3DF]"></div>
              <span className={`text-sm ${textColor}`}>Our Average Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-[#A7A9AC]/70' : 'bg-[#A7A9AC]/50'}`}></div>
              <span className={`text-sm ${textColor}`}>Competitor Average</span>
            </div>
          </div>
        </div>

        {/* Alerts Widget */}
        <div className={`p-4 sm:p-6 rounded-xl border shadow-sm flex flex-col ${cardBg}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${textColor}`}>Automated Alerts</h3>
            <button className="text-sm text-[#00A3DF] hover:underline">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-[#36444B] border-white/5 hover:bg-white/5' 
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
              }`}>
                <div className="mt-0.5 shrink-0">
                  {alert.type === 'critical' && <AlertCircle size={18} className="text-[#C11C66]" />}
                  {alert.type === 'warning' && <AlertTriangle size={18} className="text-[#FFCB00]" />}
                  {alert.type === 'info' && <CheckCircle2 size={18} className="text-[#4ACBD6]" />}
                </div>
                <div>
                  <p className={`text-sm font-medium leading-snug ${textColor}`}>{alert.message}</p>
                  <p className="text-xs text-[#A7A9AC] mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Price Monitor Component
// ==========================================

interface ProductRow {
  name: string;
  url: string;
  threshold: number;
}

interface CheckResult {
  inspectionTime?: string;
  productName: string;
  threshold: number;
  lowestPrice?: string;
  lowestPriceNum?: number;
  lowestPriceSeller?: string;
  otherViolations?: string;
  status: 'normal' | 'violation' | 'error' | 'checking' | 'pending';
  url: string;
  error?: string;
}

const csvProducts: ProductRow[] = [
  { name: 'Archer VR300', url: 'https://www.akakce.com/modem/en-ucuz-tp-link-archer-vr300-1200mbps-vdsl2-fiyati,282052642.html', threshold: 2198 },
  { name: 'Tapo C210',   url: 'https://www.akakce.com/guvenlik-kamerasi/en-ucuz-tp-link-tapo-c210-ev-guvenligi-icin-pan-tilt-kablosuz-kamera-fiyati,201390126.html', threshold: 1298 },
  { name: 'TL-MR100',   url: 'https://www.akakce.com/modem/en-ucuz-tp-link-tl-mr100-2-port-300-mbps-fiyati,748565612.html', threshold: 2398 },
  { name: 'Archer VR400', url: 'https://www.akakce.com/modem/en-ucuz-tp-link-archer-vr400-1200-mbps-vdsl2-fiyati,22537048.html', threshold: 2398 },
];

const PriceMonitor = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const cardBg   = isDarkMode ? 'bg-[#212628] border-white/10' : 'bg-white border-[#A7A9AC]/20';
  const textColor = isDarkMode ? 'text-white' : 'text-[#36444B]';
  const subText   = 'text-[#A7A9AC]';
  const rowHover  = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/80';
  const thBg      = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#A7A9AC]/20';

  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [checking, setChecking] = useState<Set<string>>(new Set());
  const [isRunningAll, setIsRunningAll] = useState(false);
  const stopFlag = useRef(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Parse "SellerName(Price TL) | ..." into structured objects
  const parseViolations = (str: string) => {
    if (!str) return [];
    return str.split(' | ').map(v => {
      const lastParen = v.lastIndexOf('(');
      if (lastParen === -1) return { name: v.trim(), price: '?', priceNum: 999999, isSpecial: false };
      const name  = v.substring(0, lastParen).trim();
      const price = v.substring(lastParen + 1, v.endsWith(')') ? v.length - 1 : v.length).trim();
      const priceNum = (() => {
        try { const c = price.replace('TL','').trim(); return parseFloat(c.replace(/\./g,'').replace(',','.')); }
        catch { return 999999; }
      })();
      // Special aggregated rows from Akakçe (not real sellers)
      const isSpecial = name.includes('Kargo') || name === 'Unknown Seller';
      return { name, price, priceNum, isSpecial };
    });
  };

  const toggleExpand = (name: string) =>
    setExpandedRow(prev => (prev === name ? null : name));

  // Check server health on mount
  React.useEffect(() => {
    fetch('/api/status')
      .then(r => r.ok ? setServerOnline(true) : setServerOnline(false))
      .catch(() => setServerOnline(false));
  }, []);

  const checkProduct = async (product: ProductRow) => {
    setChecking(prev => new Set(prev).add(product.name));
    setResults(prev => ({
      ...prev,
      [product.name]: { productName: product.name, threshold: product.threshold, url: product.url, status: 'checking' },
    }));

    try {
      const resp = await fetch('/api/check-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await resp.json();
      setResults(prev => ({ ...prev, [product.name]: data }));
    } catch (e: any) {
      setResults(prev => ({
        ...prev,
        [product.name]: { productName: product.name, threshold: product.threshold, url: product.url, status: 'error', error: e.message },
      }));
    }

    setChecking(prev => { const n = new Set(prev); n.delete(product.name); return n; });
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runAll = async () => {
    stopFlag.current = false;
    setIsRunningAll(true);
    for (const product of csvProducts) {
      if (stopFlag.current) break;
      await checkProduct(product);
      if (!stopFlag.current) await delay(2000 + Math.random() * 3000);
    }
    setIsRunningAll(false);
  };

  const stopAll = () => {
    stopFlag.current = true;
    setIsRunningAll(false);
  };

  const exportCSV = () => {
    const rows = [
      ['Inspection Time','Product Name','Threshold (TL)','Lowest Price','Lowest Seller','Other Violations','Status','URL'],
      ...csvProducts.map(p => {
        const r = results[p.name];
        if (!r || r.status === 'pending' || r.status === 'checking') {
          return ['-', p.name, p.threshold, '-', '-', '-', 'Not checked', p.url];
        }
        const statusLabel = r.status === 'violation' ? '🚨 Price Violation' : r.status === 'normal' ? '✅ Normal' : '❌ Error';
        return [r.inspectionTime||'-', r.productName, r.threshold, r.lowestPrice||'-', r.lowestPriceSeller||'-', r.otherViolations||'-', statusLabel, r.url];
      })
    ];
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Price_Report_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'')}.csv`;
    link.click();
  };

  const totalChecked  = csvProducts.filter(p => results[p.name] && !['checking','error'].includes(results[p.name]?.status)).length;
  const totalViolations = csvProducts.filter(p => results[p.name]?.status === 'violation').length;
  const totalNormal    = csvProducts.filter(p => results[p.name]?.status === 'normal').length;
  const totalErrors    = csvProducts.filter(p => results[p.name]?.status === 'error').length;

  const StatusBadge = ({ result }: { result?: CheckResult }) => {
    if (!result || result.status === 'pending') return <span className={`text-xs ${subText}`}>—</span>;
    if (result.status === 'checking') return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#00A3DF]/10 text-[#00A3DF] border border-[#00A3DF]/20">
        <Loader2 size={12} className="animate-spin" /> Checking...
      </span>
    );
    if (result.status === 'error') return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#C11C66]/10 text-[#C11C66] border border-[#C11C66]/20">
        <AlertCircle size={12} /> Error
      </span>
    );
    if (result.status === 'violation') return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#C11C66]/10 text-[#C11C66] border border-[#C11C66]/20">
        <ShieldAlert size={12} /> Violation Detected
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4ACBD6]/10 text-[#4ACBD6] border border-[#4ACBD6]/20">
        <ShieldCheck size={12} /> Normal
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>Price Monitor</h2>
          <p className={`mt-1 ${subText}`}>Track TP-Link product prices against competitors on Akakçe.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Server Status Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            serverOnline === null ? 'bg-[#A7A9AC]/10 text-[#A7A9AC] border-[#A7A9AC]/20' :
            serverOnline ? 'bg-[#4ACBD6]/10 text-[#4ACBD6] border-[#4ACBD6]/20' :
            'bg-[#C11C66]/10 text-[#C11C66] border-[#C11C66]/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              serverOnline === null ? 'bg-[#A7A9AC]' : serverOnline ? 'bg-[#4ACBD6] animate-pulse' : 'bg-[#C11C66]'
            }`} />
            {serverOnline === null ? 'Checking server...' : serverOnline ? 'API Ready' : 'API Offline – npm run server'}
          </div>
          <button
            onClick={exportCSV}
            disabled={Object.keys(results).length === 0}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
              isDarkMode ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#A7A9AC]/40 text-[#36444B] hover:bg-slate-50'
            }`}
          >
            <Download size={16} /> Export CSV
          </button>
          {isRunningAll ? (
            <button
              onClick={stopAll}
              className="flex items-center gap-2 px-4 py-2 bg-[#C11C66] text-white rounded-lg hover:bg-[#C11C66]/90 text-sm font-medium transition-colors shadow-sm"
            >
              <Square size={16} /> Stop
            </button>
          ) : (
            <button
              onClick={runAll}
              disabled={!serverOnline}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A3DF] text-white rounded-lg hover:bg-[#00A3DF]/90 text-sm font-medium transition-colors shadow-sm disabled:opacity-40"
            >
              <Play size={16} /> Check All
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: csvProducts.length, color: 'text-[#00A3DF]', bg: 'bg-[#00A3DF]/10', icon: Package },
          { label: 'Checked', value: totalChecked, color: 'text-[#4ACBD6]', bg: 'bg-[#4ACBD6]/10', icon: CheckCircle2 },
          { label: 'Violations', value: totalViolations, color: 'text-[#C11C66]', bg: 'bg-[#C11C66]/10', icon: BadgeAlert },
          { label: 'Normal', value: totalNormal, color: 'text-[#FFCB00]', bg: 'bg-[#FFCB00]/10', icon: ShieldCheck },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${subText}`}>{label}</span>
              <div className={`p-1.5 rounded-lg ${bg} ${color}`}><Icon size={14} /></div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Server Offline Warning */}
      {serverOnline === false && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFCB00]/10 border border-[#FFCB00]/30 text-[#FFCB00]">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Scraping API server is offline</p>
            <p className="text-xs mt-1 opacity-80">Open a new terminal and run: <code className="font-mono bg-black/20 px-1.5 py-0.5 rounded">npm run server</code></p>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className={`border rounded-xl shadow-sm overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wider ${subText} ${thBg}`}>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Threshold (₺)</th>
                <th className="p-4 font-medium">Lowest Price</th>
                <th className="p-4 font-medium">Seller</th>
                <th className="p-4 font-medium">Violations</th>
                <th className="p-4 font-medium">Last Check</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {csvProducts.map((product) => {
                const r = results[product.name];
                const isChecking = checking.has(product.name);
                const isExpanded = expandedRow === product.name;
                const violations = parseViolations(r?.otherViolations || '');
                const realViolations = violations.filter(v => !v.isSpecial);
                const hasViolations = violations.length > 0;
                const canExpand = !!r && r.status !== 'checking';
                const priceColor = r?.lowestPriceNum && r.lowestPriceNum <= product.threshold
                  ? 'text-[#C11C66] font-bold'
                  : textColor;

                return (
                  <React.Fragment key={product.name}>
                    {/* ── Main Row ── */}
                    <tr
                      onClick={() => canExpand && toggleExpand(product.name)}
                      className={`transition-colors border-b ${
                        isDarkMode ? 'border-white/5' : 'border-[#A7A9AC]/10'
                      } ${
                        canExpand ? 'cursor-pointer' : ''
                      } ${
                        isExpanded
                          ? isDarkMode ? 'bg-white/5' : 'bg-slate-50'
                          : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Product Name + expand chevron */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ChevronRight
                            size={15}
                            className={`shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            } ${
                              hasViolations ? 'text-[#C11C66]' : canExpand ? 'text-[#4ACBD6]' : 'text-[#A7A9AC]/30'
                            }`}
                          />
                          <span className={`font-semibold whitespace-nowrap ${
                            isExpanded
                              ? isDarkMode ? 'text-[#4ACBD6]' : 'text-[#00A3DF]'
                              : textColor
                          }`}>{product.name}</span>
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#A7A9AC] hover:text-[#00A3DF]"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>

                      {/* Threshold */}
                      <td className={`p-4 font-semibold whitespace-nowrap ${textColor}`}>
                        {product.threshold.toLocaleString('tr-TR')} ₺
                      </td>

                      {/* Lowest Price */}
                      <td className={`p-4 font-semibold whitespace-nowrap ${r ? priceColor : subText}`}>
                        {r?.lowestPrice ?? <span className="text-xs">—</span>}
                      </td>

                      {/* Lowest Seller */}
                      <td className={`p-4 text-sm whitespace-nowrap ${r ? textColor : subText}`}>
                        {r?.lowestPriceSeller ?? <span className="text-xs">—</span>}
                      </td>

                      {/* Violation Count Badge */}
                      <td className="p-4">
                        {hasViolations ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#C11C66]/10 text-[#C11C66] border border-[#C11C66]/25">
                            <ShieldAlert size={11} />
                            {realViolations.length > 0 ? realViolations.length : violations.length} sellers
                          </span>
                        ) : r?.status === 'normal' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4ACBD6]/10 text-[#4ACBD6] border border-[#4ACBD6]/20">
                            <ShieldCheck size={11} /> None
                          </span>
                        ) : r?.status === 'error' ? (
                          <span className={`text-xs ${subText}`} title={r.error}>—</span>
                        ) : (
                          <span className={`text-xs ${subText}`}>—</span>
                        )}
                      </td>

                      {/* Last Check */}
                      <td className={`p-4 text-xs ${subText} whitespace-nowrap`}>
                        {r?.inspectionTime
                          ? <span className="flex items-center gap-1.5"><Clock size={11} />{r.inspectionTime}</span>
                          : '—'}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge result={r} />
                      </td>

                      {/* Check Button */}
                      <td className="p-4 text-center">
                        <button
                          onClick={e => { e.stopPropagation(); checkProduct(product); }}
                          disabled={isChecking || isRunningAll || !serverOnline}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${
                            isDarkMode
                              ? 'bg-[#00A3DF]/20 text-[#4ACBD6] hover:bg-[#00A3DF]/30'
                              : 'bg-[#00A3DF]/10 text-[#00A3DF] hover:bg-[#00A3DF]/20'
                          }`}
                        >
                          {isChecking
                            ? <><Loader2 size={12} className="animate-spin" /> Checking...</>
                            : <><RefreshCw size={12} /> Check</>}
                        </button>
                      </td>
                    </tr>

                    {/* ── Expanded Violation Detail Panel ── */}
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={8}
                          className={`p-0 border-b ${
                            isDarkMode ? 'border-white/5 bg-[#1a2024]' : 'border-[#A7A9AC]/10 bg-slate-50/60'
                          }`}
                        >
                          <div className="px-6 py-5">
                            {/* Panel Header */}
                            {hasViolations ? (
                              <>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-1.5 rounded-lg bg-[#C11C66]/10">
                                    <ShieldAlert size={15} className="text-[#C11C66]" />
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold text-sm ${textColor}`}>
                                      Violating Sellers
                                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[#C11C66]/10 text-[#C11C66]">
                                        {violations.length}
                                      </span>
                                    </h4>
                                    <p className={`text-xs mt-0.5 ${subText}`}>
                                      Threshold: <span className="font-semibold text-[#FFCB00]">{product.threshold.toLocaleString('tr-TR')} ₺</span>
                                      {' '}— All sellers pricing below this threshold are listed.
                                    </p>
                                  </div>
                                </div>

                                {/* Seller Cards Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                  {violations.map((v, idx) => {
                                    const diff = product.threshold - v.priceNum;
                                    const diffPct = isFinite(v.priceNum) && v.priceNum < 999999
                                      ? ((diff / product.threshold) * 100).toFixed(1)
                                      : null;
                                    return (
                                      <div
                                        key={idx}
                                        className={`relative p-3 rounded-xl border transition-all ${
                                          v.isSpecial
                                            ? isDarkMode
                                              ? 'border-dashed border-white/10 bg-white/3 opacity-60'
                                              : 'border-dashed border-[#A7A9AC]/30 bg-white/40 opacity-70'
                                            : isDarkMode
                                              ? 'border-[#C11C66]/20 bg-[#C11C66]/5 hover:bg-[#C11C66]/10'
                                              : 'border-[#C11C66]/15 bg-[#C11C66]/3 hover:bg-[#C11C66]/8'
                                        }`}
                                      >
                                        {/* Seller Name */}
                                        <p
                                          className={`text-xs font-semibold truncate mb-1.5 ${
                                            v.isSpecial ? subText : 'text-[#C11C66]'
                                          }`}
                                          title={v.name}
                                        >
                                          {v.name}
                                        </p>

                                        {/* Price */}
                                        <p className={`text-base font-bold leading-tight ${textColor}`}>
                                          {v.price}
                                        </p>

                                        {/* Diff from Threshold */}
                                        {diffPct && (
                                          <div className="mt-2 pt-2 border-t border-[#C11C66]/15">
                                            <p className="text-xs text-[#C11C66] font-medium">
                                              −{diff > 0 ? diff.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '?'} ₺
                                              <span className="ml-1 opacity-70">({diffPct}%)</span>
                                            </p>
                                          </div>
                                        )}

                                        {/* Special Label */}
                                        {v.isSpecial && (
                                          <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded ${subText} ${isDarkMode ? 'bg-white/5' : 'bg-[#A7A9AC]/10'}`}>
                                            Special
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            ) : r?.status === 'normal' ? (
                              <div className="flex items-center gap-3 py-2">
                                <div className="p-1.5 rounded-lg bg-[#4ACBD6]/10">
                                  <ShieldCheck size={15} className="text-[#4ACBD6]" />
                                </div>
                                <div>
                                  <p className={`text-sm font-semibold ${textColor}`}>No violations detected</p>
                                  <p className={`text-xs mt-0.5 ${subText}`}>All sellers are pricing above the threshold.</p>
                                </div>
                              </div>
                            ) : r?.status === 'error' ? (
                              <div className="flex items-center gap-3 py-2">
                                <div className="p-1.5 rounded-lg bg-[#C11C66]/10">
                                  <AlertCircle size={15} className="text-[#C11C66]" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#C11C66]">Scraping error</p>
                                  <p className={`text-xs mt-0.5 ${subText} max-w-xl`}>{r.error}</p>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${subText} ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#A7A9AC]/20'
        }`}>
          <span>{csvProducts.length} products • loaded from products.csv • Click a row to view details</span>
          {totalErrors > 0 && (
            <span className="text-[#C11C66] flex items-center gap-1">
              <AlertCircle size={12} /> {totalErrors} product(s) failed – page structure may have changed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Price Tracking Component (existing)
// ==========================================

const PriceTracking = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const cardBg = isDarkMode ? 'bg-[#212628] border-white/10' : 'bg-white border-[#A7A9AC]/20';
  const textColor = isDarkMode ? 'text-white' : 'text-[#36444B]';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-[#A7A9AC]/10';

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>Price Tracking</h2>
          <p className="text-[#A7A9AC] mt-1">Detailed weekly comparison of your products vs competitors.</p>
        </div>
        <div className="flex gap-3">
          <button className={`flex-1 sm:flex-none px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
            isDarkMode 
              ? 'border-white/20 text-white hover:bg-white/10' 
              : 'border-[#A7A9AC]/40 text-[#36444B] hover:bg-slate-50'
          }`}>
            Export CSV
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-[#00A3DF] text-white rounded-lg hover:bg-[#00A3DF]/90 transition-colors font-medium text-sm shadow-sm">
            Sync Data Now
          </button>
        </div>
      </div>

      <div className={`border rounded-xl shadow-sm overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wider text-[#A7A9AC] ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#A7A9AC]/20'
              }`}>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Our Price</th>
                <th className="p-4 font-medium">Competitor A</th>
                <th className="p-4 font-medium">Competitor B</th>
                <th className="p-4 font-medium text-center">Trend</th>
                <th className="p-4 font-medium">Last Updated</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {mockProducts.map((product) => {
                const isCompALower = product.compA < product.ourPrice;
                const isCompBLower = product.compB < product.ourPrice;
                
                return (
                  <tr key={product.id} className={`transition-colors group ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={`w-10 h-10 rounded border object-cover shrink-0 ${isDarkMode ? 'border-white/20' : 'border-[#A7A9AC]/20'}`}
                          referrerPolicy="no-referrer"
                        />
                        <span className={`font-semibold transition-colors whitespace-nowrap ${
                          isDarkMode ? 'text-white group-hover:text-[#4ACBD6]' : 'text-[#36444B] group-hover:text-[#00A3DF]'
                        }`}>{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#A7A9AC] whitespace-nowrap">{product.category}</td>
                    <td className={`p-4 font-semibold whitespace-nowrap ${textColor}`}>${product.ourPrice.toFixed(2)}</td>
                    <td className={`p-4 font-medium whitespace-nowrap ${isCompALower ? 'text-[#C11C66] font-bold' : textColor}`}>
                      ${product.compA.toFixed(2)}
                    </td>
                    <td className={`p-4 font-medium whitespace-nowrap ${isCompBLower ? 'text-[#C11C66] font-bold' : textColor}`}>
                      ${product.compB.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        {product.trend === 'up' && <TrendingUp size={18} className="text-[#C11C66]" />}
                        {product.trend === 'down' && <TrendingDown size={18} className="text-[#4ACBD6]" />}
                        {product.trend === 'stable' && <Minus size={18} className="text-[#A7A9AC]" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#A7A9AC] whitespace-nowrap">{product.lastUpdated}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${product.status === 'Competitive' ? 'bg-[#4ACBD6]/10 text-[#4ACBD6] border-[#4ACBD6]/20' : ''}
                        ${product.status === 'At Risk' ? 'bg-[#FFCB00]/10 text-[#FFCB00] border-[#FFCB00]/20' : ''}
                        ${product.status === 'Expensive' ? 'bg-[#C11C66]/10 text-[#C11C66] border-[#C11C66]/20' : ''}
                      `}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A7A9AC] ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#A7A9AC]/20'
        }`}>
          <span>Showing 1 to 6 of 1,248 entries</span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 border rounded transition-colors disabled:opacity-50 ${
              isDarkMode ? 'border-white/20 hover:bg-white/10' : 'border-[#A7A9AC]/40 hover:bg-white'
            }`} disabled>Previous</button>
            <button className={`px-3 py-1 border rounded transition-colors font-medium ${
              isDarkMode ? 'bg-[#00A3DF] text-white border-[#00A3DF]' : 'bg-white text-[#00A3DF] border-[#00A3DF]/30'
            }`}>1</button>
            <button className={`px-3 py-1 border rounded transition-colors ${
              isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-[#A7A9AC]/40 hover:bg-white text-[#36444B]'
            }`}>2</button>
            <button className={`px-3 py-1 border rounded transition-colors ${
              isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-[#A7A9AC]/40 hover:bg-white text-[#36444B]'
            }`}>3</button>
            <button className={`px-3 py-1 border rounded transition-colors ${
              isDarkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-[#A7A9AC]/40 hover:bg-white text-[#36444B]'
            }`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#36444B] selection:bg-[#4ACBD6]/30 selection:text-white' : 'bg-slate-50 selection:bg-[#00A3DF]/20 selection:text-[#212628]'
    }`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isDarkMode={isDarkMode} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <main className="flex-1 overflow-x-hidden">
          {activeView === 'dashboard' && <Dashboard isDarkMode={isDarkMode} />}
          {activeView === 'tracking' && <PriceTracking isDarkMode={isDarkMode} />}
          {activeView === 'monitor' && <PriceMonitor isDarkMode={isDarkMode} />}
          {activeView !== 'dashboard' && activeView !== 'tracking' && activeView !== 'monitor' && (
            <div className="p-4 sm:p-8 flex flex-col items-center justify-center h-full text-[#A7A9AC] animate-in fade-in">
              <Package size={48} className="mb-4 opacity-20" />
              <h2 className={`text-xl font-medium text-center ${isDarkMode ? 'text-white' : 'text-[#36444B]'}`}>Module Under Construction</h2>
              <p className="mt-2 text-center">The {activeView} view is not yet implemented in this prototype.</p>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`mt-6 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isDarkMode ? 'bg-[#00A3DF]/20 text-[#4ACBD6] hover:bg-[#00A3DF]/30' : 'bg-[#00A3DF]/10 text-[#00A3DF] hover:bg-[#00A3DF]/20'
                }`}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
