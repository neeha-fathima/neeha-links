/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Link from 'next/link'
import { FiPlusCircle, FiTrash2, FiEye, FiEyeOff, FiEdit } from 'react-icons/fi'
import useWeb from '@/Contexts/WebContext'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/Firebase/index';
import Modal from '@/Utils/Modal'
import Input from '@/Utils/Input'
import Button from '@/Utils/Button'
import Loading from '@/Utils/Loading'
import { linkIconOptions } from '@/Data/icons'


const MoreLink = ({ id, link, icon, title, show, order }) => {
    const { user } = useWeb()
    const [showEditModal, setShowEditModal] = useState(false)
    const [linkActive, setLinkActive] = useState(show)
    return (
        <div className='flex gap-2' >
            <Link
                href={link}
                passHref
            >
                <a
                    className={[
                        'font-medium py-[12px] px-[18px] rounded transition-all flex w-full gap-4 mb-2',
                        'bg-layout-200 text-layout-800 ',
                        'hover:bg-layout-300 hover:scale-[1.005]',
                        'active:bg-layout-200 active:scale-100',
                        !show && !user && 'hidden'
                    ].join(' ')}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <div className="min-w-[20px] w-[20px]  flex justify-center items-center">
                        <img
                            src={`/assets/icons/link-icons/${icon}.png`}
                            alt={title}
                            width='100%'
                        />
                    </div>
                    {title}
                </a>
            </Link>
            {
                user && (
                    <>
                        <div className={[
                            'flex items-center rounded transition-all gap-4 p-[12px] mb-2 font-bold cursor-pointer',
                            'hover:scale-[1.05]',
                            'active:scale-100',
                            linkActive ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700',
                        ].join(' ')}
                            onClick={() => {
                                setDoc(doc(db, `more-links/${id}`), {
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
                            'flex items-center rounded transition-all gap-4 p-[12px] mb-2 bg-info-100 text-info-700 font-bold cursor-pointer',
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
                            'flex items-center rounded transition-all gap-4 p-[12px] mb-2 bg-error-100 text-error-700 font-bold cursor-pointer',
                            'hover:scale-[1.05]',
                            'active:scale-100',
                        ].join(' ')}
                            onClick={() => {
                                deleteDoc(doc(db, 'more-links', id))
                            }}
                        >
                            <FiTrash2 size={20} />
                        </div>
                    </>
                )
            }
            {
                user && showEditModal && (
                    <Modal setShow={setShowEditModal} title='Edit Link' >
                        <EditMoreLink
                            setShowEditModal={setShowEditModal}
                            id={id}
                            linkIcon={icon}
                            linkLink={link}
                            linkTitle={title}
                            linkOrder={order}
                        />
                    </Modal>
                )
            }
        </div>
    )
}

const EditMoreLink = ({ setShowEditModal, linkTitle, linkIcon, linkLink, linkOrder, id }) => {
    const { loading, displayAlert, setLoading } = useWeb()
    // title,icon,link,order
    const [title, setTitle] = useState(linkTitle)
    const [icon, setIcon] = useState(linkIcon)
    const [link, setLink] = useState(linkLink)
    const [order, setOrder] = useState(linkOrder)
    console.log(title, icon, link, order)
    const handleEditLink = (e) => {
        e.preventDefault()
        setLoading(true)
        setDoc(doc(db, 'more-links', id), {
            title,
            icon,
            link,
            order
        }, {
            merge: true
        }).then(() => {
            setTimeout(() => {
                setLoading(false)
                setShowEditModal(false)
                displayAlert(true, 'success', 'Link Edited')
            }, 1000)
        }).catch(err => {
            console.log(err)
            setLoading(false)
            displayAlert(true, 'error', err.message)
        }).finally(() => {
            setShowEditModal(false)
        })
    }
    return (
        <form className='w-full' onSubmit={handleEditLink}>
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
                type='number'
                placeholder='Order'
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
            />
            <Button
                type='submit'
                title='Add'
                disabled={!title || !icon || !link || !order}
                onClick={handleEditLink}
                className='w-full'
            />
            <div className="flex justify-center w-full mt-4">
                {loading && <Loading inline />}
            </div>
        </form>
    )
}

export const AddMoreLinkBtn = ({ onClick }) => {
    return (
        <div className={[
            'font-medium py-[12px] px-[18px] rounded transition-all flex w-full gap-4 mb-2 cursor-pointer',
            'bg-layout-200 text-layout-800 ',
            'hover:bg-layout-300 hover:scale-[1.005]',
            'active:bg-layout-200 active:scale-100',
        ].join(' ')}
            onClick={onClick}
        >
            <div className="min-w-[20px] w-[20px]  flex justify-center items-center">
                <FiPlusCircle size={20} />
            </div>
            Add Link
        </div>
    )
}

export default MoreLink