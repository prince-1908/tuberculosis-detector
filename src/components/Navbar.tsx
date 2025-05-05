import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export const Navbar = () => {
    const { data: session } = useSession()
    return (
        <header className="bg-blue-900 text-white py-6 shadow-md flex flex-col md:flex-row gap-y-4 items-center justify-between">
            <div className="px-8">
                <h1 className="text-3xl font-bold">Tuberculosis Detector</h1>
            </div>
            <ul className='px-8 flex gap-8 text-xl'>
                <li className='cursor-pointer'>
                    <Link href='/'>Home</Link>
                </li>
                <li className='cursor-pointer'>
                    {session ? <Link href='/history'>History</Link>
                        : <Link href='/login'>Login</Link>
                    }
                </li>
                {
                    session &&
                    <li className='cursor-pointer'>
                        <button onClick={() => signOut()}>Logout</button>
                    </li>
                }
            </ul>
        </header>
    )
}
