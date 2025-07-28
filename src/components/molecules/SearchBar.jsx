import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ placeholder = "Search news...", onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm.trim())
      } else {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 bg-white/80 backdrop-blur-sm border-gray-300 focus:bg-white"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-primary/10"
        >
          <ApperIcon name="Search" size={18} className="text-primary" />
        </Button>
      </div>
    </form>
  )
}

export default SearchBar