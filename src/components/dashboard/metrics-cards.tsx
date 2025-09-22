"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { DashboardMetrics } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface MetricsCardsProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  const { t } = useLanguage()

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: t("revenue"),
      value: formatCurrency(metrics.revenue),
      description: "₸"
    },
    {
      title: t("ordersCount"),
      value: formatNumber(metrics.orders),
      description: t("orders")
    },
    {
      title: t("aov"),
      value: formatCurrency(metrics.aov),
      description: "₸"
    },
    {
      title: t("conversionRate"),
      value: formatPercentage(metrics.conversionRate),
      description: "%"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
