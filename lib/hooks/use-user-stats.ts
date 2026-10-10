"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { UserProfileStats, UserTrendItem, UserHistoryItem } from "@/lib/services/user-service"

import { apiFetch } from "@/lib/utils"

export interface UserStatsHookResult {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
  stats: UserProfileStats | null
  trend: UserTrendItem[]
  history: UserHistoryItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserStats(fromDate?: string, toDate?: string): UserStatsHookResult {
  const { data: session, status } = useSession()
  const [data, setData] = useState<{
    user: UserStatsHookResult["user"]
    stats: UserProfileStats | null
    trend: UserTrendItem[]
    history: UserHistoryItem[]
  }>({
    user: null,
    stats: null,
    trend: [],
    history: [],
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (status === "loading") return
    if (status === "unauthenticated" || !session) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (fromDate) params.set("fromDate", fromDate)
      if (toDate) params.set("toDate", toDate)

      const url = `/api/user/me${params.toString() ? `?${params.toString()}` : ""}`
      const res = await apiFetch(url)

      if (!res.ok) {
        if (res.status === 401) {
          setError("Sessione non valida o scaduta.")
        } else {
          setError("Impossibile caricare le statistiche utente.")
        }
        setIsLoading(false)
        return
      }

      const json = await res.json()
      setData({
        user: json.user,
        stats: json.stats,
        trend: json.trend || [],
        history: json.history || [],
      })
    } catch (err) {
      console.error("Errore fetch useUserStats:", err)
      setError("Errore di connessione al server.")
    } finally {
      setIsLoading(false)
    }
  }, [status, session, fromDate, toDate])

  useEffect(() => {
    fetchData()

    const handleScoreUpdated = () => {
      fetchData()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scoreUpdated", handleScoreUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scoreUpdated", handleScoreUpdated)
      }
    }
  }, [fetchData])

  return {
    user: data.user,
    stats: data.stats,
    trend: data.trend,
    history: data.history,
    isLoading,
    error,
    refetch: fetchData,
  }
}
