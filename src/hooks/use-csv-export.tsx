"use client"

import { useCallback } from "react"
import { downloadCSV } from "@/lib/utils"

interface UseCsvExportOptions {
  filename?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useCsvExport<T extends Record<string, any>>(
  data: T[],
  options: UseCsvExportOptions = {}
) {
  const { filename, onSuccess, onError } = options

  const exportToCsv = useCallback(() => {
    try {
      if (!data || data.length === 0) {
        throw new Error("No data to export")
      }

      // Get headers from the first object
      const headers = Object.keys(data[0])
      
      // Create CSV content
      const csvContent = [
        headers,
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            // Handle nested objects and arrays
            if (typeof value === 'object' && value !== null) {
              return `"${JSON.stringify(value)}"`
            }
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const stringValue = String(value || '')
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
          })
        )
      ]
        .map(row => row.join(','))
        .join('\n')

      // Generate filename with timestamp if not provided
      const defaultFilename = `export-${new Date().toISOString().split('T')[0]}.csv`
      const finalFilename = filename || defaultFilename

      // Download the CSV
      downloadCSV(csvContent, finalFilename)
      
      onSuccess?.()
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Export failed')
      onError?.(errorObj)
    }
  }, [data, filename, onSuccess, onError])

  return {
    exportToCsv,
    isExportable: data && data.length > 0
  }
}
