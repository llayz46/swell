import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from 'class-variance-authority';

const swellCardHeaderVariants = cva(
    "flex p-4",
    {
        variants: {
            variant: {
                default:
                    "justify-between items-center",
                column:
                    "flex-col gap-1.5",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  )
}

function SwellCard({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "flex flex-col rounded-xl bg-slate-light p-1 shadow-inner",
                className
            )}
            {...props}
        />
    )
}

function SwellCardHeader({ className, variant, ...props }: React.ComponentProps<"div"> &
    VariantProps<typeof swellCardHeaderVariants>) {
    return (
        <div
            data-slot="card-header"
            className={cn(swellCardHeaderVariants({ variant, className }))}
            {...props}
        />
    )
}

function SwellCardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("shadow-xs-with-border rounded-lg bg-background p-4 h-full", className)}
            {...props}
        />
    )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, SwellCard, SwellCardHeader, SwellCardContent }
