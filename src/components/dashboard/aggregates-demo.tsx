"use client"

import { useDashboardAggregates } from "@/hooks/use-dashboard-aggregates"
import { useCsvExport } from "@/hooks/use-csv-export"
import { Order } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface AggregatesDemoProps {
  orders: Order[]
}

export function AggregatesDemo({ orders }: AggregatesDemoProps) {
  const { t } = useLanguage()
  const aggregates = useDashboardAggregates(orders)
  
  // Export aggregates data
  const { exportToCsv, isExportable } = useCsvExport(
    [
      { metric: 'Total Revenue', value: aggregates.totalRevenue },
      { metric: 'Total Orders', value: aggregates.totalOrders },
      { metric: 'Average Order Value', value: aggregates.averageOrderValue },
      { metric: 'Conversion Rate', value: aggregates.conversionRate },
    ],
    {
      filename: `dashboard-aggregates-${new Date().toISOString().split('T')[0]}.csv`
    }
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Aggregates</h2>
        <Button 
          onClick={exportToCsv} 
          variant="outline" 
          size="sm"
          disabled={!isExportable}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Aggregates
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${aggregates.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregates.totalOrders.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${aggregates.averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregates.conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(aggregates.revenueByChannel).map(([channel, revenue]) => (
                <div key={channel} className="flex justify-between">
                  <span>{channel}</span>
                  <span className="font-medium">${revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(aggregates.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {aggregates.topCustomers.slice(0, 5).map((customer, index) => (
              <div key={customer.customerId} className="flex justify-between">
                <span>{customer.customerId}</span>
                <div className="text-right">
                  <div className="font-medium">${customer.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{customer.orderCount} orders</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
