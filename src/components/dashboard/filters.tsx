"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { FilterOptions } from "@/types"
import { Filter, X } from "lucide-react"

interface FiltersProps {
  onApply: (filters: FilterOptions) => void
  isLoading?: boolean
}

export function Filters({ onApply, isLoading }: FiltersProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'ytd',
    channel: '',
    city: ''
  })

  const handleApply = () => {
    onApply(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({
      period: 'ytd',
      channel: '',
      city: ''
    })
    onApply({
      period: 'ytd',
      channel: '',
      city: ''
    })
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        {t("filter")}
      </Button>

      {isOpen && (
        <Card className="absolute top-16 left-4 z-50 w-80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("filter")}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("period")}
              </label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value as FilterOptions['period'] })}
                className="w-full p-2 border rounded-md bg-background text-foreground border-input"
              >
                <option value="7d">7 {t("days")}</option>
                <option value="30d">30 {t("days")}</option>
                <option value="qtd">{t("quarter")}</option>
                <option value="ytd">{t("year")}</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("channel")}
              </label>
              <select
                value={filters.channel || ''}
                onChange={(e) => setFilters({ ...filters, channel: e.target.value || undefined })}
                className="w-full p-2 border rounded-md bg-background text-foreground border-input"
              >
                <option value="">{t("all")}</option>
                <option value="Web">{t("web")}</option>
                <option value="Mobile">{t("mobile")}</option>
                <option value="Offline">{t("offline")}</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("city")}
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                className="w-full p-2 border rounded-md bg-background text-foreground border-input"
              >
                <option value="">{t("all")}</option>
                <option value="Алматы">{t("almaty")}</option>
                <option value="Астана">{t("astana")}</option>
                <option value="Шымкент">{t("shymkent")}</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApply} disabled={isLoading} className="flex-1">
                {t("apply")}
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex-1">
                {t("reset")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
