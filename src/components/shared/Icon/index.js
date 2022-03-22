import Image from 'next/image'
import React from 'react'
import icons from '@/Data/icons'

const Icon = ({ icon, theme, size }) => {
    return (
        <Image
            src={icons[icon][theme]}
            alt={icons[icon].name}
            width={size}
            height={size}
        />
    )
}

export default Icon