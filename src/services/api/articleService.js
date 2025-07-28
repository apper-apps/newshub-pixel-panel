import articlesData from "@/services/mockData/articles.json"

class ArticleService {
  constructor() {
    this.articles = [...articlesData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [...this.articles].sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    )
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const article = this.articles.find(article => article.Id === parseInt(id))
    if (!article) {
      throw new Error("Article not found")
    }
    
    // Increment view count
    article.viewCount = (article.viewCount || 0) + 1
    return { ...article }
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const filtered = this.articles
      .filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    
    return filtered
  }

  async getFeatured() {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const featured = this.articles.find(article => article.featured === true)
    return featured || this.articles[0]
  }

  async getMostPopular(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const popular = [...this.articles]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit)
    
    return popular
  }

  async getLiveArticles() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const liveArticles = this.articles
      .filter(article => article.isLive === true)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    
    return liveArticles
  }

  async create(articleData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newId = Math.max(...this.articles.map(a => a.Id)) + 1
    const newArticle = {
      Id: newId,
      title: articleData.title || "Untitled Article",
      summary: articleData.summary || "",
      content: articleData.content || "",
      category: articleData.category || "general",
      author: articleData.author || "NewsHub Pro",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: articleData.imageUrl || "",
      tags: articleData.tags || [],
      featured: articleData.featured || false,
      isLive: articleData.isLive || false,
      viewCount: 0,
      status: "published"
    }
    
    this.articles.unshift(newArticle)
    return newArticle
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.articles.findIndex(article => article.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return this.articles[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.articles.findIndex(article => article.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    const deletedArticle = this.articles.splice(index, 1)[0]
    return deletedArticle
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const searchTerm = query.toLowerCase()
    const results = this.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
    
    return results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  }

  async incrementViewCount(id) {
    const article = this.articles.find(a => a.Id === parseInt(id))
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1
    }
  }
}

export default new ArticleService()