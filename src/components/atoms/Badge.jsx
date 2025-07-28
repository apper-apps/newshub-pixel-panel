import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-secondary",
    primary: "bg-gradient-to-r from-primary to-orange-600 text-white",
    live: "bg-gradient-to-r from-error to-red-600 text-white animate-pulse-live",
    category: "bg-gradient-to-r from-accent to-blue-600 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge