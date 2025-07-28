import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  type = "text", 
  label,
  error,
  className, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-secondary placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input