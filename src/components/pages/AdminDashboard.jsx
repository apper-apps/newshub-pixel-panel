import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { formatTimestamp } from "@/utils/formatDate"
import { toast } from "react-toastify"
import articleService from "@/services/api/articleService"
import liveUpdateService from "@/services/api/liveUpdateService"

const AdminDashboard = () => {
  const [articles, setArticles] = useState([])
  const [recentUpdates, setRecentUpdates] = useState([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    liveArticles: 0,
    totalViews: 0,
    todayArticles: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [articlesData, updatesData] = await Promise.all([
        articleService.getAll(),
        liveUpdateService.getRecent(5)
      ])
      
      setArticles(articlesData)
      setRecentUpdates(updatesData)
      
      // Calculate stats
      const totalViews = articlesData.reduce((sum, article) => sum + (article.viewCount || 0), 0)
      const liveCount = articlesData.filter(article => article.isLive).length
      const today = new Date().toDateString()
      const todayCount = articlesData.filter(article => 
        new Date(article.publishedAt).toDateString() === today
      ).length
      
      setStats({
        totalArticles: articlesData.length,
        liveArticles: liveCount,
        totalViews,
        todayArticles: todayCount
      })
      
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    
    try {
      await articleService.delete(articleId)
      toast.success("Article deleted successfully")
      loadData()
    } catch (err) {
      toast.error("Failed to delete article")
    }
  }

  const toggleLiveStatus = async (articleId, currentStatus) => {
    try {
      await articleService.update(articleId, { isLive: !currentStatus })
      toast.success(`Article ${!currentStatus ? 'marked as live' : 'live status removed'}`)
      loadData()
    } catch (err) {
      toast.error("Failed to update live status")
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your news content and monitor performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/admin/article">
                <Button variant="primary">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  New Article
                </Button>
              </Link>
              <Button variant="outline" onClick={loadData}>
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-600/5 border-primary/20">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="FileText" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalArticles}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-br from-error/5 to-red-600/5 border-error/20">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-error to-red-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Radio" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live Articles</p>
                  <p className="text-2xl font-bold text-secondary">{stats.liveArticles}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-green-600/5 border-success/20">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Eye" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-blue-600/5 border-accent/20">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Calendar" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Articles</p>
                  <p className="text-2xl font-bold text-secondary">{stats.todayArticles}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Management */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-secondary">
                      Recent Articles
                    </h2>
                    <Link to="/admin/article">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add New
                      </Button>
                    </Link>
                  </div>
                </Card.Header>
                
                <Card.Content className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Article
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Published
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {articles.slice(0, 10).map((article) => (
                          <tr key={article.Id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-start space-x-3">
                                <img
                                  src={article.imageUrl}
                                  alt={article.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-medium text-secondary line-clamp-2">
                                    {article.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="category" className="text-xs">
                                      {article.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {article.isLive ? (
                                <Badge variant="live" className="animate-pulse">
                                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                                  LIVE
                                </Badge>
                              ) : (
                                <Badge variant="default">Published</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(article.viewCount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatTimestamp(article.publishedAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link to={`/article/${article.Id}`}>
                                  <Button variant="ghost" size="sm" className="p-2">
                                    <ApperIcon name="Eye" size={16} />
                                  </Button>
                                </Link>
                                <Link to={`/admin/article/${article.Id}`}>
                                  <Button variant="ghost" size="sm" className="p-2">
                                    <ApperIcon name="Edit" size={16} />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLiveStatus(article.Id, article.isLive)}
                                  className="p-2"
                                >
                                  <ApperIcon name="Radio" size={16} className={article.isLive ? "text-error" : "text-gray-400"} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteArticle(article.Id)}
                                  className="p-2 text-error hover:bg-error/10"
                                >
                                  <ApperIcon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>

          {/* Recent Live Updates */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-display font-bold text-secondary flex items-center space-x-2">
                    <ApperIcon name="Radio" size={20} className="text-error" />
                    <span>Recent Updates</span>
                  </h2>
                </Card.Header>
                
                <Card.Content className="space-y-4">
                  {recentUpdates.length > 0 ? (
                    recentUpdates.map((update) => (
                      <div key={update.Id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-secondary mb-2">
                          {update.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Article ID: {update.articleId}</span>
                          <span>{formatTimestamp(update.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="MessageSquare" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent updates</p>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-display font-bold text-secondary">
                    Quick Actions
                  </h2>
                </Card.Header>
                
                <Card.Content className="space-y-3">
                  <Link to="/admin/article" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ApperIcon name="Plus" size={16} className="mr-3" />
                      Create New Article
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Feature coming soon")}>
                    <ApperIcon name="Users" size={16} className="mr-3" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Feature coming soon")}>
                    <ApperIcon name="BarChart3" size={16} className="mr-3" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Feature coming soon")}>
                    <ApperIcon name="Settings" size={16} className="mr-3" />
                    Site Settings
                  </Button>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard