import React from "react"
import { cn } from "@/utils/cn"

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  primary: "bg-primary text-white border-primary",
  secondary: "bg-secondary text-white border-secondary",
  success: "bg-success text-white border-success",
  warning: "bg-warning text-white border-warning",
  error: "bg-error text-white border-error",
  info: "bg-info text-white border-info",
  outline: "bg-transparent text-gray-700 border-gray-300",
  live: "bg-red-600 text-white border-red-600 shadow-lg",
  destructive: "bg-red-600 text-white border-red-600"
}

const Badge = ({ 
  children, 
  variant = "default", 
  className,
  ...props 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge