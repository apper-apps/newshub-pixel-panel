import liveUpdatesData from "@/services/mockData/liveUpdates.json"

class LiveUpdateService {
  constructor() {
    this.liveUpdates = [...liveUpdatesData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [...this.liveUpdates].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  }

  async getByArticleId(articleId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const updates = this.liveUpdates
      .filter(update => update.articleId === articleId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    return updates
  }

  async getRecent(limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const recentUpdates = [...this.liveUpdates]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
    
    return recentUpdates
  }

async create(updateData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newId = Math.max(...this.liveUpdates.map(u => u.Id)) + 1
    const currentTime = new Date()
    
    const newUpdate = {
      Id: newId,
      articleId: updateData.articleId.toString(),
      heading: updateData.heading || "Live Update",
      content: updateData.content,
      socialLink: updateData.socialLink || null,
      timestamp: currentTime.toISOString()
    }
    
    this.liveUpdates.unshift(newUpdate)
    return newUpdate
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.liveUpdates.findIndex(update => update.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Live update not found")
    }
    
    this.liveUpdates[index] = { ...this.liveUpdates[index], ...updates }
    return this.liveUpdates[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.liveUpdates.findIndex(update => update.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Live update not found")
    }
    
    const deletedUpdate = this.liveUpdates.splice(index, 1)[0]
    return deletedUpdate
  }

  // Simulate real-time updates
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