import TopBar from '@/Shared/TopBar'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import paths from '@/Data/paths'
import Footer from '@/Shared/Footer'
import Alert from '@/Utils/Alert'

const Layout = ({ children }) => {
    const router = useRouter()
    // get the current path
    const path = router.pathname
    // get the current page title from data/paths.js
    const title = paths[path]
    return (
        <div className='3xl:px-[54vh] 2xl:px-[42vh] xl:px-[32vh] lg:px-[24vh] md:px-[16vh] sm:w-full p-4 mb-[12vh]'>
            <Head>
                <title>{title}</title>
            </Head>
            <TopBar />
            {children}
            <Alert />
            <Footer />
        </div>
    )
}

export default Layout