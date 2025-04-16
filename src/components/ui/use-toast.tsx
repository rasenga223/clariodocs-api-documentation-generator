"use client"

import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastContextProps {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, ...toast }
    setToasts((prev) => [...prev, newToast])

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col max-w-sm gap-2 p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start p-4 rounded-lg shadow-md transition-all duration-300 opacity-100 translate-y-0",
              "bg-background border",
              toast.variant === "destructive"
                ? "border-destructive text-destructive"
                : "border-border"
            )}
          >
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h3 className="font-medium leading-none tracking-tight">
                  {toast.title}
                </h3>
              )}
              {toast.description && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {toast.description}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={() => removeToast(toast.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function toast(props: Omit<Toast, "id">) {
  if (typeof window === "undefined") return

  const toastHelper = {
    toast: (props: Omit<Toast, "id">) => {
      const event = new CustomEvent("toast", { detail: props })
      window.dispatchEvent(event)
    }
  }

  toastHelper.toast(props)
} 