import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={className}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className={cn(
                'w-full text-left px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-lg font-medium tracking-tight transition-all text-foreground/90 outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>div>svg]:rotate-180',
                className
            )}
            {...props}
        >
            {children}
            <div className="size-7 rounded-full bg-foreground/5 dark:bg-foreground/10 flex shrink-0 items-center justify-center transition-all">
                <ChevronDownIcon
                    className="text-foreground/50 pointer-events-none size-4 shrink-0 translate-y-0.25 transition-transform duration-200" />
            </div>
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
                              className,
                              children,
                              ...props
                          }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all duration-300 ease-in-out max-h-[500px] opacity-100"
            {...props}
        >
            <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
