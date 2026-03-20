import { useEffect, useState } from 'react'

/**
 * Debounce hook — delays updating a value until after a specified wait time.
 * Used for auto-save to prevent excessive Supabase API calls.
 */
export function useDebounce<T>(value: T, delay: number = 2000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
