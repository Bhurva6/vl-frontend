import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn('inline-flex rounded-xl bg-gray-100 p-1', className)} {...props} />
)

export const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      'rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition data-[state=active]:bg-white data-[state=active]:text-[#1A1A2E] data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
)

export const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />
)
