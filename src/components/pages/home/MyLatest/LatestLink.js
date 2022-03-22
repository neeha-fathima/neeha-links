/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LatestLink = ({ title, link, show, img, icon }) => {
    return (
        <Link
            href={link}
            passHref
        >
            <a
                className={[
                    'flex flex-col font-medium py-[12px] px-[12px] rounded transition-all min-w-[260px] w-[260px]',
                    'bg-layout-200 text-layout-800 ',
                    'hover:bg-layout-300 hover:scale-[1.005]',
                    'active:bg-layout-200 active:scale-100',
                    !show && 'hidden'
                ].join(' ')}
                target='_blank'
                rel='noopener noreferrer'
            >
                <img
                    className='rounded h-20 w-full mb-2'
                    src={img}
                    alt={title}
                    style={{
                        objectFit: 'cover',
                    }}
                />
                <div className="flex w-full h-full items-center gap-3">
                    <div className="min-w-[20px] w-[20px] flex justify-center items-center">
                        <img
                            src={`/assets/icons/link-icons/${icon}.png`}
                            alt={title}
                            width='100%'
                        />
                    </div>
                    {title}
                </div>
            </a>
        </Link>
    )
}

export default LatestLink