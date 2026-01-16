import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useIsMobile from "../hook/useIsMobile"
import { useMessageStore } from "../store/useMessageStore"
import RightSide from "./RightSide"

const ChatPage = () => {

    const { setUserById, getMessages, selectedUsers } = useMessageStore()
    const { userId } = useParams()
    const isMobile = useIsMobile()
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedUsers?._id) {
            getMessages(selectedUsers._id)
        }
    }, [selectedUsers?._id, getMessages])

    
    useEffect(() => {
        if (userId) {
            setUserById(userId)
        }
    }, [userId])


    useEffect(() => {
        if (!isMobile) {
            navigate("/home")
        }
    }, [isMobile])

    return (
        <div className="mx-auto w-[100dvw]">
            <RightSide />
        </div>

    )
}

export default ChatPage
