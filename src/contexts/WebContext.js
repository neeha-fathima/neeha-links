import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/Firebase/index';
import Loading from '@/Utils/Loading';
// create web context
export const WebContext = createContext({});

export const WebProvider = ({ children }) => {
    // Logged In User Creds
    const [user, setUser] = useState(null)
    // Initial Loading State
    const [initializing, setInitializing] = useState(true)
    // App Loading State
    const [loading, setLoading] = useState(false)
    // App Alert
    const [showAlert, setShowAlert] = useState({
        show: false,
        message: '',
        variant: '',
    })
    // Display Alert
    const displayAlert = (show, variant, message) => {
        setShowAlert({
            show,
            message,
            variant,
        })
        setTimeout(() => setShowAlert({
            show: false,
            message: '',
            variant: '',
        }), 2000)
    }

    // Initialize Firebase Auth and check for user
    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) {
            // User Logged In
            setUser(user)
        } else {
            // User Logged Out
            setUser(null)
        }
        setInitializing(false)
    }), [])


    // value useMemo to avoid re-render
    const value = useMemo(() => ({
        signIn: async (email, password) => {
            setLoading(true)
            signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log(user)
                    displayAlert(true, 'success', 'Successfully signed in')
                })
                .catch((err) => {
                    console.log(err)
                    displayAlert(true, 'error', err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        logOut: () => {
            setLoading(true)
            signOut(auth)
                .then(() => {
                    setUser(null)
                    displayAlert(true, 'success', 'Successfully signed out')
                })
                .catch((err) => {
                    console.log(err.message)
                    displayAlert(true, 'error', err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        user,
        loading,
        setLoading,
        displayAlert,
        showAlert,
        setShowAlert,
    }), [loading, user, showAlert])
    // return context
    return (
        <WebContext.Provider value={value}>
            {!initializing ? children : <Loading />}
        </WebContext.Provider>
    )
}

// get context
const useWeb = () => {
    return useContext(WebContext);
}

// export context
export default useWeb;