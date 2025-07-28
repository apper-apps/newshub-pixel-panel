import React from "react"
import { cn } from "@/utils/cn"

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden transition-all duration-300",
        hover && "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white", className)}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card