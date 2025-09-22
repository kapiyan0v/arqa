"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { useLanguage } from "@/hooks/use-language"
import { api } from "@/lib/api"
import { Order } from "@/types"

export default function OrdersPage() {
  const { t } = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', searchTerm, statusFilter],
    queryFn: () => api.getOrders({
      period: 'ytd'
    }),
  })

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("orders")}</h1>
        <p className="text-muted-foreground">
          {t("ordersDescription")}
        </p>
      </div>

      <OrdersTable 
        orders={filteredOrders}
        isLoading={isLoading}
        onOrderClick={setSelectedOrder}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
