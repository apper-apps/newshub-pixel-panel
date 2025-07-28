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

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching articles:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching article with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching articles by category:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getFeatured() {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ],
        where: [
          {
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        pagingInfo: { limit: 1 }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data?.[0] || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured article:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getMostPopular(limit = 5) {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ],
        orderBy: [
          { fieldName: "viewCount", sorttype: "DESC" }
        ],
        pagingInfo: { limit }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching popular articles:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getLiveArticles() {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ],
        where: [
          {
            FieldName: "isLive",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching live articles:", error?.response?.data?.message)
      } else {
        console.error(error.message)
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

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient()
      
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
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "summary",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "content",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "publishedAt", sorttype: "DESC" }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching articles:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async incrementViewCount(id) {
    try {
      const article = await this.getById(id)
      if (article) {
        const newViewCount = (article.viewCount || 0) + 1
        await this.update(id, { viewCount: newViewCount })
      }
    } catch (error) {
      console.error("Error incrementing view count:", error.message)
    }
  }
}

export default new ArticleService()