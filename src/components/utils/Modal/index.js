import React from 'react'
import { FiXCircle } from 'react-icons/fi'

const Modal = ({ title, children, setShow }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen backdrop-blur bg-transparent flex justify-center items-center">
            <div className="w-[340px] bg-white rounded shadow p-4">
                <div className="flex justify-between mb-4">
                    <p className='normal-case text-content-l font-medium'>
                        {title}
                    </p>
                    <div className="flex items-center">
                        <FiXCircle size={20} className='cursor-pointer' onClick={() => setShow(false)} />
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal