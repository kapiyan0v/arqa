# ARQA Mini Analytics

A modern analytics dashboard built with Next.js, TypeScript, and shadcn/ui for ARQA company.

## Features

### 📊 Dashboard
- **Metrics Cards**: Revenue, Orders, AOV, Conversion Rate
- **Interactive Charts**: Revenue trends with Recharts
- **Advanced Filters**: Period, Channel, City filtering
- **CSV Export**: Export filtered data

### 📦 Orders Management
- **Orders Table**: Sortable, searchable table with pagination
- **Status Management**: Update order status with dropdown
- **Order Details**: Detailed view with items and comments
- **Real-time Updates**: Status changes with optimistic updates

### 👥 Customer Directory
- **Customer List**: Search and filter by city
- **Customer Details**: Order history timeline
- **LTV Tracking**: Customer lifetime value metrics

### ⚙️ Settings
- **Theme Toggle**: Light/Dark mode
- **Language Switch**: Russian/English
- **Persistent Settings**: Saved in localStorage

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx          # Dashboard
│   ├── orders/            # Orders page
│   ├── customers/        # Customers page
│   └── settings/         # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   ├── orders/           # Orders components
│   ├── customers/        # Customer components
│   └── layout/          # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── data/                 # Mock data and translations
└── types/                # TypeScript type definitions
```

## Key Features Implementation

### 🎨 UI Components
- Built with shadcn/ui for consistent design
- Fully accessible with ARIA attributes
- Responsive design (360px, 768px, 1280px)
- Dark/Light theme support

### 📊 Data Management
- React Query for server state management
- Optimistic updates for better UX
- Error handling with toast notifications
- Loading states with skeletons

### 🌐 Internationalization
- Russian/English language support
- Persistent language preference
- Context-based translation system

### 🧪 Testing
- Unit tests for critical components
- Jest configuration with React Testing Library
- Test coverage for utilities and components

### ⚡ Performance
- Code splitting with Next.js
- Optimized bundle size
- Memoized components where needed
- Efficient re-renders

## API Structure

The application uses mock data with simulated API calls:

```typescript
// Orders API
api.getOrders(filters?: FilterOptions): Promise<Order[]>
api.updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>

// Customers API  
api.getCustomers(filters?: { city?: string; search?: string }): Promise<Customer[]>

// Dashboard API
api.getDashboardMetrics(filters?: FilterOptions): Promise<DashboardMetrics>
api.getChartData(filters?: FilterOptions): Promise<ChartData[]>

// Export API
api.exportToCSV(filters?: FilterOptions): Promise<string>
```

## Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels and descriptions
- Color contrast compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Code Style
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

### Testing Strategy
- Unit tests for utilities
- Component tests for UI
- Integration tests for user flows
- Accessibility testing

## Deployment

The application can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## License

This project is created for ARQA company analytics dashboard.
