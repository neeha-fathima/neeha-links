import React, { useEffect } from 'react'
import useWeb from '@/Contexts/WebContext';
import Alert from '@/Utils/Alert';
import Login from '@/Pages/auth/Login';
import { useRouter } from 'next/router';
import Loading from '@/Utils/Loading';

const Auth = () => {
    const { user } = useWeb()
    const router = useRouter()
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    return (
        <div className="">
            {!user ?
                <Login />
                :
                <Loading modal />
            }
            <Alert />
        </div>
    )
}

export default Auth