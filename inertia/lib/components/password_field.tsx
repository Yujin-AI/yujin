import React, { useEffect, useState } from 'react'

import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateRandomPassword } from '@/lib/utils'

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  divClassName?: string
  label: string
  autogenerate?: boolean
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  divClassName,
  label,
  autogenerate = false,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (autogenerate) {
      const generatedPassword = generateRandomPassword()
      onChange &&
        onChange({ target: { value: generatedPassword } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={divClassName}>
      <Label>{label}</Label>
      <div style={{ position: 'relative' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          onChange={onChange}
          {...props}
        />
        {props.value && (
          <button
            onClick={togglePasswordVisibility}
            type="button"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {showPassword ? (
              <Icons.eyeOff className="w-4 h-4" />
            ) : (
              <Icons.eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default PasswordField
