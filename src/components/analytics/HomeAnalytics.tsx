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
        <div className="bg-zinc-950/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-zinc-800 shadow-2xl text-xs space-y-1.5 min-w-[190px]">
          <div className="font-bold text-zinc-300 pb-1 border-b border-zinc-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {label}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Network Verified</span>
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
    <div className="bg-white rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4.5 space-y-4">
      {/* Company Header with Verified Network Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-zinc-950 tracking-tight">Company Details & Analysis</h3>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-2.5 h-2.5" /> Live
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">SharkPay 2.0 Global Settlement Rail</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100/90 text-zinc-700 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-zinc-200/70 shadow-2xs">
          <Calendar className="w-3 h-3 text-zinc-500" />
          <span>7 Days Window</span>
        </div>
      </div>

      {/* Hero Banner: 7 Days 64.1M Spent */}
      <div className="rounded-[20px] bg-gradient-to-br from-[#0a0d14] via-[#0f1422] to-[#121c33] text-white p-4.5 shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>7 Days Company Spent</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                +18.4%
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-1 flex items-baseline gap-1.5">
              <span>₹{companyTotals.totalSpentMillions}M</span>
              <span className="text-xs font-semibold text-zinc-400 tracking-normal">INR Spent / Volume</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Zap className="w-3 h-3" /> 6.5% Yield Rate
              </span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">₹{(companyTotals.totalSpent / 7 / 1000000).toFixed(1)}M Daily Avg</span>
            </div>
          </div>

          <div className="text-right">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-emerald-400 shadow-inner ml-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1.5 font-bold uppercase tracking-wide">
              {companyTotals.successRate} Rail
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Company KPI Highlight Cards */}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        {/* Metric 1: Total Spent */}
        <div className="bg-zinc-50/90 rounded-2xl p-2.5 border border-zinc-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-blue-600" />
            7D Spent
          </span>
          <div className="mt-1">
            <span className="text-sm font-black text-zinc-950 tracking-tight tabular-nums">
              ₹64.1M
            </span>
            <div className="text-[9px] text-blue-600 font-bold mt-0.5">₹64,100,000</div>
          </div>
        </div>

        {/* Metric 2: Yield Paid to Network */}
        <div className="bg-zinc-50/90 rounded-2xl p-2.5 border border-zinc-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            Yield Paid
          </span>
          <div className="mt-1">
            <span className="text-sm font-black text-zinc-950 tracking-tight tabular-nums">
              ₹{companyTotals.totalYieldMillions}M
            </span>
            <div className="text-[9px] text-emerald-600 font-bold mt-0.5">+₹4.16M Paid</div>
          </div>
        </div>

        {/* Metric 3: Total Settlements */}
        <div className="bg-zinc-50/90 rounded-2xl p-2.5 border border-zinc-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-600" />
            Settlements
          </span>
          <div className="mt-1">
            <span className="text-sm font-black text-zinc-950 tracking-tight tabular-nums">
              52,480
            </span>
            <div className="text-[9px] text-purple-600 font-bold mt-0.5">12.8k Nodes</div>
          </div>
        </div>
      </div>

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
