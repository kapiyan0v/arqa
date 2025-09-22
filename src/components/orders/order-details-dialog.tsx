"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { Order } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

interface OrderDetailsDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("orderDetails")} - {order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("date")}</label>
              <p className="text-sm">{formatDate(order.date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("customer")}</label>
              <p className="text-sm">{order.customerId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("city")}</label>
              <p className="text-sm">{order.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("channel")}</label>
              <p className="text-sm">{t(order.channel.toLowerCase())}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("status")}</label>
              <p className="text-sm">{t(order.status.toLowerCase())}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("total")}</label>
              <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orderItems")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
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

          {order.comment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("comment")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.comment}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
