import categoriesData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    return [...this.categories].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const category = this.categories.find(cat => cat.Id === parseInt(id))
    if (!category) {
      throw new Error("Category not found")
    }
    
    return { ...category }
  }

  async getBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const category = this.categories.find(cat => cat.slug === slug)
    if (!category) {
      throw new Error("Category not found")
    }
    
    return { ...category }
  }

  async getActive() {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    return this.categories
      .filter(cat => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const newId = Math.max(...this.categories.map(c => c.Id)) + 1
    const newCategory = {
      Id: newId,
      name: categoryData.name || "New Category",
      slug: categoryData.slug || categoryData.name?.toLowerCase().replace(/\s+/g, '-') || "new-category",
      description: categoryData.description || "",
      color: categoryData.color || "#6C757D",
      icon: categoryData.icon || "Tag",
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      sortOrder: categoryData.sortOrder || (Math.max(...this.categories.map(c => c.sortOrder)) + 1)
    }
    
    this.categories.push(newCategory)
    return newCategory
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    this.categories[index] = { ...this.categories[index], ...updates }
    return this.categories[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0]
    return deletedCategory
  }

  async reorder(categoryIds) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    categoryIds.forEach((id, index) => {
      const category = this.categories.find(cat => cat.Id === parseInt(id))
      if (category) {
        category.sortOrder = index + 1
      }
    })
    
    return this.categories.sort((a, b) => a.sortOrder - b.sortOrder)
  }
}

export default new CategoryService()