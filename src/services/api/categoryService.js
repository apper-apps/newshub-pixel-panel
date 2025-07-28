import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    this.tableName = 'category'
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

async getAll(includeInactive = false) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Optimized category query with conditional active filter
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "isActive" } },
          { field: { Name: "sortOrder" } }
        ],
        orderBy: [
          { fieldName: "sortOrder", sorttype: "ASC" },
          { fieldName: "Name", sorttype: "ASC" }
        ],
        pagingInfo: {
          limit: 100, // Categories are typically fewer, reasonable limit
          offset: 0
        }
      }
      
      // Add active filter unless explicitly requesting inactive categories
      if (!includeInactive) {
        params.where = [
          {
            FieldName: "isActive",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(`Database query failed for categories: ${response.message}`)
        toast.error(response.message)
        return []
      }
      
      // Return sorted and filtered categories
      const categories = response.data || []
      
      // Additional client-side sorting for consistency
      return categories.sort((a, b) => {
        const sortOrderA = parseInt(a.sortOrder) || 999
        const sortOrderB = parseInt(b.sortOrder) || 999
        return sortOrderA === sortOrderB 
          ? a.Name.localeCompare(b.Name)
          : sortOrderA - sortOrderB
      })
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Database error fetching categories:", error?.response?.data?.message)
      } else {
        console.error("Category service error:", error.message)
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
          { field: { Name: "slug" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "isActive" } },
          { field: { Name: "sortOrder" } },
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
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getBySlug(slug) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "isActive" } },
          { field: { Name: "sortOrder" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "slug",
            Operator: "EqualTo",
            Values: [slug]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data?.[0] || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching category by slug:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getActive() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "isActive" } },
          { field: { Name: "sortOrder" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "isActive",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          { fieldName: "sortOrder", sorttype: "ASC" }
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
        console.error("Error fetching active categories:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [
          {
            Name: categoryData.name || "New Category",
            slug: categoryData.slug || categoryData.name?.toLowerCase().replace(/\s+/g, '-') || "new-category",
            description: categoryData.description || "",
            color: categoryData.color || "#6C757D",
            icon: categoryData.icon || "Tag",
            isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
            sortOrder: categoryData.sortOrder || 1,
            Tags: Array.isArray(categoryData.tags) ? categoryData.tags.join(',') : ""
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
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating category:", error?.response?.data?.message)
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
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.slug !== undefined) updateData.slug = updates.slug
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.color !== undefined) updateData.color = updates.color
      if (updates.icon !== undefined) updateData.icon = updates.icon
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive
      if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder
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
          console.error(`Failed to update categories ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating category:", error?.response?.data?.message)
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
          console.error(`Failed to delete categories ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
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
        console.error("Error deleting category:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async reorder(categoryIds) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const records = categoryIds.map((id, index) => ({
        Id: parseInt(id),
        sortOrder: index + 1
      }))
      
      const params = { records }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      // Return updated categories
      return await this.getAll()
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error reordering categories:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }
}

export default new CategoryService()