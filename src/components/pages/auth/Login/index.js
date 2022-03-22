import React, { useState, useEffect } from 'react'
import Button from '@/Utils/Button'
import Input from '@/Utils/Input'
import useWeb from '@/Contexts/WebContext'
import Loading from '@/Utils/Loading'

const Login = () => {
    const { loading, signIn } = useWeb()
    // states for email and password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSignIn = (e) => {
        e.preventDefault()
        signIn(email, password)
    }
    return (
        <div className="flex flex-col justify-center w-full h-screen items-center">
            <p className='text-heading font-semibold mb-4'>
                Login
            </p>
            <form onSubmit={handleSignIn}>
                <Input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type='submit'
                    title='Login'
                    className='w-full'
                    disabled={loading || !email || !password}
                />
                <div className="flex justify-center w-full mt-4">
                    {loading && <Loading inline />}
                </div>
            </form>
        </div>
    )
}

export default Login