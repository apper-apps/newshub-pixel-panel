import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No content found", 
  message = "There's nothing here yet. Check back later for updates.",
  actionText = "Go to Homepage",
  actionLink = "/",
  icon = "FileText",
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-br from-primary/10 to-orange-600/10 rounded-full flex items-center justify-center"
      >
        <ApperIcon name={icon} size={48} className="text-primary/60" />
      </motion.div>

      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-display font-bold text-secondary">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>

      {showAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to={actionLink}>
            <Button variant="primary" size="lg">
              <ApperIcon name="Home" size={16} className="mr-2" />
              {actionText}
            </Button>
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 max-w-xs w-full mt-8"
      >
        {["News", "Sports", "Technology"].map((category, index) => (
          <Link
            key={category}
            to={`/category/${category.toLowerCase()}`}
            className="text-center p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-orange-600/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
              <ApperIcon 
                name={index === 0 ? "Newspaper" : index === 1 ? "Trophy" : "Smartphone"} 
                size={16} 
                className="text-primary/60" 
              />
            </div>
            <span className="text-xs text-gray-600 group-hover:text-primary transition-colors">
              {category}
            </span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Empty