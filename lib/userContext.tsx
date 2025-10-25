"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)
  const router = useRouter();

  // On mount, sync state from cookie
  useEffect(() => {
    // const cookieToken = getCookie('token') as string | undefined
    const sessionToken = sessionStorage.getItem('token');
    //setTokenState(cookieToken ?? sessionToken ?? null);
    setTokenState(sessionToken ?? null);
  }, [])

  // Utility for setting token (login/logout actions)
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      setCookie('token', newToken, { maxAge: 60 * 60 * 24, path: '/' });
      sessionStorage.setItem('token', newToken);
    } else {
      deleteCookie("token");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("type");
      sessionStorage.removeItem("userType");
      toast.success("Logout Successfully");
      router.push("/login");
    }
  };

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
