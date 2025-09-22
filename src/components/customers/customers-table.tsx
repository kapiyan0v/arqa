"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { Customer } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Search } from "lucide-react"

interface CustomersTableProps {
  customers: Customer[]
  isLoading?: boolean
  onCustomerClick: (customer: Customer) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  cityFilter: string
  onCityFilterChange: (city: string) => void
}

export function CustomersTable({
  customers,
  isLoading,
  onCustomerClick,
  searchTerm,
  onSearchChange,
  cityFilter,
  onCityFilterChange
}: CustomersTableProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("customers")}</CardTitle>
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
          <CardTitle>{t("customers")}</CardTitle>
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
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground border-input"
            >
              <option value="">{t("all")} {t("cities")}</option>
              <option value="Алматы">{t("almaty")}</option>
              <option value="Астана">{t("astana")}</option>
              <option value="Шымкент">{t("shymkent")}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("city")}</TableHead>
              <TableHead className="text-right">{t("ltv")}</TableHead>
              <TableHead className="text-right">{t("ordersCount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onCustomerClick(customer)}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell className="text-right">{formatCurrency(customer.ltv)}</TableCell>
                <TableCell className="text-right">{customer.ordersCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
