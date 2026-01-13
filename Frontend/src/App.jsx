import { Loader } from 'lucide-react';
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { useMessageStore } from './store/useMessageStore';
import { useThemeStore } from './store/useThemeStore';

const App = () => {

  const { checkAuth, authUser, isCheckingAuth, connectSocket, disconnectSocket, socket } = useAuthStore()
  const { listenToMessages, stopListening } = useMessageStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (authUser) {
      connectSocket()
    }

    return () => {
      if (!authUser) {
        disconnectSocket()
      }
    }
  }, [authUser])

  useEffect(() => {
    if (!socket) return
    listenToMessages()
    return () => {
      stopListening()
    }
  }, [socket])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader className="animate-spin size-8" />
      </div>
    )
  }


  return (
    <div
      className='bg-base-200 scrollbar'
      data-theme={theme}>
      <Toaster
        position='top-center'
        reverseOrder={false}
      />
      {authUser && <Navbar />}
      <Outlet />
    </div>
  )
}

export default App
