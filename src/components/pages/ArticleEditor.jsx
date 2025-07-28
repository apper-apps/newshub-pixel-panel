import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import categoryService from "@/services/api/categoryService";
import liveUpdateService from "@/services/api/liveUpdateService";
import articleService from "@/services/api/articleService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [article, setArticle] = useState({
    title: "",
    summary: "",
    content: "",
    category: "world",
    author: "NewsHub Pro",
    imageUrl: "",
    tags: [],
    featured: false,
    isLive: false
  })
  
  const [liveUpdates, setLiveUpdates] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
const [newUpdate, setNewUpdate] = useState("")
  const [newUpdateHeading, setNewUpdateHeading] = useState("")
  const [newUpdateSocialLink, setNewUpdateSocialLink] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [previewUpdate, setPreviewUpdate] = useState(false)
  const [addingUpdate, setAddingUpdate] = useState(false)
  useEffect(() => {
    loadInitialData()
  }, [id])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [categoriesData] = await Promise.all([
        categoryService.getAll()
      ])

      setCategories(categoriesData)

      if (isEditing) {
        const [articleData, updatesData] = await Promise.all([
          articleService.getById(id),
          liveUpdateService.getByArticleId(id)
        ])
        
        setArticle(articleData)
        setLiveUpdates(updatesData)
      }

    } catch (err) {
      setError(err.message || "Failed to load data")
      toast.error("Failed to load article data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!article.title.trim()) {
      toast.error("Article title is required")
      return
    }

    if (!article.content.trim()) {
      toast.error("Article content is required")
      return
    }

    try {
      setSaving(true)

      let savedArticle
      if (isEditing) {
        savedArticle = await articleService.update(id, article)
        toast.success("Article updated successfully!")
      } else {
        savedArticle = await articleService.create(article)
        toast.success("Article created successfully!")
        navigate(`/admin/article/${savedArticle.Id}`)
      }

    } catch (err) {
      toast.error(err.message || "Failed to save article")
    } finally {
      setSaving(false)
    }
  }

const handleAddLiveUpdate = async () => {
    if (!newUpdate.trim()) {
      toast.error("Update content is required")
      return
    }

    if (!isEditing) {
      toast.error("Please save the article first before adding live updates")
      return
    }

    try {
      setAddingUpdate(true)
      const update = await liveUpdateService.create({
        articleId: id,
        heading: newUpdateHeading.trim() || "Breaking Update",
        content: newUpdate.trim(),
        socialLink: newUpdateSocialLink.trim() || null
      })

      setLiveUpdates(prev => [update, ...prev])
      setNewUpdate("")
      setNewUpdateHeading("")
      setNewUpdateSocialLink("")
      setPreviewUpdate(false)
      toast.success("Live update published successfully!")

    } catch (err) {
      toast.error(err.message || "Failed to add live update")
    } finally {
      setAddingUpdate(false)
    }
  }

  const handleDeleteLiveUpdate = async (updateId) => {
    try {
      await liveUpdateService.delete(updateId)
      setLiveUpdates(prev => prev.filter(update => update.Id !== updateId))
      toast.success("Live update deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete live update")
    }
}
  const handleAddTag = () => {
    if (!tagInput.trim()) return
    
    const newTag = tagInput.trim().toLowerCase()
    if (!article.tags.includes(newTag)) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
    }
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadInitialData} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? `Editing article #${id}` : "Create and publish a new article"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {isEditing ? "Update Article" : "Create Article"}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-display font-bold text-secondary mb-6">
                  Article Details
                </h2>
                
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Title *
                    </label>
                    <Input
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter article title..."
                      className="text-lg font-medium"
                    />
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summary *
                    </label>
                    <textarea
                      value={article.summary}
                      onChange={(e) => setArticle(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Enter article summary..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Content *
                    </label>
                    <textarea
                      value={article.content}
                      onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {article.content.length} characters
                    </p>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <Input
                      value={article.imageUrl}
                      onChange={(e) => setArticle(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                    {article.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={article.imageUrl}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Live Updates */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-secondary">
                      Live Updates
                    </h2>
                    {article.isLive && (
                      <Badge variant="live" className="animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                        LIVE
                      </Badge>
                    )}
                  </div>

                  {/* Add New Update */}
{/* Add New Update */}
                  <div className="mb-6">
                    <div className="space-y-4 p-6 bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-lg border border-primary/20 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                          <h4 className="font-display font-bold text-secondary">Add Live Update</h4>
                          <Badge variant="live" className="text-xs animate-pulse">BREAKING</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewUpdate(!previewUpdate)}
                            disabled={!newUpdate.trim()}
                          >
                            <ApperIcon name="Eye" size={14} className="mr-1" />
                            {previewUpdate ? "Edit" : "Preview"}
                          </Button>
                        </div>
                      </div>
                      
                      {!previewUpdate ? (
                        <div className="space-y-4">
                          <Input
                            value={newUpdateHeading}
                            onChange={(e) => setNewUpdateHeading(e.target.value)}
                            placeholder="Update heading (e.g., 'Breaking News', 'Latest Development')"
                            className="w-full font-medium"
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Content *
                            </label>
                            <textarea
                              value={newUpdate}
                              onChange={(e) => setNewUpdate(e.target.value)}
                              placeholder="Write your live update content here. Include key details, quotes, and relevant information..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Social Media Reference (Optional)
                            </label>
                            <Input
                              value={newUpdateSocialLink}
                              onChange={(e) => setNewUpdateSocialLink(e.target.value)}
                              placeholder="https://twitter.com/username/status/... or https://facebook.com/..."
                              className="w-full"
                            />
                            {newUpdateSocialLink && (
                              <p className="text-xs text-gray-500 mt-1">
                                Supported: Twitter, Facebook, Instagram, LinkedIn, YouTube
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-white">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-display font-bold text-lg text-secondary">
                                {newUpdateHeading || 'Breaking Update'}
                              </h5>
                              <Badge variant="live" className="text-xs animate-pulse">
                                PREVIEW
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ApperIcon name="Clock" size={14} />
                              <span className="font-medium">
                                {new Date().toLocaleString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZoneName: 'short'
                                })}
                              </span>
                              <span>•</span>
                              <span>Just now</span>
                            </div>
                            
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {newUpdate}
                            </div>
                            
                            {newUpdateSocialLink && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center space-x-2 mb-2">
                                  <ApperIcon name="ExternalLink" size={14} className="text-primary" />
                                  <span className="text-sm font-medium text-gray-700">Social Media Reference</span>
                                </div>
                                <a
                                  href={newUpdateSocialLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-orange-600 underline text-sm break-all"
                                >
                                  {newUpdateSocialLink}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Timestamp will be automatically generated</div>
                          <div>Updates appear immediately on the live article</div>
                        </div>
                        <Button
                          variant="primary"
                          onClick={handleAddLiveUpdate}
                          disabled={!newUpdate.trim() || addingUpdate}
                          className="px-6 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
                        >
                          {addingUpdate ? (
                            <>
                              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="Radio" size={16} className="mr-2" />
                              Publish Live Update
                            </>
                          )}
</Button>
                      </div>
                    </div>
                  </div>

                  {/* Updates List */}
                  <div className="space-y-4">
                    {liveUpdates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="MessageSquare" size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No live updates yet</p>
                        <p className="text-sm">Add your first live update above</p>
                      </div>
                    ) : (
                      liveUpdates.map((update) => (
                        <motion.div
                          key={update.Id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <Badge variant="live" className="text-xs">
                                  {update.heading || "LIVE UPDATE"}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-secondary mb-2">
                                {update.content}
                              </p>
                              {update.socialLink && (
                                <div className="mt-2 p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                                  <div className="flex items-center space-x-2">
                                    <ApperIcon name="ExternalLink" size={14} className="text-blue-600" />
                                    <a
                                      href={update.socialLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline truncate"
                                    >
                                      {update.socialLink}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLiveUpdate(update.Id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-display font-bold text-secondary mb-4">
                  Publishing Options
                </h3>
                
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={article.category}
                      onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      {categories.map((category) => (
                        <option key={category.Id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <Input
                      value={article.author}
                      onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={article.featured}
                      onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Article
                    </label>
                  </div>

                  {/* Live Coverage */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isLive"
                      checked={article.isLive}
                      onChange={(e) => setArticle(prev => ({ ...prev, isLive: e.target.checked }))}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isLive" className="text-sm font-medium text-gray-700">
                      Live Coverage
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-display font-bold text-secondary mb-4">
                  Tags
                </h3>
                
                <div className="space-y-4">
                  {/* Add Tag */}
                  <div className="flex space-x-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <ApperIcon name="Plus" size={16} />
                    </Button>
                  </div>

                  {/* Tags List */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <ApperIcon name="X" size={14} className="ml-1" />
                      </Badge>
                    ))}
                  </div>

                  {article.tags.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No tags added yet
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor