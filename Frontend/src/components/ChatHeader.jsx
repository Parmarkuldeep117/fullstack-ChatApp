import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useIsMobile from "../hook/useIsMobile"
import { useAuthStore } from "../store/useAuthStore"
import { useMessageStore } from "../store/useMessageStore"
import ImagePreview from "./ImagePreview"

const ChatHeader = () => {
    const [preview, setPreview] = useState(null)
    const { selectedUsers, reset } = useMessageStore()
    const { fullName, profilepic } = selectedUsers
    const isMobile = useIsMobile()
    const navigate = useNavigate()
    const { onlineUsers } = useAuthStore()

    useEffect(() => {
        document.body.style.overflow = preview ? "hidden" : "auto"

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [preview])

    useEffect(() => {
        const handleIt = (e) => {
            if (e.key === "Escape") {
                setPreview(null)
            }
        }
        window.addEventListener("keydown", handleIt)

        return () => {
            window.removeEventListener("keydown", handleIt)
        }
    }, [])

    const changeState = () => {
        reset()
        navigate("/home")
    }

    const status = onlineUsers.includes(selectedUsers._id)

    return (
        <>
            <div className={`px-2 rounded-2xl py-2 bg-base-100 font-semibold ${isMobile ? "px-4" : "px-0"} flex gap-3 my-2 items-center text-xl`}>
                {preview && <ImagePreview src={profilepic} onClose={() => { setPreview(null) }} />}
                {isMobile && <ArrowLeft onClick={() => { changeState() }} />}
                <img
                    onClick={() => { setPreview(profilepic) }}
                    className={`${isMobile ? "size-11" : "size-8"} cursor-pointer object-cover rounded-[50%]`} src={profilepic || "/default.jpg"} alt="profilepic" />
                <div className="flex flex-col">
                    <h2>{fullName.charAt(0).toUpperCase() + fullName.slice(1)}</h2>
                    <h2>{status && <h4 className="text-[0.6rem] transition-all duration-1000 ease-in text-green-500">Online</h4>}</h2>
                </div>
            </div>
        </>
    )
}

export default ChatHeader
