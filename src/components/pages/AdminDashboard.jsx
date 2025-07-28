import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import articleService from "@/services/api/articleService"
import liveUpdateService from "@/services/api/liveUpdateService"
import categoryService from "@/services/api/categoryService"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalLiveUpdates: 0,
    totalCategories: 0,
    todayViews: 0
  })
  const [recentArticles, setRecentArticles] = useState([])
  const [recentUpdates, setRecentUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [articles, updates, categories] = await Promise.all([
        articleService.getAll(),
        liveUpdateService.getAll(),
        categoryService.getAll()
      ])

      // Calculate stats
      const todayViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0)
      
      setStats({
        totalArticles: articles.length,
        totalLiveUpdates: updates.length,
        totalCategories: categories.length,
        todayViews
      })

      setRecentArticles(articles.slice(0, 5))
      setRecentUpdates(updates.slice(0, 5))

    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "New Article",
      description: "Create a new article or news story",
      icon: "PenTool",
      href: "/admin/article",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      title: "Live Update",
      description: "Add live update to existing story",
      icon: "Radio",
      href: "/admin/live-updates",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    },
    {
      title: "Categories",
      description: "Manage article categories",
      icon: "Tag",
      href: "/admin/categories",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      title: "Media Library",
      description: "Manage images and videos",
      icon: "Image",
      href: "/admin/media",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      title: "Analytics",
      description: "View detailed statistics",
      icon: "BarChart3",
      href: "/admin/analytics",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    },
    {
      title: "Settings",
      description: "Configure site settings",
      icon: "Settings",
      href: "/admin/settings",
      color: "bg-gray-500",
      hoverColor: "hover:bg-gray-600"
    }
  ]

  const statCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: "FileText",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Live Updates",
      value: stats.totalLiveUpdates,
      icon: "Radio",
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: "Tag",
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "0%",
      changeType: "neutral"
    },
    {
      title: "Total Views",
      value: stats.todayViews.toLocaleString(),
      icon: "Eye",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+24%",
      changeType: "positive"
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome to NewsHub Pro administration panel
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="live" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                LIVE SYSTEM
              </Badge>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        vs last week
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={stat.icon} size={24} className={stat.color} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-secondary mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`p-6 ${action.hoverColor} hover:text-white transition-all duration-300 cursor-pointer group`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors`}>
                        <ApperIcon name={action.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-white/80">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-secondary">
                  Recent Articles
                </h2>
                <Link to="/admin/articles">
                  <Button variant="outline" size="sm">
                    View All
                    <ApperIcon name="ArrowRight" size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.Id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ApperIcon name="FileText" size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/admin/article/${article.Id}`}
                        className="text-sm font-medium text-secondary hover:text-primary transition-colors line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        {article.isLive && (
                          <Badge variant="live" className="text-xs">
                            LIVE
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {article.viewCount || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>

          {/* Recent Live Updates */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-secondary">
                  Recent Live Updates
                </h2>
                <Link to="/admin/live-updates">
                  <Button variant="outline" size="sm">
                    View All
                    <ApperIcon name="ArrowRight" size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div key={update.Id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-secondary line-clamp-2">
                        {update.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="live" className="text-xs">
                          LIVE
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Article #{update.articleId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard