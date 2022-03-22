import React, { useState, useEffect } from 'react'
import MoreLink, { AddMoreLinkBtn } from '@/Pages/home/MoreLinks/MoreLink'
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '@/Firebase/index';
import Loading from '@/Utils/Loading'
import useWeb from '@/Contexts/WebContext';
import Modal from '@/Utils/Modal';
import Input from '@/Utils/Input';
import { linkIconOptions } from '@/Data/icons'
import Button from '@/Utils/Button';


const MoreLinks = () => {
    const { user, setLoading, loading } = useWeb()
    const [links, setLinks] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    useEffect(() => {
        setLoading(true)
        onSnapshot(collection(db, 'more-links'), (snapshot) => {
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
                More
            </p>
            {
                loading ? <Loading inline /> :
                    links.sort((a, b) => a.order - b.order).map(({ icon, link, title, show, order, id }) => {
                        return <MoreLink key={order} icon={icon} link={link} title={title} show={show} order={order} id={id} />
                    })
            }
            {user && <AddMoreLinkBtn onClick={() => setShowAddModal(!showAddModal)} />}
            {user && showAddModal && (
                <Modal setShow={setShowAddModal} title='Add More Links' >
                    <AddMoreLinks setShowAddModal={setShowAddModal} />
                </Modal>
            )}
        </div >
    )
}

const AddMoreLinks = ({ setShowAddModal }) => {
    const { loading, displayAlert, setLoading } = useWeb()
    // title,icon,link,order
    const [title, setTitle] = useState('')
    const [icon, setIcon] = useState('')
    const [link, setLink] = useState('')
    const [order, setOrder] = useState(0)
    console.log(title, icon, link, order)
    const handleAddLink = (e) => {
        e.preventDefault()
        setLoading(true)
        addDoc(collection(db, 'more-links'), {
            title,
            icon,
            link,
            order,
            show: true
        }).then(() => {
            setTimeout(() => {
                setLoading(false)
                setShowAddModal(false)
                displayAlert(true, 'success', 'Link Added')
                setTitle('')
                setIcon('')
                setLink('')
                setOrder(0)
            }, 1000)
        }).catch(err => {
            console.log(err)
            setLoading(false)
            displayAlert(true, 'error', err.message)
        }).finally(() => {
            setShowAddModal(false)
        })
    }
    return (
        <form className='w-full' onSubmit={handleAddLink}>
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
                onClick={handleAddLink}
                className='w-full'
            />
            <div className="flex justify-center w-full mt-4">
                {loading && <Loading inline />}
            </div>
        </form>
    )
}



export default MoreLinks