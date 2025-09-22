"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { UserRole } from "@/types"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  isAdmin: boolean
  isViewer: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

interface RoleProviderProps {
  children: ReactNode
  defaultRole?: UserRole
  storageKey?: string
}

export function RoleProvider({ 
  children, 
  defaultRole = 'viewer', 
  storageKey = 'arqa-user-role' 
}: RoleProviderProps) {
  const [role, setRoleState] = useState<UserRole>(defaultRole)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(storageKey) as UserRole
      if (storedRole && (storedRole === 'viewer' || storedRole === 'admin')) {
        setRoleState(storedRole)
      }
    }
  }, [storageKey])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newRole)
    }
  }

  const value = {
    role,
    setRole,
    isAdmin: role === 'admin',
    isViewer: role === 'viewer'
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
