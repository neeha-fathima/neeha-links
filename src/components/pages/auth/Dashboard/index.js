import React from 'react'
import useWeb from '@/Contexts/WebContext'
import Button from '@/Utils/Button'

const Dashboard = () => {
    const { logOut } = useWeb()
    return (
        <div className='w-full flex flex-col gap-4 justify-center items-center h-screen'>
            <p className='normal-case text-heading-s font-semibold'>
                Hello Neeha!
            </p>

            <Button
                title='Logout'
                onClick={logOut}
                className='bg-error-500'
            />
        </div>
    )
}

export default Dashboard