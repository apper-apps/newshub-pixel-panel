import React from "react"
import { motion } from "framer-motion"

const Loading = ({ type = "page" }) => {
  if (type === "card") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shimmer" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 shimmer" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 shimmer" />
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (type === "featured") {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div className="h-[400px] lg:h-[500px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shimmer" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer" />
            <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-4/5 shimmer" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer" />
              <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-3/4 shimmer" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-20 shimmer" />
              <div className="h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-16 shimmer" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex space-x-4 p-4 bg-white rounded-lg shadow">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 shimmer" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3 shimmer" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-2xl mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-600/20 rounded-xl"
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Loading NewsHub Pro
          </h2>
          <p className="text-gray-500">Getting the latest news ready for you...</p>
        </div>

        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                backgroundColor: ["#FF6B00", "#FF8533", "#FF6B00"]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Loading