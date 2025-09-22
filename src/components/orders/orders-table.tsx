"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useRole } from "@/hooks/use-role"
import { api } from "@/lib/api"
import { Order } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Search, ChevronDown } from "lucide-react"
import { toast } from "sonner"

interface OrdersTableProps {
  orders: Order[]
  isLoading?: boolean
  onOrderClick: (order: Order) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function OrdersTable({
  orders,
  isLoading,
  onOrderClick,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: OrdersTableProps) {
  const { t } = useLanguage()
  const { isAdmin } = useRole()
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(t("statusUpdated"))
    },
    onError: () => {
      toast.error(t("updateFailed"))
    }
  })

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateStatusMutation.mutate({ orderId, status: newStatus })
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("orders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("orders")}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground border-input"
            >
              <option value="">{t("all")} {t("status")}</option>
              <option value="New">{t("new")}</option>
              <option value="Processing">{t("processing")}</option>
              <option value="Shipped">{t("shipped")}</option>
              <option value="Delivered">{t("delivered")}</option>
              <option value="Cancelled">{t("cancelled")}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("orderId")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("city")}</TableHead>
              <TableHead>{t("channel")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onOrderClick(order)}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{order.customerId}</TableCell>
                <TableCell>{order.city}</TableCell>
                <TableCell>{t(order.channel.toLowerCase())}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(order.status.toLowerCase())}
                    </span>
                    {isAdmin && (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs border-none bg-background text-foreground focus:outline-none"
                      >
                        <option value="New">{t("new")}</option>
                        <option value="Processing">{t("processing")}</option>
                        <option value="Shipped">{t("shipped")}</option>
                        <option value="Delivered">{t("delivered")}</option>
                        <option value="Cancelled">{t("cancelled")}</option>
                      </select>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
