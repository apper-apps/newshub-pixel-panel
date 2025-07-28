import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import { formatTimestamp } from "@/utils/formatDate"

const ArticleCard = ({ article, featured = false, showCategory = true }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  if (featured) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl shadow-2xl group"
      >
        <Link to={`/article/${article.Id}`}>
          <div className="relative h-[400px] lg:h-[500px]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {article.isLive && (
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Badge variant="live" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                  LIVE
                </Badge>
              </div>
            )}

            {showCategory && (
              <div className="absolute top-4 right-4">
                <Badge variant="category">{article.category}</Badge>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="space-y-3">
                <h1 className="text-2xl lg:text-4xl font-display font-bold text-white leading-tight group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h1>
                <p className="text-gray-200 text-base lg:text-lg leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="User" size={14} />
                    <span>{article.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{formatTimestamp(article.publishedAt)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Eye" size={14} />
                    <span>{article.viewCount?.toLocaleString() || "0"} views</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <Link to={`/article/${article.Id}`} className="block">
          <div className="relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {article.isLive && (
              <div className="absolute top-3 left-3">
                <Badge variant="live" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                  LIVE
                </Badge>
              </div>
            )}

            {showCategory && (
              <div className="absolute top-3 right-3">
                <Badge variant="category">{article.category}</Badge>
              </div>
            )}
          </div>

          <Card.Content>
            <div className="space-y-3">
              <h3 className="text-lg font-display font-semibold text-secondary leading-tight hover:text-primary transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="User" size={12} />
                    <span>{article.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={12} />
                    <span>{formatTimestamp(article.publishedAt)}</span>
                  </span>
                </div>
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Eye" size={12} />
                  <span>{article.viewCount?.toLocaleString() || "0"}</span>
                </span>
              </div>
            </div>
          </Card.Content>
        </Link>
      </Card>
    </motion.div>
  )
}

export default ArticleCard