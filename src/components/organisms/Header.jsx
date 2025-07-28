import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import CategoryNav from "@/components/molecules/CategoryNav"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    setIsSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-secondary to-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={14} />
                <span>{new Date().toLocaleDateString("en-US", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="Clock" size={14} />
                <span>{new Date().toLocaleTimeString("en-US", { 
                  hour: "2-digit", 
                  minute: "2-digit" 
                })}</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="hover:text-primary transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <ApperIcon name="Newspaper" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                NewsHub Pro
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Real-time News Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <CategoryNav direction="horizontal" />
            
            <div className="flex items-center space-x-1">
              <Link
                to="/live"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-error to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </Link>
            </div>
          </div>
{/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <SearchBar 
              onSearch={handleSearch}
              className="w-64"
              placeholder="Search breaking news..."
            />
            <Link to="/admin">
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <ApperIcon name="Settings" size={16} className="mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="p-2"
            >
              <ApperIcon name="Search" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search breaking news..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-6">
                <CategoryNav direction="vertical" onCategoryClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/live"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-error to-red-600 text-white rounded-lg font-semibold"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>LIVE COVERAGE</span>
                  </Link>
                </div>
<div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-500/10 rounded-lg transition-all duration-300 group"
                  >
                    <ApperIcon name="Settings" size={18} className="group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors font-medium">Admin Panel</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header