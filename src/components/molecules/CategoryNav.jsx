import React from "react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const categories = [
  { name: "News", slug: "news", icon: "Newspaper" },
  { name: "Politics", slug: "politics", icon: "Vote" },
  { name: "Opinion", slug: "opinion", icon: "MessageSquare" },
  { name: "Sport", slug: "sport", icon: "Trophy" },
  { name: "Video", slug: "video", icon: "Video" },
  { name: "Technology", slug: "technology", icon: "Smartphone" },
  { name: "World", slug: "world", icon: "Globe" }
]

const CategoryNav = ({ direction = "horizontal", onCategoryClick }) => {
  const containerClass = direction === "horizontal" 
    ? "flex items-center space-x-1 overflow-x-auto scrollbar-hide" 
    : "flex flex-col space-y-1"

  const linkClass = direction === "horizontal"
    ? "flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 hover:bg-primary/10 font-medium"
    : "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10 font-medium"

  return (
    <nav className={containerClass}>
      {categories.map((category, index) => (
        <motion.div
          key={category.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <NavLink
            to={`/category/${category.slug}`}
            onClick={() => onCategoryClick?.(category.slug)}
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg"
                  : "text-secondary hover:text-primary"
              }`
            }
          >
            <ApperIcon name={category.icon} size={18} />
            <span>{category.name}</span>
          </NavLink>
        </motion.div>
      ))}
    </nav>
  )
}

export default CategoryNav