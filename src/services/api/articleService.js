import articlesData from "@/services/mockData/articles.json"

class ArticleService {
  constructor() {
    this.articles = [...articlesData]
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Sort by publication date, newest first
    const sortedArticles = [...this.articles].sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    )
    
    return sortedArticles
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const article = this.articles.find(article => article.Id === parseInt(id))
    if (!article) {
      throw new Error("Article not found")
    }
    
    return article
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const filteredArticles = this.articles
      .filter(article => article.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    
    return filteredArticles
  }

  async getFeatured() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Return the most recent live article or the latest article
    const liveArticle = this.articles.find(article => article.isLive)
    if (liveArticle) return liveArticle
    
    const sortedArticles = [...this.articles].sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    )
    
    return sortedArticles[0]
  }

  async getMostPopular(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const popularArticles = [...this.articles]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit)
    
    return popularArticles
  }

  async getLiveArticles() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const liveArticles = this.articles
      .filter(article => article.isLive)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    
    return liveArticles
  }

  async create(articleData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newId = Math.max(...this.articles.map(a => a.Id)) + 1
    const newArticle = {
      Id: newId,
      ...articleData,
      publishedAt: new Date().toISOString(),
      viewCount: 0
    }
    
    this.articles.unshift(newArticle)
    return newArticle
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350))
    
    const index = this.articles.findIndex(article => article.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    this.articles[index] = { ...this.articles[index], ...updates }
    return this.articles[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.articles.findIndex(article => article.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    const deletedArticle = this.articles.splice(index, 1)[0]
    return deletedArticle
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const searchTerm = query.toLowerCase()
    const results = this.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm)
    )
    
    return results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  }

  async incrementViewCount(id) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const article = this.articles.find(article => article.Id === parseInt(id))
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1
      return article
    }
    
    throw new Error("Article not found")
  }
}

export default new ArticleService()