# Vigilant Labs Factory Intelligence Dashboard

A comprehensive factory operations dashboard for Kitchen Essentials manufacturing plant built with React 18, TypeScript, and Vite.

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The dashboard will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Login Credentials

### Admin Account
- **Email**: admin
- **Password**: vigilant@admin
- **Role**: ADMIN (full access to all modules)

### Factory Manager Account
- **Email**: factory
- **Password**: kitchen@2024
- **Role**: FACTORY_MANAGER (operational modules only)

## Features

### Dashboard Pages (Role-Based Access)

**Admin Only:**
- **Dashboard Overview** - KPI cards, daily trends, zone activity
- **Footfall Analytics** - Entry/exit tracking, worker classification by helmet
- **Worker Classification** - Helmet color mapping, zone distribution

**Both Roles:**
- **PPE Compliance** - Helmet & vest usage tracking, violation log
- **Tobacco Detection** - Zero-tolerance detection with zone/hourly analytics
- **Machine Activity** - Machine uptime, idle/off timelines
- **Packing Efficiency** - Worker presence, efficiency rates by hour
- **Gate Activity** - Entry/exit heatmaps, tailgating alerts
- **ANPR (Truck Tracking)** - License plate verification, truck logs
- **Alerts** - Global alert feed with tab filters, modal details, CSV export

### Key Features

✅ **Dual Role Authentication** - ADMIN & FACTORY_MANAGER with localStorage persistence
✅ **Role-Based Navigation** - Different sidebar menus per role
✅ **Global Filters** - Date range, camera, zone, shift with quick presets
✅ **Loading States** - 1.2s skeleton loaders on all pages with smooth 500ms fade-in
✅ **Interactive Charts** - Recharts with 800ms animations, responsive containers
✅ **Data Tables** - Search, sortable columns, row click handlers, empty states
✅ **Mobile Responsive** - Collapsible sidebar, bottom navigation on mobile
✅ **Color-Coded Badges** - Status badges with pulse animations where needed

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: react-router-dom v6
- **State**: Zustand (auth store, filter store) + React Query
- **UI**: shadcn/ui primitives + Tailwind CSS
- **Charts**: Recharts
- **Icons**: lucide-react
- **Date Handling**: date-fns

## Project Structure

```
src/
├── types/          # TypeScript interfaces (DailyHeadcount, AlertRecord, etc.)
├── mock/           # Mock data layer (11 datasets)
├── store/          # Zustand stores (authStore, filterStore)
├── hooks/          # Custom hooks (usePageLoad, useFilters, useMockData)
├── components/
│   ├── ui/        # Reusable primitives (Badge, Button, Table, Tabs, Select, etc.)
│   └── layout/    # Layout components (Navbar, Sidebar, FilterBar, ProtectedRoute)
├── pages/         # All 11 factory pages
├── router.tsx     # Route definitions with role-based protection
└── App.tsx        # App root
```

## Styling

**Brand Colors:**
- Primary Navy: `#1A1A2E`
- Electric Blue: `#00C2FF`
- Success Green: `#22C55E`
- Warning Orange: `#F59E0B`
- Danger Red: `#EF4444`

**Typography:**
- Headings: Poppins font
- Body: Inter font

## Performance Notes

- Mock data fetch simulated with 350ms delay
- Chart animations set to 800ms for smooth transitions
- Skeleton loaders display for 1.2s before content appears
- Page route transitions fade over 500ms
- All charts responsive with ResponsiveContainer
- Optimized bundle: 754KB minified, 223.6KB gzipped

## Deployment

### Production Build
```bash
npm run build
```

Build output goes to `dist/` folder.

### Environment Variables
Currently using mock data only. To integrate real APIs, update the `useMockData()` hook in `src/hooks/useMockData.ts`.

## Development Tips

1. **Add a new page**: Create page in `/src/pages`, import in `router.tsx`, wrap routes with `ProtectedRoute`
2. **Add filter logic**: Update filter store in `src/store/filterStore.ts` and use key={applyVersion} on page container
3. **Customize badges**: Map alert types in `AlertBadge.tsx`
4. **Modify sidebar**: Update role-aware items in `src/components/layout/Sidebar.tsx`
5. **Change credentials**: Update `src/store/authStore.ts` for new login pairs

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

**Built for Kitchen Essentials Manufacturing | Vigilant Labs**
