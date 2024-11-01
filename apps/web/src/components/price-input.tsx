'use client'

import { ComponentPropsWithoutRef, useCallback, useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'

interface ValueInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> {
  label?: string
  name: string
  initialValue?: number
  onChange?: (value: number) => void
}

// Custom hook for value formatting
const useValueFormatter = () => {
  return useCallback((val: string) => {
    const digits = val.replace(/\D/g, '')
    return (parseInt(digits) / 100).toFixed(2)
  }, [])
}

export default function ValueInput({
  label = 'Value',
  initialValue = 1,
  name,
  onChange,
  className,
  ...props
}: ValueInputProps) {
  const [value, setValue] = useState(() => (initialValue / 100).toFixed(2))
  const formatValue = useValueFormatter()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = formatValue(e.target.value)
      setValue(newValue)
      onChange?.(parseFloat(newValue))
    },
    [formatValue, onChange],
  )

  const inputValue = useMemo(() => `R$ ${value}`, [value])

  return (
    <Input
      id={props.id || 'value-input'}
      type="text"
      name={name}
      inputMode="numeric"
      value={inputValue}
      onChange={handleChange}
      className={`text-right ${className || ''}`}
      aria-label={`${label}`}
      {...props}
    />
  )
}
