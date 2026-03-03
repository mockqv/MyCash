import axios from "axios"
import { supabase } from "./supabase"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { data, error: refreshError } = await supabase.auth.refreshSession()

      if (refreshError || !data.session) {
        await supabase.auth.signOut()
        window.location.href = "/login"
        return Promise.reject(error)
      }

      originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`
      return api(originalRequest)
    }

    return Promise.reject(error)
  }
)