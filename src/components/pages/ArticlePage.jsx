import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ArticleCard from "@/components/molecules/ArticleCard"
import LiveUpdate from "@/components/molecules/LiveUpdate"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { formatDateTime, formatTimestamp } from "@/utils/formatDate"
import articleService from "@/services/api/articleService"
import liveUpdateService from "@/services/api/liveUpdateService"

const ArticlePage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [liveUpdates, setLiveUpdates] = useState([])
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const articleData = await articleService.getById(id)
      setArticle(articleData)
      
      // Increment view count
      await articleService.incrementViewCount(id)
      
      // Load live updates for this article
      if (articleData.isLive) {
        const updates = await liveUpdateService.getByArticleId(id)
        setLiveUpdates(updates)
      }
      
      // Load related articles from same category
      const categoryArticles = await articleService.getByCategory(articleData.category)
      const related = categoryArticles
        .filter(art => art.Id !== parseInt(id))
        .slice(0, 3)
      setRelatedArticles(related)
      
    } catch (err) {
      setError(err.message || "Failed to load article")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    if (article?.isLive) {
      // Refresh live updates every 5 minutes
      const interval = setInterval(() => {
        liveUpdateService.getByArticleId(id)
          .then(setLiveUpdates)
          .catch(console.error)
      }, 300000)
      
      return () => clearInterval(interval)
    }
  }, [article?.isLive, id])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  if (!article) return <Error title="Article not found" message="The article you're looking for doesn't exist." showRetry={false} />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ApperIcon name="ChevronRight" size={16} />
                <Link 
                  to={`/category/${article.category.toLowerCase()}`} 
                  className="hover:text-primary transition-colors"
                >
                  {article.category}
                </Link>
                <ApperIcon name="ChevronRight" size={16} />
                <span className="text-secondary">Article</span>
              </nav>

              {/* Article Header */}
              <header className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge variant="category">{article.category}</Badge>
                  {article.isLive && (
                    <Badge variant="live" className="animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                      LIVE
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl lg:text-5xl font-display font-bold text-secondary leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="User" size={16} />
                    <span className="font-medium">By {article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" size={16} />
                    <span>{formatDateTime(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Clock" size={16} />
                    <span>{formatTimestamp(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Eye" size={16} />
                    <span>{(article.viewCount || 0).toLocaleString()} views</span>
                  </div>
                </div>
              </header>

              {/* Article Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-6">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Social Sharing */}
              <div className="flex items-center space-x-4 pt-8 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Share this article:</span>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ApperIcon name="Twitter" size={18} className="text-blue-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ApperIcon name="Facebook" size={18} className="text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ApperIcon name="Linkedin" size={18} className="text-blue-700" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ApperIcon name="Share2" size={18} className="text-gray-600" />
                  </Button>
                </div>
              </div>
            </motion.article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 space-y-6"
              >
                <h2 className="text-2xl font-display font-bold text-secondary">
                  Related Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <ArticleCard 
                      key={relatedArticle.Id} 
                      article={relatedArticle}
                      showCategory={false}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Live Updates for this article */}
            {article.isLive && liveUpdates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <Card.Header>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                      <h3 className="text-lg font-display font-bold text-secondary">Live Updates</h3>
                    </div>
                  </Card.Header>
                  
                  <Card.Content className="space-y-4 max-h-96 overflow-y-auto">
                    {liveUpdates.map((update) => (
                      <LiveUpdate key={update.Id} update={update} />
                    ))}
                  </Card.Content>
                </Card>
              </motion.div>
            )}

            {/* Article Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-display font-bold text-secondary">Article Details</h3>
                </Card.Header>
                
                <Card.Content className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category</span>
                      <Badge variant="category">{article.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Author</span>
                      <span className="font-medium text-secondary">{article.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Published</span>
                      <span className="text-secondary">{formatTimestamp(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Views</span>
                      <span className="text-secondary font-medium">
                        {(article.viewCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-orange-600/5 border-primary/20">
                <Card.Content className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="Bell" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-secondary mb-2">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get alerts for breaking news and updates on this story
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm"
                    />
                    <Button variant="primary" size="sm" className="w-full">
                      Get Alerts
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePage