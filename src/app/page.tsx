import { Suspense } from "react"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { AggregatesDemo } from "@/components/dashboard/aggregates-demo"
import { api } from "@/lib/api"
import { FilterOptions } from "@/types"

interface DashboardPageProps {
  searchParams: {
    period?: string
    channel?: string
    city?: string
    startDate?: string
    endDate?: string
  }
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  // Parse search params into FilterOptions
  const filters: FilterOptions = {
    period: (searchParams.period as FilterOptions['period']) || 'ytd',
    channel: searchParams.channel || '',
    city: searchParams.city || '',
    startDate: searchParams.startDate,
    endDate: searchParams.endDate
  }

  // Server-side data fetching
  const [metrics, chartData, orders] = await Promise.all([
    api.getDashboardMetrics(filters),
    api.getChartData(filters),
    api.getOrders(filters)
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics dashboard for ARQA with orders, customers, and revenue tracking
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading metrics...</div>}>
        <MetricsCards metrics={metrics} isLoading={false} />
      </Suspense>
      
      <Suspense fallback={<div>Loading chart...</div>}>
        <RevenueChart data={chartData} isLoading={false} />
      </Suspense>

      <Suspense fallback={<div>Loading dashboard controls...</div>}>
        <DashboardClient initialFilters={filters} />
      </Suspense>

      <Suspense fallback={<div>Loading aggregates...</div>}>
        <AggregatesDemo orders={orders} />
      </Suspense>
    </div>
  )
}
