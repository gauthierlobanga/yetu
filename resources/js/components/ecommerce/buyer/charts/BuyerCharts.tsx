"use client"

import * as React from "react"
import { TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)

const MONTHS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
]

function formatMonth(monthStr: string) {
  // expected format: YYYY-MM
  const [year, month] = monthStr.split("-")
  return `${MONTHS[parseInt(month) - 1]} ${year}`
}

/* -------------------------------------------------------------------------- */
/* ChartAreaGradient : Dépenses mensuelles (6 derniers mois)                  */
/* -------------------------------------------------------------------------- */

const gradientChartConfig = {
  total: {
    label: "Dépenses",
    color: "#10b981", // Emerald 500
  },
} satisfies ChartConfig

export function ChartAreaGradient({
  monthlyOrders,
}: {
  monthlyOrders: Record<string, { count: number; total: number }>
}) {
  const chartData = Object.entries(monthlyOrders).map(([key, value]) => ({
    month: formatMonth(key),
    total: value.total,
  }))

  const totalSpent = chartData.reduce((acc, curr) => acc + curr.total, 0)

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Dépenses mensuelles</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Évolution de vos dépenses sur les 6 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={gradientChartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatPrice(value as number)}
                />
              }
            />
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              fillOpacity={0.4}
              stroke="var(--color-total)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium text-slate-900 dark:text-white">
              Total dépensé : {formatPrice(totalSpent)} <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground text-slate-500 dark:text-slate-400">
              Ces 6 derniers mois
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* ChartAreaInteractive : Historique détaillé des dépenses                    */
/* -------------------------------------------------------------------------- */

const interactiveChartConfig = {
  total: {
    label: "Dépenses",
    color: "#10b981", // Emerald 500
  },
} satisfies ChartConfig

export function ChartAreaInteractive({
  dailySpending,
}: {
  dailySpending: { date: string; count: number; total: number }[]
}) {
  const [timeRange, setTimeRange] = React.useState("90d")

  // Generate continuous dates for the selected range to avoid missing days
  const referenceDate = new Date()
  let daysToSubtract = 90
  if (timeRange === "30d") {
    daysToSubtract = 30
  } else if (timeRange === "7d") {
    daysToSubtract = 7
  }
  
  const startDate = new Date(referenceDate)
  startDate.setDate(startDate.getDate() - daysToSubtract)

  const filteredData = dailySpending.filter((item) => {
    const date = new Date(item.date)
    return date >= startDate
  })

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-slate-200/60 dark:border-slate-800/60 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Historique détaillé</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Vos dépenses quotidiennes
          </CardDescription>
        </div>
        <div className="flex items-center px-6 py-4 sm:border-l sm:border-slate-200/60 dark:sm:border-slate-800/60 sm:py-6">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg border-slate-200 bg-white/50 hover:bg-slate-50 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              aria-label="Sélectionner la période"
            >
              <SelectValue placeholder="90 derniers jours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                90 derniers jours
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer
          config={interactiveChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotalInteractive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  formatter={(value) => formatPrice(value as number)}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotalInteractive)"
              stroke="var(--color-total)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* ChartLineLabel : Nombre de commandes                                       */
/* -------------------------------------------------------------------------- */

const lineLabelConfig = {
  count: {
    label: "Commandes",
    color: "#0f172a", // Slate 900 for Light Mode, will map to currentColor conceptually or specific value if we need
  },
} satisfies ChartConfig

export function ChartLineLabel({
  monthlyOrders,
}: {
  monthlyOrders: Record<string, { count: number; total: number }>
}) {
  const chartData = Object.entries(monthlyOrders).map(([key, value]) => ({
    month: formatMonth(key).substring(0, 3), // short month
    count: value.count,
  }))

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Commandes passées</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Ces 6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={lineLabelConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke="#64748b" // Slate 500
              strokeWidth={2}
              dot={{
                fill: "#64748b",
              }}
              activeDot={{
                r: 6,
                fill: "#10b981", // Emerald on hover
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-slate-700 dark:fill-slate-300 font-semibold"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-slate-900 dark:text-white">
          Total : {totalOrders} commandes <PackageIcon className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="leading-none text-muted-foreground text-slate-500 dark:text-slate-400">
          Activité régulière de votre compte
        </div>
      </CardFooter>
    </Card>
  )
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
        </svg>
    )
}

/* -------------------------------------------------------------------------- */
/* ChartBarNegative : Bilan Fidélité (Gains vs Utilisations)                  */
/* -------------------------------------------------------------------------- */

const barNegativeConfig = {
  net_points: {
    label: "Points nets",
  },
} satisfies ChartConfig

export function ChartBarNegative({
  loyaltyHistory,
}: {
  loyaltyHistory: Record<string, { gain: number; utilisation: number }> | null
}) {
  const chartData = loyaltyHistory 
    ? Object.entries(loyaltyHistory).map(([key, value]) => ({
        month: formatMonth(key).substring(0, 3), // short month
        net_points: value.gain - value.utilisation,
        gain: value.gain,
        utilisation: value.utilisation
      }))
    : []

  if (!loyaltyHistory || chartData.length === 0) {
    return (
      <Card className="h-full flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Bilan Fidélité</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Ces 6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
          Aucune donnée de fidélité.
        </CardContent>
      </Card>
    )
  }

  const netTotal = chartData.reduce((acc, curr) => acc + curr.net_points, 0)

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Bilan Fidélité</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Gains et utilisations (Net)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={barNegativeConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="net_points" radius={[4, 4, 4, 4]}>
              <LabelList position="top" dataKey="month" fillOpacity={1} className="fill-slate-600 dark:fill-slate-400" />
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.net_points > 0 ? "#10b981" : "#f43f5e"} // emerald-500 and rose-500
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-slate-900 dark:text-white">
          {netTotal >= 0 ? (
            <>Tendance positive de {netTotal} points <ArrowUpRight className="h-4 w-4 text-emerald-500" /></>
          ) : (
            <>Tendance négative de {Math.abs(netTotal)} points <ArrowDownRight className="h-4 w-4 text-rose-500" /></>
          )}
        </div>
        <div className="leading-none text-muted-foreground text-slate-500 dark:text-slate-400">
          Bilan net de vos points de fidélité
        </div>
      </CardFooter>
    </Card>
  )
}
