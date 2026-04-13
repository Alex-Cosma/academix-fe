import { getSession } from "next-auth/react"
import { siteConfig } from "@/config/site"

class ApiClient {
  private baseUrl = siteConfig.apiUrl

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }
    return headers
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const res = await fetch(url.toString(), { headers: await this.getHeaders() })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: await this.getHeaders(),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
  }
}

export const apiClient = new ApiClient()
