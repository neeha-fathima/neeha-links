import useWeb from '@/Contexts/WebContext'
import { db, storage } from '@/Firebase/index'
import Button from '@/Utils/Button'
import Input from '@/Utils/Input'
import Loading from '@/Utils/Loading'
import Modal from '@/Utils/Modal'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import YouTubeLink, { AddYouTubeLinkBtn } from './YouTubeLink'

const YouTube = () => {
    const { user, setLoading, loading } = useWeb()
    const [youtubeLinks, setYoutubeLinks] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        setLoading(true)
        onSnapshot(collection(db, 'youtube'), (snapshot) => {
            setYoutubeLinks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='w-full mb-4'>
            <p className='normal-case text-content-l font-medium mb-2'>
                YouTube
            </p>
            <div id='youtube' className='flex gap-1 overflow-x-scroll'>
                {user && <AddYouTubeLinkBtn onClick={() => setShowAddModal(!showAddModal)} />}
                {
                    loading ? <Loading inline /> : youtubeLinks.sort((a, b) => a.order - b.order).map(({ id, title, link, img, tag, show }) => (
                        <YouTubeLink key={id} id={id} title={title} link={link} img={img} tag={tag} show={show} />
                    ))
                }
            </div>
            {user && showAddModal && (
                <Modal setShow={setShowAddModal} title='Add Latest' >
                    <AddYouTubeLink setShowAddModal={setShowAddModal} />
                </Modal>
            )}
        </div>
    )
}

export default YouTube

const AddYouTubeLink = ({ setShowAddModal }) => {
    const { displayAlert } = useWeb()
    const [loading, setLoading] = useState(false)
    // title,tag,link,order,img
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [order, setOrder] = useState(0)
    const [img, setImg] = useState('')
    const [tag, setTag] = useState('')

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

    const handleAddYouTubeLink = (e) => {
        e.preventDefault()
        setLoading(true)
        addDoc(collection(db, 'youtube'), {
            title,
            link,
            order,
            img,
            tag,
            show: true
        }).then(() => {
            setLoading(false)
            setShowAddModal(false)
            displayAlert(true, 'success', 'Link Added')
            setTitle('')
            setLink('')
            setOrder(0)
            setImg('')
            setTag('')
        }).catch((err) => {
            console.log(err)
            displayAlert(true, 'error', err.message)
            setLoading(false)
        }).finally(() => {
            setLoading(false)
            setShowAddModal(false)
        })
    }

    return (
        <form className='w-full' onSubmit={handleAddYouTubeLink}>
            <Input
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                placeholder='Tag'
                value={tag}
                onChange={(e) => setTag(e.target.value)}
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
                disabled={!title || !tag || !link || !order || !img || loading}
                onClick={handleAddYouTubeLink}
                className='w-full'
            />
            <div className="flex justify-center w-full mt-4">
                {loading && <Loading inline />}
            </div>
        </form>
    )
}