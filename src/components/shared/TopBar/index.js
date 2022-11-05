import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/Utils/Button';
import { FiArrowUpRight, FiGlobe } from 'react-icons/fi';

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
            {/* <Button type='link' href='https://neeha.substack.com/' title='subscribe to my newsletter' className='w-full' /> */}
            {/* portfolio & resume */}
            <div className='flex justify-between items-center w-full gap-2'>
                <Link
                    href={'https://neehafathima.in/'}
                    passHref
                >
                    <a
                        className={[
                            'font-medium py-[12px] px-[18px] rounded transition-all text-center',
                            'bg-layout-800 text-layout-100 ',
                            'hover:bg-layout-600 hover:scale-[1.005]',
                            'active:bg-layout-700 active:scale-100',
                            'w-full flex justify-center items-center gap-2'
                        ].join(' ')}
                        target={'_blank'}
                        rel='noopener noreferrer'
                    >
                        <FiGlobe />
                        <span>
                            portfolio
                        </span>
                    </a>
                </Link>
                <Link
                    href={'https://bit.ly/resume-neehafathima'}
                    passHref
                >
                    <a
                        className={[
                            'font-medium py-[12px] px-[18px] rounded transition-all text-center',
                            'bg-layout-200 text-layout-800 ',
                            'hover:bg-layout-300 hover:scale-[1.005]',
                            'active:bg-layout-200 active:scale-100',
                            'w-full flex justify-center items-center gap-2'
                        ].join(' ')}
                        target={'_blank'}
                        rel='noopener noreferrer'
                    >
                        <FiArrowUpRight />
                        <span>
                            resume
                        </span>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default TopBar