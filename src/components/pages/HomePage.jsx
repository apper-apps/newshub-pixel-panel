import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import ArticleCard from "@/components/molecules/ArticleCard"
import LiveUpdate from "@/components/molecules/LiveUpdate"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import articleService from "@/services/api/articleService"
import liveUpdateService from "@/services/api/liveUpdateService"

const HomePage = () => {
const [articles, setArticles] = useState([])
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [mostPopular, setMostPopular] = useState([])
  const [liveUpdates, setLiveUpdates] = useState([])
  const [breakingNews, setBreakingNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
const [allArticles, featured, popular, updates, breakingArticles] = await Promise.all([
        articleService.getAll(),
        articleService.getFeatured(),
        articleService.getMostPopular(5),
        liveUpdateService.getRecent(6),
        articleService.getByCategory('breaking')
      ])
      
      setArticles(allArticles)
      setFeaturedArticle(featured)
      setMostPopular(popular)
      setLiveUpdates(updates)
      setBreakingNews(breakingArticles.slice(0, 3))
    } catch (err) {
      setError(err.message || "Failed to load news content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Simulate live updates every 5 minutes
    const interval = setInterval(() => {
      liveUpdateService.getRecent(6).then(setLiveUpdates).catch(console.error)
    }, 300000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  if (!articles.length) return <Empty title="No news available" message="Check back later for the latest updates." />

  const categoryGroups = articles.reduce((groups, article) => {
    const category = article.category
    if (!groups[category]) groups[category] = []
    groups[category].push(article)
    return groups
  }, {})

  const secondaryArticles = articles.filter(article => article.Id !== featuredArticle?.Id).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
{/* Breaking News Alert */}
            {breakingNews.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-lg mb-8"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="destructive" className="bg-white text-red-600 font-bold animate-pulse">
                    BREAKING
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{breakingNews[0].title}</h3>
                    <p className="text-red-100 text-sm mt-1">{breakingNews[0].summary}</p>
                  </div>
                  <Link to={`/article/${breakingNews[0].Id}`}>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-red-600">
                      Read More
                    </Button>
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Featured Story */}
              <div className="lg:col-span-2">
                {featuredArticle && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-display font-bold text-secondary">
                        Featured Story
                      </h2>
                      {featuredArticle.isLive && (
                        <Badge variant="live" className="animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                          LIVE COVERAGE
                        </Badge>
                      )}
                    </div>
                    <ArticleCard article={featuredArticle} featured={true} />
                  </motion.section>
                )}

                {/* Secondary Stories */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-12 space-y-6"
                >
                  <h2 className="text-2xl font-display font-bold text-secondary border-b-2 border-primary pb-2">
                    Top Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.slice(1, 5).map((article, index) => (
                      <motion.div
                        key={article.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <ArticleCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Live Updates */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-secondary">
                      Live Updates
                    </h2>
                    <Badge variant="live" className="animate-pulse text-xs">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                  <Card className="p-0 overflow-hidden">
                    <div className="space-y-3 p-4">
                      {liveUpdates.slice(0, 4).map((update, index) => (
                        <motion.div
                          key={update.Id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <LiveUpdate update={update} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="border-t bg-gray-50 p-3">
                      <Link to="/category/live" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center">
                        View All Live Updates
                        <ApperIcon name="ArrowRight" size={14} className="ml-1" />
                      </Link>
                    </div>
                  </Card>
                </motion.section>

                {/* Most Popular */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-display font-bold text-secondary">
                    Most Popular
                  </h2>
                  <Card className="p-4">
                    <div className="space-y-4">
                      {mostPopular.map((article, index) => (
                        <motion.div
                          key={article.Id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Link 
                              to={`/article/${article.Id}`}
                              className="text-sm font-medium text-secondary hover:text-primary transition-colors line-clamp-2"
                            >
                              {article.title}
                            </Link>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <span>{article.category}</span>
                              <span>•</span>
                              <span>{article.viewCount || 0} views</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.section>

                {/* Newsletter Signup */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
                    <div className="text-center space-y-4">
                      <ApperIcon name="Mail" size={32} className="text-primary mx-auto" />
                      <h3 className="font-display font-bold text-lg text-secondary">
                        Breaking News Alerts
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get notified instantly when major stories break
                      </p>
                      <div className="space-y-3">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                        />
                        <Button variant="primary" size="sm" className="w-full">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.section>
              </div>
            </div>

            {/* Categories Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 space-y-8"
            >
{(categoryGroups || []).map((group, groupIndex) => {
                if (!group || !group.name || !group.category) {
                  return null;
                }
                
                return (
                  <div key={group.name} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-display font-bold text-secondary border-b-2 border-primary pb-2">
                        {group.name}
                      </h2>
                      <Link 
                        to={`/category/${group.category}`}
                        className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                      >
                        <span>See full coverage</span>
                        <ApperIcon name="ArrowRight" size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(articles || [])
                        .filter(article => 
                          article?.category?.toLowerCase() === group.category?.toLowerCase()
                        )
                        .slice(0, 3)
                        .map((article, index) => {
                          if (!article?.Id) {
                            return null;
                          }
                          
                          return (
                            <motion.div
                              key={article.Id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <ArticleCard article={article} showCategory={false} />
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </motion.section>

            {/* Secondary Stories Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-secondary">
                  Latest News
                </h2>
                <Link to="/category/news">
                  <Button variant="outline" size="sm">
                    View All
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {secondaryArticles.map((article, index) => (
                    <motion.div
                      key={article.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Category Sections */}
            {Object.entries(categoryGroups).slice(0, 3).map(([category, categoryArticles], categoryIndex) => (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-secondary flex items-center space-x-3">
                    <span>{category}</span>
                    <Badge variant="category">{categoryArticles.length}</Badge>
                  </h2>
                  <Link to={`/category/${category.toLowerCase()}`}>
                    <Button variant="ghost" size="sm">
                      See full coverage
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryArticles.slice(0, 3).map((article) => (
                    <ArticleCard 
                      key={article.Id} 
                      article={article} 
                      showCategory={false}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Live Updates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <Card.Header>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                    <h3 className="text-lg font-display font-bold text-secondary">Live Updates</h3>
                  </div>
                </Card.Header>
                
                <Card.Content className="space-y-4 max-h-96 overflow-y-auto">
                  {liveUpdates.length > 0 ? (
                    liveUpdates.map((update) => (
                      <LiveUpdate key={update.Id} update={update} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="Radio" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No live updates available</p>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </motion.div>

            {/* Most Popular */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-display font-bold text-secondary flex items-center space-x-2">
                    <ApperIcon name="TrendingUp" size={20} className="text-primary" />
                    <span>Most Popular</span>
                  </h3>
                </Card.Header>
                
                <Card.Content className="space-y-4">
                  {mostPopular.map((article, index) => (
                    <Link 
                      key={article.Id}
                      to={`/article/${article.Id}`}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <ApperIcon name="Eye" size={12} />
                            <span>{article.viewCount?.toLocaleString() || "0"}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </Card.Content>
              </Card>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-orange-600/5 border-primary/20">
                <Card.Content className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="Mail" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-secondary mb-2">
                      Breaking News Alerts
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get notified about important stories as they happen
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm"
                    />
                    <Button variant="primary" size="sm" className="w-full">
                      Subscribe
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

export default HomePage