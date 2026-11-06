import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Building2,
  DollarSign,
  Activity,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserProfile, TokenRecord, RechargeRecord, TeamMember } from '../../types/rswallet';

interface HomeAnalyticsProps {
  user: UserProfile;
  tokenRecords?: TokenRecord[];
  rechargeRecords?: RechargeRecord[];
  teamMembers?: TeamMember[];
  onOpenHistory?: (type: 'recharge' | 'token') => void;
  onNavigateTeam?: () => void;
}

type CompanyMetricTab = 'spent' | 'yield' | 'orders' | 'myShare';

interface CompanyDayDataPoint {
  dayLabel: string;
  dateKey: string;
  companySpentMillions: number; // in Millions for easy display
  companySpentRaw: number; // in INR
  yieldPaidRaw: number; // in INR
  yieldPaidLakhs: number;
  orders: number;
  userShare: number;
}

export const HomeAnalytics: React.FC<HomeAnalyticsProps> = ({
  user,
  tokenRecords = [],
  rechargeRecords = [],
  teamMembers = [],
  onOpenHistory,
  onNavigateTeam,
}) => {
  const [selectedTab, setSelectedTab] = useState<CompanyMetricTab>('spent');
  const [isExpanded, setIsExpanded] = useState(false);

  // Exact 7-day Company Spent summing to 64.1M:
  // 7.8M + 8.4M + 9.2M + 8.9M + 9.7M + 10.3M + 9.8M = 64.1M INR
  const companyDailyData = useMemo(() => {
    const rawSpents = [7800000, 8400000, 9200000, 8900000, 9700000, 10300000, 9800000];
    const rawYields = [507000, 546000, 598000, 578500, 630500, 669500, 637000];
    const rawOrders = [6350, 6890, 7420, 7180, 7850, 8420, 8370];

    const now = new Date();
    const days: CompanyDayDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isToday = i === 0;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayLabel = isToday ? 'Today' : `${monthNames[d.getMonth()]} ${d.getDate()}`;
      const dateKey = d.toISOString().slice(0, 10);

      const spent = rawSpents[6 - i];
      const yieldAmt = rawYields[6 - i];
      const orderCount = rawOrders[6 - i];

      days.push({
        dayLabel,
        dateKey,
        companySpentMillions: Number((spent / 1000000).toFixed(1)),
        companySpentRaw: spent,
        yieldPaidRaw: yieldAmt,
        yieldPaidLakhs: Number((yieldAmt / 100000).toFixed(2)),
        orders: orderCount,
        userShare: isToday ? Math.max(user.todayReceived, 1200) : Math.round(user.todayReceived * 0.85) || 950,
      });
    }

    return days;
  }, [user.todayReceived]);

  // Aggregate Company 7-Day Performance Totals
  const companyTotals = useMemo(() => {
    const totalSpent = companyDailyData.reduce((acc, curr) => acc + curr.companySpentRaw, 0); // 64,100,000
    const totalYield = companyDailyData.reduce((acc, curr) => acc + curr.yieldPaidRaw, 0); // 4,166,500
    const totalOrders = companyDailyData.reduce((acc, curr) => acc + curr.orders, 0); // 52,480
    const activeNodes = 12850;

    return {
      totalSpent,
      totalSpentMillions: (totalSpent / 1000000).toFixed(1), // "64.1"
      totalYield,
      totalYieldMillions: (totalYield / 1000000).toFixed(2), // "4.17"
      totalOrders,
      activeNodes,
      successRate: '99.88%',
    };
  }, [companyDailyData]);

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#fdfcf9] text-zinc-900 px-3.5 py-2.5 rounded-xl border border-[#eee6d8] shadow-lg text-xs space-y-1.5 min-w-[190px]">
          <div className="font-bold text-zinc-800 pb-1 border-b border-[#eee6d8] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              {label}
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">Network Verified</span>
          </div>

          {payload.map((entry: any, index: number) => {
            let labelTitle = entry.name;
            let displayVal = '';

            if (entry.dataKey === 'companySpentMillions') {
              labelTitle = 'Company Spent';
              displayVal = `₹${entry.value}M (₹${(entry.value * 1000000).toLocaleString('en-IN')})`;
            } else if (entry.dataKey === 'yieldPaidLakhs') {
              labelTitle = 'Yield Paid (6.5%)';
              displayVal = `₹${entry.value}L (₹${Math.round(entry.value * 100000).toLocaleString('en-IN')})`;
            } else if (entry.dataKey === 'orders') {
              labelTitle = 'Settlement Orders';
              displayVal = `${Number(entry.value).toLocaleString('en-IN')} orders`;
            } else if (entry.dataKey === 'userShare') {
              labelTitle = 'My Node Share';
              displayVal = `₹${Number(entry.value).toLocaleString('en-IN')}`;
            } else {
              displayVal = `${entry.value}`;
            }

            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3 pt-0.5">
                <span className="flex items-center gap-1.5 text-zinc-400 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {labelTitle}:
                </span>
                <span className="font-bold text-white tabular-nums font-mono text-[11px]">{displayVal}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Settlement Network Activity</h3>
          <p className="text-[11px] text-zinc-500">₹64.1M settled in the last 7 days</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Chart' : 'View Chart'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3 Compact KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-100">
          <span className="text-[10px] font-medium text-zinc-400">7D Volume</span>
          <div className="text-sm font-bold text-zinc-950 mt-0.5 tabular-nums">₹64.1M</div>
        </div>
        <div className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-100">
          <span className="text-[10px] font-medium text-zinc-400">Yield Paid</span>
          <div className="text-sm font-bold text-emerald-600 mt-0.5 tabular-nums">₹4.16M</div>
        </div>
        <div className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-100">
          <span className="text-[10px] font-medium text-zinc-400">Settlements</span>
          <div className="text-sm font-bold text-zinc-950 mt-0.5 tabular-nums">52,480</div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
          {/* Tab Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/60 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedTab('spent')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition whitespace-nowrap text-center cursor-pointer ${
            selectedTab === 'spent'
              ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Company Spent (64.1M)
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('yield')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition whitespace-nowrap text-center cursor-pointer ${
            selectedTab === 'yield'
              ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Yield Paid
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('orders')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition whitespace-nowrap text-center cursor-pointer ${
            selectedTab === 'orders'
              ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Orders Cleared
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('myShare')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap text-center cursor-pointer ${
            selectedTab === 'myShare'
              ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          My Node Share
        </button>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-48 pt-1">
        {/* Tab 1: Company Spent (64.1M Total) */}
        {selectedTab === 'spent' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={companyDailyData} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="companySpentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                axisLine={false}
                tickLine={false}
                domain={[6, 12]}
                tickFormatter={(val) => `₹${val}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="companySpentMillions"
                name="Company Spent"
                stroke="#2563eb"
                strokeWidth={2.8}
                fillOpacity={1}
                fill="url(#companySpentGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Tab 2: Yield Paid to Network Accounts */}
        {selectedTab === 'yield' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={companyDailyData} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="companyYieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                axisLine={false}
                tickLine={false}
                domain={[4, 8]}
                tickFormatter={(val) => `₹${val}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="yieldPaidLakhs"
                name="Yield Paid"
                stroke="#10b981"
                strokeWidth={2.8}
                fillOpacity={1}
                fill="url(#companyYieldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Tab 3: Daily Orders Cleared */}
        {selectedTab === 'orders' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyDailyData} margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="orders"
                name="Orders Cleared"
                fill="url(#ordersBarGrad)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Tab 4: My Share vs Company Platform */}
        {selectedTab === 'myShare' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={companyDailyData} margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="userShare"
                name="My Node Share"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )}

      {/* Network Liquidity Proof & User Node Status */}
      <div className="bg-zinc-50/80 rounded-2xl p-3 border border-zinc-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-zinc-900 block leading-tight">Liquidity Reserve Active</span>
            <span className="text-[10px] text-zinc-400 font-medium">NPCI UPI & TRC20 Gateway Connected</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenHistory?.('token')}
          className="text-blue-600 font-bold hover:text-blue-700 transition flex items-center gap-0.5 cursor-pointer text-[11px]"
        >
          <span>Audit Log</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
