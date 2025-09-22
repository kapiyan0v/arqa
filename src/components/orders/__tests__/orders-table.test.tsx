import { render, screen, fireEvent } from '@testing-library/react'
import { OrdersTable } from '../orders-table'
import { LanguageProvider } from '@/hooks/use-language'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2025-01-15',
    customerId: 'CUS-001',
    city: 'Алматы',
    channel: 'Web' as const,
    status: 'New' as const,
    total: 50000,
    items: [],
    comment: 'Test order'
  }
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage="en">
        {children}
      </LanguageProvider>
    </QueryClientProvider>
  )
}

describe('OrdersTable', () => {
  it('renders orders table', () => {
    render(
      <TestWrapper>
        <OrdersTable
          orders={mockOrders}
          onOrderClick={() => {}}
          searchTerm=""
          onSearchChange={() => {}}
          statusFilter=""
          onStatusFilterChange={() => {}}
        />
      </TestWrapper>
    )

    expect(screen.getByText('ORD-001')).toBeInTheDocument()
    expect(screen.getByText('CUS-001')).toBeInTheDocument()
    expect(screen.getByText('Алматы')).toBeInTheDocument()
  })

  it('handles search input', () => {
    const mockOnSearchChange = jest.fn()
    
    render(
      <TestWrapper>
        <OrdersTable
          orders={mockOrders}
          onOrderClick={() => {}}
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          statusFilter=""
          onStatusFilterChange={() => {}}
        />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'ORD' } })
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('ORD')
  })
})
