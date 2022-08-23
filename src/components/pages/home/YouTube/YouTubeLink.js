/* eslint-disable @next/next/no-img-element */
import useWeb from '@/Contexts/WebContext'
import { db, storage } from '@/Firebase/index'
import Button from '@/Utils/Button'
import Input from '@/Utils/Input'
import Loading from '@/Utils/Loading'
import Modal from '@/Utils/Modal'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Link from 'next/link'
import React, { useState } from 'react'
import { FiEdit, FiEye, FiEyeOff, FiPlusCircle, FiTrash2 } from 'react-icons/fi'

const YouTubeLink = ({ title, link, show, img, tag, id, order }) => {
    const { user } = useWeb()
    const [showEditModal, setShowEditModal] = useState(false)
    const [linkActive, setLinkActive] = useState(show)
    return (
        <div className='flex flex-col gap-1'>
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
                        !show && !user && 'hidden'
                    ].join(' ')}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <img
                        className='rounded h-full w-full mb-2'
                        src={img}
                        alt={title}
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                    <div className="flex w-full h-full items-center gap-3">
                        {title}
                    </div>
                    <p className='rounded-full text-content-xs bg-layout-400 text-layout-100 w-fit py-1 px-[5px]'>
                        {tag}
                    </p>
                </a>
            </Link>
            {
                user && (
                    <div className='flex gap-1'>
                        <div className={[
                            'flex items-center justify-center w-full rounded transition-all gap-4 p-[12px] font-bold cursor-pointer',
                            'hover:scale-[1.05]',
                            'active:scale-100',
                            linkActive ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700',
                        ].join(' ')}
                            onClick={() => {
                                setDoc(doc(db, `youtube/${id}`), {
                                    show: !linkActive
                                }, {
                                    merge: true
                                })
                                setLinkActive(!linkActive)
                            }}
                        >
                            {linkActive ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                        </div>
                        <div className={[
                            'flex items-center justify-center w-full rounded transition-all gap-4 p-[12px] bg-info-100 text-info-700 font-bold cursor-pointer',
                            'hover:scale-[1.05]',
                            'active:scale-100',
                        ].join(' ')}
                            onClick={() => {
                                setShowEditModal(true)
                            }}
                        >
                            <FiEdit size={20} />
                        </div>
                        <div className={[
                            'flex items-center justify-center w-full rounded transition-all gap-4 p-[12px] bg-error-100 text-error-700 font-bold cursor-pointer',
                            'hover:scale-[1.05]',
                            'active:scale-100',
                        ].join(' ')}
                            onClick={() => {
                                deleteDoc(doc(db, 'youtube', id))
                                deleteObject(ref(storage, title))
                            }}
                        >
                            <FiTrash2 size={20} />
                        </div>
                    </div>
                )
            }
            {
                user && showEditModal && (
                    <Modal setShow={setShowEditModal} title='Edit Link' >
                        <EditYouTubeLink
                            setShowEditModal={setShowEditModal}
                            id={id}
                            linkTag={tag}
                            linkLink={link}
                            linkTitle={title}
                            linkOrder={order}
                            linkImg={img}
                        />
                    </Modal>
                )
            }
        </div>
    )
}

export default YouTubeLink

const EditYouTubeLink = ({
    linkTitle,
    linkLink,
    linkOrder,
    linkImg,
    linkTag,
    id,
    setShowEditModal,
}) => {
    const { displayAlert } = useWeb()
    const [loading, setLoading] = useState(false)
    // title,tag,link,order,img
    const [title, setTitle] = useState(linkTitle)
    const [link, setLink] = useState(linkLink)
    const [order, setOrder] = useState(linkOrder)
    const [img, setImg] = useState(linkImg)
    const [tag, setTag] = useState(linkTag)

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
        setDoc(doc(db, 'youtube', id), {
            title,
            link,
            order,
            img,
            tag,
        }, {
            merge: true
        }).then(() => {
            setLoading(false)
            setShowEditModal(false)
            displayAlert(true, 'success', 'Link Edited')
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
            setShowEditModal(false)
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

export const AddYouTubeLinkBtn = ({ onClick }) => {
    return (
        <div className={[
            'flex flex-col justify-center items-center cursor-pointer font-medium py-[12px] px-[12px] rounded transition-all min-w-[64px] w-[64px]',
            'bg-layout-200 text-layout-800 ',
            'hover:bg-layout-300 hover:scale-[1.005]',
            'active:bg-layout-200 active:scale-100',
        ].join(' ')}
            onClick={onClick}
        >
            <FiPlusCircle size={24} />
        </div>
    )
}