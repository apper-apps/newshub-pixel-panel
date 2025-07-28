import React, { useContext } from 'react'
import { AuthContext } from '@/App'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

function LogoutButton({ className = "" }) {
  const { logout } = useContext(AuthContext)
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className={`flex items-center gap-2 ${className}`}
    >
      <ApperIcon name="LogOut" size={16} />
      Logout
    </Button>
  )
}

export default LogoutButton