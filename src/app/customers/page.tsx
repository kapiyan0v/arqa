"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CustomersTable } from "@/components/customers/customers-table"
import { CustomerDetailsDialog } from "@/components/customers/customer-details-dialog"
import { useLanguage } from "@/hooks/use-language"
import { api } from "@/lib/api"
import { Customer } from "@/types"

export default function CustomersPage() {
  const { t } = useLanguage()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchTerm, cityFilter],
    queryFn: () => api.getCustomers({
      search: searchTerm,
      city: cityFilter || undefined
    }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("customers")}</h1>
        <p className="text-muted-foreground">
          {t("customersDescription")}
        </p>
      </div>

      <CustomersTable 
        customers={customers || []}
        isLoading={isLoading}
        onCustomerClick={setSelectedCustomer}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
      />

      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}
