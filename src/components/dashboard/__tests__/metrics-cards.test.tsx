import { render, screen } from '@testing-library/react'
import { MetricsCards } from '../metrics-cards'
import { LanguageProvider } from '@/hooks/use-language'

const mockMetrics = {
  revenue: 100000,
  orders: 25, 
  aov: 4000,
  conversionRate: 15.5
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider defaultLanguage="en">
    {children}
  </LanguageProvider>
)

describe('MetricsCards', () => {
  it('renders metrics correctly', () => {
    render(
      <TestWrapper>
        <MetricsCards metrics={mockMetrics} />
      </TestWrapper>
    )

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('AOV')).toBeInTheDocument()
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <MetricsCards metrics={mockMetrics} isLoading={true} />
      </TestWrapper>
    )

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

