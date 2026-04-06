import React, { useState } from 'react';
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
  Sun
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
          {activeView !== 'dashboard' && activeView !== 'tracking' && (
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
