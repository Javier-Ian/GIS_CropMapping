import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({ title, description, variant = "default", onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
          : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        isVisible ? "animate-in slide-in-from-top-2" : "animate-out slide-out-to-top-2"
      )}
    >
      <div className="flex items-start space-x-3">
        {variant === "destructive" && (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className={cn(
              "text-sm font-medium",
              variant === "destructive" ? "text-red-800 dark:text-red-200" : "text-gray-900 dark:text-gray-100"
            )}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn(
              "mt-1 text-sm",
              variant === "destructive" ? "text-red-700 dark:text-red-300" : "text-gray-600 dark:text-gray-400"
            )}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className={cn(
            "flex-shrink-0 rounded-md p-1.5 transition-colors",
            variant === "destructive"
              ? "text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
              : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
