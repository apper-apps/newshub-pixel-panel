import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the content. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-error/20 to-red-600/20 rounded-full flex items-center justify-center"
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-error" />
      </motion.div>

      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-display font-bold text-secondary">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>

      {showRetry && onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-500"
      >
        If the problem persists, please contact our support team.
      </motion.div>
    </motion.div>
  )
}

export default Error