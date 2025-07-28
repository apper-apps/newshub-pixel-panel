import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ArticleCard from "@/components/molecules/ArticleCard"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import articleService from "@/services/api/articleService"
import categoryService from "@/services/api/categoryService"

const CategoryPage = () => {
  const { category } = useParams()
  const [articles, setArticles] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [categoryArticles, catInfo] = await Promise.all([
        articleService.getByCategory(category),
        categoryService.getBySlug(category).catch(() => ({ name: category, slug: category }))
      ])
      
      setArticles(categoryArticles)
      setCategoryInfo(catInfo)
    } catch (err) {
      setError(err.message || "Failed to load category content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    setCurrentPage(1)
  }, [category])

// Auto-refresh for live articles every 5 minutes
  useEffect(() => {
    if (articles.some(article => article.isLive)) {
      const interval = setInterval(async () => {
        try {
          const refreshedArticles = await articleService.getByCategory(category)
          setArticles(refreshedArticles)
        } catch (err) {
          console.error('Failed to refresh live articles:', err)
        }
      }, 300000) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [articles, category])

  const sortedArticles = [...articles].sort((a, b) => {
    // Prioritize live articles first
    if (a.isLive && !b.isLive) return -1
    if (!a.isLive && b.isLive) return 1
    
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt) - new Date(a.publishedAt)
      case "oldest":
        return new Date(a.publishedAt) - new Date(b.publishedAt)
      case "popular":
        return (b.viewCount || 0) - (a.viewCount || 0)
      default:
        return 0
    }
  })
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = sortedArticles.slice(startIndex, startIndex + articlesPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-secondary capitalize">{categoryInfo?.name || category}</span>
          </nav>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-secondary mb-4 capitalize">
                {categoryInfo?.name || category}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant="primary" className="text-sm">
                  {articles.length} {articles.length === 1 ? "Article" : "Articles"}
                </Badge>
                {articles.some(article => article.isLive) && (
                  <Badge variant="live" className="animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                    LIVE COVERAGE
                  </Badge>
                )}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {currentArticles.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              <AnimatePresence>
                {currentArticles.map((article, index) => (
                  <motion.div
                    key={article.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <ArticleCard article={article} showCategory={false} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="px-3 py-2 min-w-[40px]"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2"
                >
                  Next
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <Empty
            title={`No ${categoryInfo?.name || category} articles found`}
            message="There are no articles in this category yet. Check back later for updates."
            icon="FileText"
            actionText="Browse All Categories"
            actionLink="/"
          />
        )}

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <h2 className="text-2xl font-display font-bold text-secondary mb-6">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "World", slug: "world", icon: "Globe" },
              { name: "Politics", slug: "politics", icon: "Vote" },
              { name: "Business", slug: "business", icon: "TrendingUp" },
              { name: "Technology", slug: "technology", icon: "Smartphone" },
              { name: "Sports", slug: "sports", icon: "Trophy" },
              { name: "Health", slug: "health", icon: "Heart" }
            ].filter(cat => cat.slug !== category).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-orange-600/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <ApperIcon name={cat.icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CategoryPage