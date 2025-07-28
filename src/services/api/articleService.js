import { toast } from 'react-toastify'

class ArticleService {
  constructor() {
    this.tableName = 'article'
    this.apperClient = null
    this.initializeClient()
  }
initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll(limit = 50, offset = 0) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized field selection for list view - exclude heavy content field
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "featured" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: Math.min(limit, 100), // Cap maximum limit for performance
          offset: Math.max(offset, 0)
        }
      }
const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for articles: ${response.message}`)
        toast.error(response.message)
        return []
      }
// Return data directly
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching articles:", error?.response?.data?.message)
      } else {
        console.error("Article service error:", error.message)
      }
return []
    }
  }

  async getById(id) {
try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized field selection for single article view - include all fields
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "featured" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(`Database query failed for article ID ${id}: ${response.message}`)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Database error fetching article ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(`Article service error for ID ${id}:`, error.message)
      }
      return null
    }
  }

  async getByCategory(category) {
try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized query for category filtering with pagination
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "featured" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 25, // Optimized limit for category pages
          offset: 0
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for category ${category}: ${response.message}`)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Database error fetching category ${category}:`, error?.response?.data?.message)
      } else {
        console.error(`Category filter error for ${category}:`, error.message)
      }
      return []
    }
  }

  async getFeatured() {
try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized query for featured article - minimal fields for performance
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "featured" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
          },
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["published"]
          }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 1 }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for featured article: ${response.message}`)
        return null
      }
      
      return response.data?.[0] || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching featured article:", error?.response?.data?.message)
      } else {
        console.error("Featured article service error:", error.message)
      }
      return null
    }
  }

  async getMostPopular(limit = 5) {
try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized query for popular articles - focus on essential display fields
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "isLive" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["published"]
          }
        ],
        orderBy: [
          { fieldName: "viewCount", sorttype: "DESC" }
        ],
        pagingInfo: { 
          limit: Math.min(limit, 20), // Cap for performance
          offset: 0
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for popular articles: ${response.message}`)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching popular articles:", error?.response?.data?.message)
      } else {
        console.error("Popular articles service error:", error.message)
      }
      return []
    }
  }

async getLiveArticles(limit = 10) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized query for live articles - prioritize performance and freshness
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "isLive",
            Operator: "EqualTo",
            Values: [true]
          },
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["published"]
          }
        ],
        orderBy: [
          { fieldName: "updatedAt", sorttype: "DESC" }, // Use updatedAt for live content
          { fieldName: "publishedAt", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: Math.min(limit, 15), // Reasonable limit for live content
          offset: 0
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for live articles: ${response.message}`)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching live articles:", error?.response?.data?.message)
      } else {
        console.error("Live articles service error:", error.message)
      }
      return []
    }
  }

  async create(articleData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [
          {
            Name: articleData.title || "Untitled Article",
            title: articleData.title || "Untitled Article",
            summary: articleData.summary || "",
            content: articleData.content || "",
            category: articleData.category || "general",
            author: articleData.author || "NewsHub Pro",
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: articleData.imageUrl || "",
            featured: articleData.featured || false,
            isLive: articleData.isLive || false,
            viewCount: 0,
            status: articleData.status || "published",
            Tags: Array.isArray(articleData.tags) ? articleData.tags.join(',') : ""
          }
        ]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create articles ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating article:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const updateData = {
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      }
      
      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.summary !== undefined) updateData.summary = updates.summary
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.author !== undefined) updateData.author = updates.author
      if (updates.publishedAt !== undefined) updateData.publishedAt = updates.publishedAt
      if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.isLive !== undefined) updateData.isLive = updates.isLive
      if (updates.viewCount !== undefined) updateData.viewCount = updates.viewCount
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.tags !== undefined) updateData.Tags = Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags
      
      const params = {
        records: [updateData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update articles ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating article:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete articles ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        const successfulDeletions = response.results.filter(result => result.success)
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting article:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

async search(query, limit = 20, offset = 0) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized search query - exclude content field for performance
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "summary" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "featured" } },
          { field: { Name: "isLive" } },
          { field: { Name: "viewCount" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                operator: "OR",
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  },
                  {
                    fieldName: "summary",
                    operator: "Contains",
                    values: [query]
                  },
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "status",
                    operator: "EqualTo",
                    values: ["published"]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: Math.min(limit, 50), // Performance limit for search
          offset: Math.max(offset, 0)
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database search query failed for "${query}": ${response.message}`)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Database error searching articles for "${query}":`, error?.response?.data?.message)
      } else {
        console.error(`Search service error for "${query}":`, error.message)
      }
      return []
    }
  }

async incrementViewCount(id) {
    try {
      // Optimized view count increment - fetch minimal data
      const article = await this.getById(id)
      if (article && article.viewCount !== undefined) {
        const newViewCount = (parseInt(article.viewCount) || 0) + 1
        await this.update(id, { viewCount: newViewCount })
        
        // Log performance metrics for analytics
        if (newViewCount % 100 === 0) {
          console.log(`Article ${id} reached ${newViewCount} views`)
        }
      }
    } catch (error) {
      // Non-blocking error handling for view count
      console.error(`Database error incrementing view count for article ${id}:`, error.message)
    }
  }
}

export default new ArticleService()