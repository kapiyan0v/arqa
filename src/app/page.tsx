"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Filters } from "@/components/dashboard/filters"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { api } from "@/lib/api"
import { FilterOptions } from "@/types"
import { Download } from "lucide-react"
import { downloadCSV } from "@/lib/utils"

export default function Dashboard() {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'ytd',
    channel: '',
    city: ''
  })

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => api.getDashboardMetrics(filters),
    initialData: {
      revenue: 0,
      orders: 0,
      aov: 0,
      conversionRate: 0
    }
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chart-data', filters],
    queryFn: () => api.getChartData(filters),
    initialData: []
  })

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleExport = async () => {
    try {
      const csvContent = await api.exportToCSV(filters)
      downloadCSV(csvContent, `arqa-analytics-${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-muted-foreground">
            {t("dashboardDescription")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Filters onApply={handleApplyFilters} isLoading={metricsLoading} />
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
        </div>
      </div>

      <MetricsCards metrics={metrics} isLoading={metricsLoading} />
      
      <RevenueChart data={chartData || []} isLoading={chartLoading} />
    </div>
  )
}
