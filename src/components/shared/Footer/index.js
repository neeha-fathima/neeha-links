import React, { useState, useEffect } from 'react'
import { db } from '@/Firebase/index'
import { collection, onSnapshot } from 'firebase/firestore'
import SocialIcon from '@/Shared/Footer/SocialIcon'

const Footer = () => {
    const [icons, setIcons] = useState([])
    useEffect(() => {
        onSnapshot(collection(db, 'footer-socials'), (snapshot) => {
            setIcons(snapshot.docs.map(doc => doc.data()))
        })
    }, [])
    return (
        <div className='flex justify-center gap-8 fixed bottom-0 left-0 w-full p-3 bg-layout-100'>
            {
                icons.sort((a, b) => a.order - b.order).map(({ link, icon, order }) => (
                    <SocialIcon
                        key={order}
                        link={link}
                        icon={icon}
                    />
                ))
            }
        </div>
    )
}

export default Footer