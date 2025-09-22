import { Suspense } from "react"
import dynamic from "next/dynamic"
import { api } from "@/lib/api"
import { FilterOptions } from "@/types"

// Dynamic imports for better bundle optimization
const OrdersClient = dynamic(() => import("@/components/orders/orders-client").then(mod => ({ default: mod.OrdersClient })), {
  loading: () => <div>Loading orders...</div>
})

interface OrdersPageProps {
  searchParams: {
    search?: string
    status?: string
    period?: string
    channel?: string
    city?: string
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Parse search params into FilterOptions
  const filters: FilterOptions = {
    period: (searchParams.period as FilterOptions['period']) || 'ytd',
    channel: searchParams.channel || '',
    city: searchParams.city || ''
  }

  // Server-side data fetching
  const orders = await api.getOrders(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all orders
        </p>
      </div>

      <Suspense fallback={<div>Loading orders table...</div>}>
        <OrdersClient 
          initialOrders={orders}
          initialSearchTerm={searchParams.search || ""}
          initialStatusFilter={searchParams.status || ""}
          initialFilters={filters}
        />
      </Suspense>
    </div>
  )
}
