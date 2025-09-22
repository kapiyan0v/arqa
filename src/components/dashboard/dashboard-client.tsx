"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useCsvExport } from "@/hooks/use-csv-export"
import { FilterOptions } from "@/types"
import { Download } from "lucide-react"
import { api } from "@/lib/api"

// Dynamic imports for better bundle optimization
const Filters = dynamic(() => import("@/components/dashboard/filters").then(mod => ({ default: mod.Filters })), {
  loading: () => <div>Loading filters...</div>
})

interface DashboardClientProps {
  initialFilters: FilterOptions
}

export function DashboardClient({ initialFilters }: DashboardClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [orders, setOrders] = useState<any[]>([])

  // Sync filters with URL parameters
  useEffect(() => {
    const urlFilters: FilterOptions = {
      period: (searchParams.get('period') as FilterOptions['period']) || 'ytd',
      channel: searchParams.get('channel') || '',
      city: searchParams.get('city') || '',
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined
    }
    setFilters(urlFilters)
  }, [searchParams])

  // Load orders for export
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await api.getOrders(filters)
        setOrders(ordersData)
      } catch (error) {
        console.error('Failed to load orders:', error)
      }
    }
    loadOrders()
  }, [filters])

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    
    // Update URL with new filters
    const params = new URLSearchParams()
    if (newFilters.period) params.set('period', newFilters.period)
    if (newFilters.channel) params.set('channel', newFilters.channel)
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.startDate) params.set('startDate', newFilters.startDate)
    if (newFilters.endDate) params.set('endDate', newFilters.endDate)
    
    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : ''
    router.push(newUrl, { scroll: false })
  }

  // Use the CSV export hook
  const { exportToCsv, isExportable } = useCsvExport(orders, {
    filename: `arqa-analytics-${new Date().toISOString().split('T')[0]}.csv`,
    onSuccess: () => {
      console.log('Export successful')
    },
    onError: (error) => {
      console.error('Export failed:', error)
    }
  })

  return (
    <div className="flex items-center justify-end gap-4">
      <Filters onApply={handleApplyFilters} isLoading={false} />
      <Button 
        onClick={exportToCsv} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={!isExportable}
      >
        <Download className="h-4 w-4" />
        {t("export")}
      </Button>
    </div>
  )
}
