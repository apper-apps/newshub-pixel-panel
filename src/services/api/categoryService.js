import categoriesData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [...this.categories].sort((a, b) => a.order - b.order)
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const category = this.categories.find(cat => cat.Id === parseInt(id))
    if (!category) {
      throw new Error("Category not found")
    }
    
    return category
  }

  async getBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const category = this.categories.find(cat => cat.slug === slug)
    if (!category) {
      throw new Error("Category not found")
    }
    
    return category
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newId = Math.max(...this.categories.map(c => c.Id)) + 1
    const maxOrder = Math.max(...this.categories.map(c => c.order))
    
    const newCategory = {
      Id: newId,
      ...categoryData,
      order: maxOrder + 1
    }
    
    this.categories.push(newCategory)
    return newCategory
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    this.categories[index] = { ...this.categories[index], ...updates }
    return this.categories[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0]
    return deletedCategory
  }

  async reorder(categoryId, newOrder) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const category = this.categories.find(cat => cat.Id === parseInt(categoryId))
    if (!category) {
      throw new Error("Category not found")
    }
    
    const oldOrder = category.order
    category.order = newOrder
    
    // Adjust other categories
    this.categories.forEach(cat => {
      if (cat.Id !== parseInt(categoryId)) {
        if (newOrder < oldOrder && cat.order >= newOrder && cat.order < oldOrder) {
          cat.order += 1
        } else if (newOrder > oldOrder && cat.order > oldOrder && cat.order <= newOrder) {
          cat.order -= 1
        }
      }
    })
    
    return this.categories.sort((a, b) => a.order - b.order)
  }
}

export default new CategoryService()