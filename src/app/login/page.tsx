'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })


    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: supaError } = await supabase.from('user').insert({
      email,
      password
    });

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (supaError || res?.error) {
      setError("something went wrong!");
    } else {
      router.push('/');
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className='flex gap-5'>
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">
            Sign In
          </button>

          <button onClick={handleSignUp} className="w-full bg-blue-600 text-white p-2 rounded">
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}

      </form>
    </div>
  )
}
