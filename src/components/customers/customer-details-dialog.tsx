"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { api } from "@/lib/api"
import { Customer, Order } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

interface CustomerDetailsDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const { t } = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { data: customerOrders, isLoading } = useQuery({
    queryKey: ['customer-orders', customer.id],
    queryFn: () => api.getOrders({ period: 'ytd' }).then(orders => 
      orders.filter(order => order.customerId === customer.id)
    ),
    enabled: open
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("customerDetails")} - {customer.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("name")}</label>
              <p className="text-sm">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("email")}</label>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("city")}</label>
              <p className="text-sm">{customer.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("ltv")}</label>
              <p className="text-sm font-semibold">{formatCurrency(customer.ltv)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("ordersCount")}</label>
              <p className="text-sm">{customer.ordersCount}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orderHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : customerOrders && customerOrders.length > 0 ? (
                <div className="space-y-3">
                  {customerOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="flex justify-between items-center py-2 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 rounded p-2"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.date)} • {t(order.status.toLowerCase())}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noOrders")}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("orderDetails")} - {selectedOrder.id}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("date")}</label>
                    <p className="text-sm">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("status")}</label>
                    <p className="text-sm">{t(selectedOrder.status.toLowerCase())}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("city")}</label>
                    <p className="text-sm">{selectedOrder.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("total")}</label>
                    <p className="text-sm font-semibold">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("orderItems")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.sku} • {item.qty} {t("pcs")}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
