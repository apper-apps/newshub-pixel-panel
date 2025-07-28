import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { formatTimestamp } from "@/utils/formatDate"

const LiveUpdate = ({ update, isNew = false }) => {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20, scale: 0.95 } : false}
      animate={isNew ? { opacity: 1, x: 0, scale: 1 } : false}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-white rounded-r-lg shadow-sm hover:shadow-md transition-all duration-300 ${
        isNew ? "animate-pulse" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse-live" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="live" className="text-xs">
              LIVE UPDATE
            </Badge>
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <ApperIcon name="Clock" size={12} />
              <span>{formatTimestamp(update.timestamp)}</span>
            </span>
          </div>
          
          <p className="text-sm text-secondary leading-relaxed">
            {update.content}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default LiveUpdate