import React from 'react'
import Link from 'next/link'

const Button = ({ type = 'button', title, className, onClick, disabled = false, href, as = href }) => {
    if (type === 'link') {
        return (
            <button
                className={[
                    'font-medium py-[12px] px-[18px] rounded transition-all',
                    !disabled ? 'bg-layout-800 text-layout-100 ' : 'bg-layout-300 text-layout-100',
                    !disabled && 'hover:bg-layout-600 hover:scale-[1.005]',
                    !disabled && 'active:bg-layout-700 active:scale-100',
                    className
                ].join(' ')}>
                <Link
                    href={href}
                    as={as}
                    passHref

                >
                    <a
                        target={href === '/' ? '_self' : '_blank'}
                        rel='noopener noreferrer'
                    >
                        {title}
                    </a>
                </Link>
            </button>
        )
    }
    return (
        <button
            type={type}
            className={[
                'font-medium py-[12px] px-[18px] rounded transition-all',
                !disabled ? 'bg-layout-800 text-layout-100 ' : 'bg-layout-300 text-layout-100',
                !disabled && 'hover:bg-layout-600 hover:scale-[1.005]',
                !disabled && 'active:bg-layout-700 active:scale-100',
                className
            ].join(' ')}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    )
}

export default Button