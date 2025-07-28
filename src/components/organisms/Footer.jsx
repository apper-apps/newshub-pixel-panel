import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "News",
      links: [
        { name: "Breaking News", href: "/category/breaking" },
        { name: "Politics", href: "/category/politics" },
        { name: "World", href: "/category/world" },
        { name: "Business", href: "/category/business" }
      ]
    },
    {
      title: "Categories",
      links: [
        { name: "Sports", href: "/category/sport" },
        { name: "Technology", href: "/category/technology" },
        { name: "Health", href: "/category/health" },
        { name: "Opinion", href: "/category/opinion" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" }
      ]
    }
  ]

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "YouTube", icon: "Youtube", href: "#" },
    { name: "LinkedIn", icon: "Linkedin", href: "#" }
  ]

  return (
    <footer className="bg-gradient-to-br from-secondary via-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Stay Informed
            </h3>
            <p className="text-gray-300 mb-6">
              Get breaking news alerts and daily updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex-1 max-w-md"
              />
              <Button variant="primary" className="px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Newspaper" size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  NewsHub Pro
                </h2>
                <p className="text-sm text-gray-400">Real-time News Platform</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted source for breaking news, in-depth analysis, and real-time updates from around the world.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} NewsHub Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer