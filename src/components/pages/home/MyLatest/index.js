import React, { useState, useEffect } from 'react'
import LatestLink, { AddLatestLinkBtn } from '@/Pages/home/MyLatest/LatestLink'
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db, storage } from '@/Firebase/index'
import useWeb from '@/Contexts/WebContext'
import Loading from '@/Utils/Loading'
import Modal from '@/Utils/Modal'
import Input from '@/Utils/Input'
import Button from '@/Utils/Button'
import { linkIconOptions } from '@/Data/icons'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'


const MyLatest = () => {
    const { user, setLoading, loading } = useWeb()
    const [links, setLinks] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    useEffect(() => {
        setLoading(true)
        onSnapshot(collection(db, 'my-latest'), (snapshot) => {
            setLinks(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
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
                {user && <AddLatestLinkBtn onClick={() => setShowAddModal(!showAddModal)} />}
                {
                    loading ? <Loading inline /> :
                        links.sort((a, b) => a.order - b.order).map(({ img, link, title, show, order, icon, id }) => {
                            return <LatestLink key={order} img={img} link={link} title={title} show={show} order={order} icon={icon} id={id} />
                        })
                }
            </div>
            {user && showAddModal && (
                <Modal setShow={setShowAddModal} title='Add Latest' >
                    <AddLatestLink setShowAddModal={setShowAddModal} />
                </Modal>
            )}
        </div>
    )
}

const AddLatestLink = ({ setShowAddModal }) => {
    const { displayAlert } = useWeb()
    const [loading, setLoading] = useState(false)
    // title,icon,link,order,img
    const [title, setTitle] = useState('')
    const [icon, setIcon] = useState('')
    const [link, setLink] = useState('')
    const [order, setOrder] = useState(0)
    const [img, setImg] = useState('')
    const uploadImg = async (e) => {
        setLoading(true)
        const image = e.target.files[0]
        uploadBytes(ref(storage, title), image).then((snapshot) => {
            displayAlert(true, 'success', 'Image uploaded successfully')
            getDownloadURL(snapshot.ref).then((url) => {
                setImg(url)
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                displayAlert(true, 'error', err.message)
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
        })
    }
    const handleAddLink = (e) => {
        e.preventDefault()
        setLoading(true)
        addDoc(collection(db, 'my-latest'), {
            title,
            icon,
            link,
            order,
            img,
            show: true
        }).then(() => {
            setLoading(false)
            setShowAddModal(false)
            displayAlert(true, 'success', 'Link Added')
            setTitle('')
            setIcon('')
            setLink('')
            setOrder(0)
            setImg('')
        }).catch(err => {
            console.log(err)
            setLoading(false)
            displayAlert(true, 'error', err.message)
        }).finally(() => {
            setShowAddModal(false)
        })
    }
    return (
        <form className='w-full' onSubmit={handleAddLink} >
            <Input
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Input
                type='select'
                placeholder='Icon'
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                options={linkIconOptions}
            />
            <Input
                placeholder='Link'
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <Input
                type='file'
                placeholder='Image'
                accept="image/png, image/jpeg"
                onChange={uploadImg}
                disabled={title === ''}
            />
            <Input
                placeholder='Image Link'
                value={img}
                onChange={(e) => setImg(e.target.value)}
                disabled={true}
            />
            <Input
                type='number'
                placeholder='Order'
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
            />
            <Button
                type='submit'
                title='Add'
                disabled={!title || !icon || !link || !order || !img || loading}
                onClick={handleAddLink}
                className='w-full'
            />
            <div className="flex justify-center w-full mt-4">
                {loading && <Loading inline />}
            </div>
        </form>
    )
}

export default MyLatest