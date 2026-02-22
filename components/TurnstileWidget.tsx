'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  theme?: 'light' | 'dark'
}

export default function TurnstileWidget({ onSuccess, theme = 'light' }: TurnstileWidgetProps) {
  const [error, setError] = useState<string | null>(null)

  const handleError = (errorCode?: string) => {
    console.error('Turnstile error:', errorCode)
    setError('Error de verificación. Recargando...')
    onSuccess('')
  }

  const handleSuccess = (token: string) => {
    console.log('Turnstile success')
    setError(null)
    onSuccess(token)
  }

  const handleExpire = () => {
    console.log('Turnstile expired')
    setError(null)
    onSuccess('')
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          theme,
          size: 'normal',
          retry: 'auto',
          appearance: 'always',
        }}
      />
      {error && (
        <div className="text-xs text-red-500 text-center max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}
