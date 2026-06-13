"use client"

import { useEffect, useState } from 'react'

export default function TestConnection() {
  const [message, setMessage] = useState('Testing connection...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          setMessage('✅ Backend connection successful!')
        } else {
          setMessage('⚠️ Backend reached but returned error')
        }
      } catch (err) {
        setError('❌ Could not connect to backend')
        console.error('Connection error:', err)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h1>Backend Connection Test</h1>
      <p>{message}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <h2>Available API Endpoints:</h2>
        <ul>
          <li>POST /auth/register - User registration</li>
          <li>POST /auth/login - User login</li>
          <li>GET /auth/profile - Get user profile (protected)</li>
          <li>POST /auth/logout - Logout</li>
          <li>POST /auth/forgot-password - Forgot password</li>
          <li>POST /auth/verify-code - Verify reset code</li>
          <li>POST /auth/reset-password - Reset password</li>
          <li>POST /auth/verify-email - Verify email</li>
        </ul>
      </div>
    </div>
  )
}