import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { toast } from "react-toastify"
import articleService from "@/services/api/articleService"
import categoryService from "@/services/api/categoryService"

const ArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    category: "",
    author: "",
    isLive: false
  })
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [error, setError] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const loadData = async () => {
    try {
      setInitialLoading(true)
      setError("")
      
      const [categoriesData, articleData] = await Promise.all([
        categoryService.getAll(),
        isEditing ? articleService.getById(id) : Promise.resolve(null)
      ])
      
      setCategories(categoriesData)
      
      if (articleData) {
        setFormData({
          title: articleData.title,
          summary: articleData.summary,
          content: articleData.content,
          imageUrl: articleData.imageUrl,
          category: articleData.category,
          author: articleData.author,
          isLive: articleData.isLive
        })
      }
      
    } catch (err) {
      setError(err.message || "Failed to load data")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    try {
      setLoading(true)
      
      if (isEditing) {
        await articleService.update(id, formData)
        toast.success("Article updated successfully")
      } else {
        const newArticle = await articleService.create(formData)
        toast.success("Article created successfully")
        navigate(`/admin/article/${newArticle.Id}`)
        return
      }
      
    } catch (err) {
      toast.error(err.message || "Failed to save article")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      return
    }
    navigate("/admin")
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (initialLoading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? "Update your article content" : "Write and publish a new article"}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <ApperIcon name={previewMode ? "Edit" : "Eye"} size={16} className="mr-2" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>

        {!previewMode ? (
          /* Edit Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Card.Content className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Article Title *"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter article title"
                      className="md:col-span-2"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.Id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <Input
                      label="Author *"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Enter author name"
                    />
                    
                    <Input
                      label="Featured Image URL *"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="md:col-span-2"
                    />
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Article Summary *
                      </label>
                      <textarea
                        value={formData.summary}
                        onChange={(e) => handleInputChange("summary", e.target.value)}
                        placeholder="Write a brief summary of the article"
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-secondary placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Article Content *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        placeholder="Write your article content here..."
                        rows="12"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-secondary placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.isLive}
                          onChange={(e) => handleInputChange("isLive", e.target.checked)}
                          className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
                        />
                        <div>
                          <span className="text-sm font-medium text-secondary">
                            Mark as Live Article
                          </span>
                          <p className="text-xs text-gray-500">
                            Live articles appear with a live indicator and receive real-time updates
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {isEditing ? "Update Article" : "Publish Article"}
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </motion.div>
        ) : (
          /* Preview Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <Card>
              <Card.Content className="p-0">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 px-8 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Eye" size={20} className="text-primary" />
                    <span className="font-medium text-secondary">Article Preview</span>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="p-8">
                  {formData.imageUrl && (
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={formData.imageUrl}
                        alt={formData.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      {formData.category && (
                        <span className="px-3 py-1 bg-gradient-to-r from-primary to-orange-600 text-white text-sm font-medium rounded-full">
                          {formData.category}
                        </span>
                      )}
                      {formData.isLive && (
                        <span className="px-3 py-1 bg-gradient-to-r from-error to-red-600 text-white text-sm font-medium rounded-full animate-pulse">
                          <span className="w-2 h-2 bg-white rounded-full inline-block mr-1.5 animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary leading-tight">
                      {formData.title || "Article Title"}
                    </h1>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {formData.summary || "Article summary will appear here..."}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="User" size={16} />
                        <span>By {formData.author || "Author Name"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" size={16} />
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {formData.content || "Article content will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ArticleEditor