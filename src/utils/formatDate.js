import { formatDistanceToNow, format } from "date-fns"

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatPublishDate = (date) => {
  return format(new Date(date), "PPP")
}

export const formatDateTime = (date) => {
  return format(new Date(date), "PPP p")
}

export const formatTimestamp = (date) => {
  const now = new Date()
  const articleDate = new Date(date)
  const diffInMinutes = Math.floor((now - articleDate) / (1000 * 60))
  
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}min ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return format(articleDate, "MMM d")
}