import React from 'react'
import Link from 'next/link'
import Icon from '@/Shared/Icon';

const SocialIcon = ({ icon, link }) => {
    return (
        <Link href={link} passHref >
            <a className='flex items-center justify-center bg-layout-800 p-4 rounded-full hover:bg-layout-600 hover:scale-105 active:bg-layout-700 active:scale-100 transition-all' target='_blank'>
                <Icon icon={icon} theme='light' size='24px' />
            </a>
        </Link>
    )
}

export default SocialIcon