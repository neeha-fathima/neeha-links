import React, { useState, useEffect } from 'react'
import LatestLink from '@/Pages/home/MyLatest/LatestLink'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/Firebase/index'
import useWeb from '@/Contexts/WebContext'
import Loading from '@/Utils/Loading'

const MyLatest = () => {
    const { setLoading, loading } = useWeb()
    const [links, setLinks] = useState([])
    useEffect(() => {
        setLoading(true)
        onSnapshot(collection(db, 'my-latest'), (snapshot) => {
            setLinks(snapshot.docs.map(doc => doc.data()))
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='w-full mb-4'>
            <p className='normal-case text-content-l font-medium mb-2'>
                My Latest
            </p>
            <div id='latest' className="flex gap-1 overflow-x-scroll">
                {
                    loading ? <Loading inline /> :
                        links.sort((a, b) => a.order - b.order).map(({ img, link, title, show, order, icon }) => {
                            return <LatestLink key={order} img={img} link={link} title={title} show={show} order={order} icon={icon} />
                        })
                }
            </div>
        </div>
    )
}

export default MyLatest