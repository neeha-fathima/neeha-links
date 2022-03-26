/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlusCircle, FiTrash2, FiEye, FiEyeOff, FiEdit } from 'react-icons/fi'
import useWeb from '@/Contexts/WebContext'
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { ref, deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/Firebase/index';
import Modal from '@/Utils/Modal'
import Input from '@/Utils/Input'
import Button from '@/Utils/Button'
import Loading from '@/Utils/Loading'
import { linkIconOptions } from '@/Data/icons'

const LatestLink = ({ title, link, show, img, icon, id, order }) => {
    const { user } = useWeb()
    const [showEditModal, setShowEditModal] = useState(false)
    const [linkActive, setLinkActive] = useState(show)
    // useEffect(() => {
    //     onSnapshot(doc(db, 'my-latest', id), (snapshot) => {
    //         setLinkActive(snapshot.data().show)
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [show])
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
                                setDoc(doc(db, `my-latest/${id}`), {
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
                                deleteDoc(doc(db, 'my-latest', id))
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
                        <EditLatestLink
                            setShowEditModal={setShowEditModal}
                            id={id}
                            linkIcon={icon}
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

const EditLatestLink = ({ setShowEditModal, linkTitle, linkIcon, linkLink, linkImg, linkOrder, id }) => {
    const { displayAlert } = useWeb()
    const [loading, setLoading] = useState(false)
    // title,icon,link,order
    const [title, setTitle] = useState(linkTitle)
    const [icon, setIcon] = useState(linkIcon)
    const [link, setLink] = useState(linkLink)
    const [order, setOrder] = useState(linkOrder)
    const [img, setImg] = useState(linkImg)
    const uploadImg = async (e) => {
        setLoading(true)
        const image = e.target.files[0]
        uploadBytes(ref(storage, title), image).then((snapshot) => {
            console.log(snapshot)
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
        setDoc(doc(db, 'my-latest', id), {
            title,
            icon,
            link,
            order,
            img,
        }, {
            merge: true
        }).then(() => {
            setLoading(false)
            setShowEditModal(false)
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
            setShowEditModal(false)
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

export const AddLatestLinkBtn = ({ onClick }) => {
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

export default LatestLink