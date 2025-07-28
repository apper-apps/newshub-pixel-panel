import { toast } from 'react-toastify'

class LiveUpdateService {
  constructor() {
    this.tableName = 'live_update'
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

async getAll(limit = 20, offset = 0) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized live updates query with pagination
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "articleId" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: Math.min(limit, 50), // Performance limit for live updates
          offset: Math.max(offset, 0)
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for live updates: ${response.message}`)
        toast.error(response.message)
        return []
      }
      
      // Return optimized response with metadata
      const updates = response.data || []
      
      // Add performance logging for monitoring
      if (updates.length > 0) {
        const latestUpdate = new Date(updates[0].timestamp)
        const now = new Date()
        const timeDiff = now - latestUpdate
        
        // Log if latest update is older than 1 hour (potential issue)
        if (timeDiff > 3600000) {
          console.warn(`Latest live update is ${Math.round(timeDiff / 60000)} minutes old`)
        }
      }
      
      return updates
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching live updates:", error?.response?.data?.message)
      } else {
        console.error("Live updates service error:", error.message)
      }
      return []
    }
  }

  async getByArticleId(articleId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "articleId" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "articleId",
            Operator: "EqualTo",
            Values: [articleId.toString()]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
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
        console.error("Error fetching live updates by article:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getRecent(limit = 10) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "articleId" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
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
        console.error("Error fetching recent live updates:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async create(updateData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const currentTime = new Date()
      
      const params = {
        records: [
          {
            Name: updateData.heading || "Breaking Update",
            articleId: updateData.articleId.toString(),
            content: updateData.content,
            timestamp: currentTime.toISOString(),
            Tags: Array.isArray(updateData.tags) ? updateData.tags.join(',') : ""
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
          console.error(`Failed to create live updates ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating live update:", error?.response?.data?.message)
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
        Id: parseInt(id)
      }
      
      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name
      if (updates.heading !== undefined) updateData.Name = updates.heading
      if (updates.articleId !== undefined) updateData.articleId = updates.articleId.toString()
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp
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
          console.error(`Failed to update live updates ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating live update:", error?.response?.data?.message)
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
          console.error(`Failed to delete live updates ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
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
        console.error("Error deleting live update:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async generateRandomUpdate() {
    const sampleUpdates = [
      "Breaking: New developments in ongoing story...",
      "Updated: Officials confirm latest information...",
      "Live: Press conference scheduled for 3 PM...",
      "Alert: Situation continues to develop...",
      "Update: Additional details emerge..."
    ]
    
    const randomContent = sampleUpdates[Math.floor(Math.random() * sampleUpdates.length)]
    const randomArticleId = Math.floor(Math.random() * 8) + 1
    
    return this.create({
      articleId: randomArticleId.toString(),
      content: randomContent
    })
  }
}

export default new LiveUpdateService()