import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/Utils/Button';

const TopBar = () => {
    return (
        <div className='flex flex-col w-full justify-between items-center mb-4'>
            <div className="flex w-full justify-between items-center mb-2">
                <Link href='/' passHref>
                    <a className='text-heading-s font-semibold'>
                        Neeha Fathima
                    </a>
                </Link>
                <Link href='/' passHref>
                    <a className='flex justify-center items-center'>
                        <Image src='/assets/images/logo.png' alt='neeha fathima' width='36px' height='44px' />
                    </a>
                </Link>
            </div>
            {/* Subscribe to newsletter */}
            <Button type='link' href='https://neeha.substack.com/' title='subscribe to my newsletter' className='w-full' />
        </div>
    )
}

export default TopBar