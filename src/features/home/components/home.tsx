"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentHistory } from "@/features/payment-history/hooks/use-payment-history";
import { cn, formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  getPaymentTypeLabel,
  PAYMENT_TYPE_COLORS,
  PAYMENT_TYPE_EMOJI,
  PAYMENT_TYPE_TABS,
} from "@/features/payment-history/constants";
import { Payment, PaymentTypeType } from "@/features/payment-history/schema";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  CalendarDays,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────

function groupByMonth(payments: Payment[], year: number) {
  const map = new Map<string, number>();

  for (let i = 0; i < 12; i++) {
    const key = dayjs().year(year).month(i).format("MMM");
    map.set(key, 0);
  }

  payments.forEach((p) => {
    if (dayjs(p.created_at).year() === year) {
      const key = dayjs(p.created_at).format("MMM");
      map.set(key, (map.get(key) || 0) + p.amount);
    }
  });

  return Array.from(map.entries()).map(([month, amount]) => ({ month, amount }));
}

function groupByType(payments: Payment[]) {
  const map = new Map<PaymentTypeType, number>();
  PAYMENT_TYPE_TABS.forEach((t) => map.set(t, 0));
  payments.forEach((p) => map.set(p.type, (map.get(p.type) || 0) + p.amount));

  return Array.from(map.entries())
    .map(([type, amount]) => ({
      name: getPaymentTypeLabel(type).replace("Hutang ", ""),
      value: amount,
      type,
    }))
    .filter((item) => item.value > 0);
}

function cumulativeData(payments: Payment[]) {
  const sorted = [...payments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  let cumulative = 0;
  return sorted.map((p) => {
    cumulative += p.amount;
    return { date: dayjs(p.created_at).format("DD MMM"), total: cumulative };
  });
}

const PIE_COLORS: Record<PaymentTypeType, string> = {
  HUTANG_MOBIL: "#0ea5e9",
  HUTANG_BAPAK: "#f59e0b",
  HUTANG_MBAIPIT: "#8b5cf6",
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{formatRupiah(payload[0].value)}</p>
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────

type FilterType = "ALL" | PaymentTypeType;

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-full cursor-pointer rounded-lg border-gray-200 bg-white text-xs font-semibold text-gray-700 sm:w-[140px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Section Header ───────────────────────────────────────

function SectionHeader({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children && <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

export function Home() {
  const { user } = useAuth();
  const { payments, isLoading, debts } = usePaymentHistory();
  const allPayments = payments ?? [];

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allPayments.forEach((p) => years.add(dayjs(p.created_at).year()));
    if (years.size === 0) years.add(dayjs().year());
    return Array.from(years).sort((a, b) => b - a);
  }, [allPayments]);

  const [chartYear, setChartYear] = useState(() => dayjs().year());
  const [chartType, setChartType] = useState<FilterType>("ALL");

  const filteredPayments = useMemo(() => {
    return allPayments.filter((p) => {
      const yearOk = dayjs(p.created_at).year() === chartYear;
      const typeOk = chartType === "ALL" || p.type === chartType;
      return yearOk && typeOk;
    });
  }, [allPayments, chartYear, chartType]);

  // Grand totals (unfiltered, all time)
  const grandTotal = allPayments.reduce((s, p) => s + p.amount, 0);
  const lastPayment = allPayments[0];

  // Chart data (filtered)
  const monthlyData = groupByMonth(filteredPayments, chartYear);
  const typeData = groupByType(filteredPayments);
  const cumulData = cumulativeData(filteredPayments);

  const barColor = chartType !== "ALL"
    ? PIE_COLORS[chartType]
    : "#0ea5e9";
  const areaColor = chartType !== "ALL"
    ? PIE_COLORS[chartType]
    : "#8b5cf6";

  const typeOptions = [
    { value: "ALL", label: "Semua Tipe" },
    ...PAYMENT_TYPE_TABS.map((t) => ({
      value: t,
      label: `${PAYMENT_TYPE_EMOJI[t]} ${getPaymentTypeLabel(t).replace("Hutang ", "")}`,
    })),
  ];
  const yearOptions = availableYears.map((y) => ({ value: String(y), label: String(y) }));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28">
      {/* ── Header ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-5 pt-12 pb-6"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-sm text-gray-400">{greeting()} 👋</p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {user?.user_metadata?.fullname || user?.email?.split("@")[0] || "User"}
          </h1>
        </div>
      </motion.div>

      <div className="relative space-y-4 px-4 -mt-1 z-10">
        {/* ── Summary Cards (3 debt types) ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="-mt-4 space-y-3"
        >
          {PAYMENT_TYPE_TABS.map((type) => {
            const typePayments = allPayments.filter((p) => p.type === type);
            const paid = typePayments.reduce((s, p) => s + p.amount, 0);
            const debt = debts?.find((d) => d.payment_type_code === type);
            const total = debt?.total_hutang || 0;
            const remaining = Math.max(0, total - paid);
            const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
            const colors = PAYMENT_TYPE_COLORS[type];

            return (
              <Link key={type} href="/history" className="block">
                <div className="group rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colors.light)}>
                        <span className="text-xl">{PAYMENT_TYPE_EMOJI[type]}</span>
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900">
                          {getPaymentTypeLabel(type)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {typePayments.length}x pembayaran
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* Progress bar */}
                  {total > 0 && (
                    <div className="mt-4">
                      <div className="flex items-end justify-between text-xs">
                        <span className="text-gray-400">
                          Dibayar <span className={cn("font-bold", colors.text)}>{formatRupiah(paid)}</span>
                        </span>
                        <span className="font-semibold text-gray-500">{pct}%</span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", colors.gradient)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[11px] text-gray-500">
                        <span>Sisa: <span className="font-semibold text-orange-600">{formatRupiah(remaining)}</span></span>
                        <span>Total: {formatRupiah(total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* ── Last Payment ─────────────────────────── */}
        {lastPayment && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link href={`/history/${lastPayment.id}`}>
              <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", PAYMENT_TYPE_COLORS[lastPayment.type].light)}>
                  <Clock className={cn("h-5 w-5", PAYMENT_TYPE_COLORS[lastPayment.type].text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pembayaran Terakhir</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatRupiah(lastPayment.amount)}{" "}
                    <span className="font-normal text-gray-400">· {dayjs(lastPayment.created_at).format("DD MMM YYYY")}</span>
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Bar Chart ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <SectionHeader icon={<CalendarDays className="h-4 w-4 text-gray-400" />} title="Pembayaran Bulanan">
            <FilterSelect
              value={String(chartYear)}
              onChange={(v) => setChartYear(Number(v))}
              options={yearOptions}
              placeholder="Tahun"
            />
            <FilterSelect
              value={chartType}
              onChange={(v) => setChartType(v as FilterType)}
              options={typeOptions}
              placeholder="Tipe"
            />
          </SectionHeader>

          {filteredPayments.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barCategoryGap="20%" margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fill: "#9ca3af" }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#9ca3af" }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1).replace('.0', '')}jt`} 
                  width={45}
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">Belum ada data</div>
          )}
        </motion.div>

        {/* ── Pie Chart ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <SectionHeader icon={<TrendingUp className="h-4 w-4 text-gray-400" />} title="Distribusi Tipe" />

          {typeData.length > 0 ? (
            <div className="flex items-center gap-5 mt-2">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {typeData.map((item) => (
                      <Cell key={item.type} fill={PIE_COLORS[item.type as PaymentTypeType]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {typeData.map((item) => {
                  const total = typeData.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={item.type} className="flex items-center gap-3">
                      <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: PIE_COLORS[item.type as PaymentTypeType] }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-600">
                          {item.name} <span className="text-gray-400 font-medium ml-0.5">({pct}%)</span>
                        </p>
                        <p className="text-sm font-bold text-gray-900">{formatRupiah(item.value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-[130px] items-center justify-center text-sm text-gray-400">Belum ada data</div>
          )}
        </motion.div>

        {/* ── Area Chart ───────────────────────────── */}
        {cumulData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <SectionHeader icon={<TrendingUp className="h-4 w-4 text-gray-400" />} title="Akumulasi Pembayaran" />

            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={cumulData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval="preserveStartEnd" dy={10} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1).replace('.0', '')}jt`} width={45} tickCount={5} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={areaColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={areaColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="total" stroke={areaColor} strokeWidth={3} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
