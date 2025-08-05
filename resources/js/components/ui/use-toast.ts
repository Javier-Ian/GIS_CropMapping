import * as React from "react"

export interface ToastData {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

interface Toast extends ToastData {
  id: string
}

let toastCount = 0
const listeners: Set<(toasts: Toast[]) => void> = new Set()
const toasts: Toast[] = []

function addToast(toastData: ToastData): string {
  const id = (++toastCount).toString()
  const toast: Toast = { ...toastData, id }
  
  toasts.push(toast)
  listeners.forEach(listener => listener([...toasts]))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
  
  return id
}

function removeToast(id: string) {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach(listener => listener([...toasts]))
  }
}

export function toast(toastData: ToastData) {
  return addToast(toastData)
}

export function useToast() {
  const [toastList, setToastList] = React.useState<Toast[]>([])
  
  React.useEffect(() => {
    listeners.add(setToastList)
    return () => {
      listeners.delete(setToastList)
    }
  }, [])
  
  return {
    toasts: toastList,
    toast: addToast,
    dismiss: removeToast
  }
}
