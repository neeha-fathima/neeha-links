import React from 'react'
import MoreLinks from '@/Pages/home/MoreLinks'
import MyLatest from '@/Pages/home/MyLatest'
import Layout from '@/Utils/Layout';
import useWeb from '@/Contexts/WebContext';
import Button from '@/Utils/Button';
import YouTube from '@/Pages/home/YouTube';

const Home = () => {
  const { logOut, user } = useWeb()
  return (
    <Layout>
      <MyLatest />
      <YouTube />
      <MoreLinks />
      {user && (
        <Button
          title="Logout"
          onClick={logOut}
          className="bg-error-500 w-full"
        />
      )}
    </Layout>
  )
}

export default Home