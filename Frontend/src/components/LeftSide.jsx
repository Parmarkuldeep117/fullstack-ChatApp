import { Check, FileText, Image, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftSideSkeleton from "../components/LeftSideSkeleton";
import SearchInput from "../components/SearchInput";
import useIsMobile from "../hook/useIsMobile";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";


const LeftSide = () => {
    const { setUser, users, isUserLoading, getUsers, selectedUsers } = useMessageStore();
    const { authUser, onlineUsers } = useAuthStore();
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    const debounceRef = useRef(null)


    const [query, setQuery] = useState("")
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (authUser) {
            getUsers();
        }
    }, [authUser]);

    const handleSearch = (value) => {
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setQuery(value)
        }, 200);
    }

    const showUsers = (user) => {
        setUser(user);
        if (isMobile) {
            navigate(`/home/chat/${user._id}`)
        }
    };


    const filteredUsers = show ? users?.filter(user => onlineUsers.includes(user._id)) : users.filter(user => user.fullName.toLowerCase().includes(query.toLowerCase()))
    return (
        <div className={`left scrollbar transition-transform duration-400 ${isMobile && selectedUsers ? "-translate-x-full" : "translate-x-0"} px-1`}>
            <div
                className="px-1 py-1 flex items-center relative bg-base-100 rounded-2xl tracking-wider my-2">
                <SearchInput value={query} onChange={handleSearch} />
            </div>

            <label
                onClick={() => setShow(prev => !prev)}
                className="flex mb-4 justify-between mt-3 px-3 items-center cursor-pointer select-none"
            >
                <span className="text-[0.7rem]">
                    Show online users{" "}
                    <span className="text-green-500">
                        (online {onlineUsers.length})
                    </span>
                </span>

                <div
                    className={`
      w-9 h-5 rounded-full relative transition-colors duration-200 ease-out
      ${show ? "bg-green-500" : "bg-gray-400"}
    `}
                >
                    <div
                        className={`
        absolute top-[2px] left-[2px]
        w-4 h-4 bg-white rounded-full shadow-sm
        transition-transform duration-300
        ${show ? "translate-x-4" : ""}
      `}
                    />
                </div>
            </label>


            <div className="contacts py-2 gap-1 flex flex-col overflow-y-auto scrollbar h-[90vh]">
                {isUserLoading && <LeftSideSkeleton />}

                {
                    show && filteredUsers.length === 0 && (
                        <div className="p-4">No online users</div>
                    )
                }
                {filteredUsers?.map(user => {
                    const isOnline = onlineUsers.includes(user._id);

                    return (
                        <div
                            key={user._id}
                            onClick={() => showUsers(user)}
                            className="flex p-2 relative cursor-pointer gap-3
                            active:bg-base-100 hover:bg-base-300"
                        >

                            <div className="rounded-[50%] overflow-hidden shrink-0">
                                <img
                                    className="size-12  object-cover"
                                    src={user?.profilepic || "/default.jpg"}
                                    alt="profilepic"
                                />
                            </div>
                            {isOnline && <div className="size-3  absolute left-12 top-10  rounded-[50%] bg-green-500 border-2 border-base-100"></div>}

                            <div className="user flex flex-col justify-between">
                                <h2>
                                    {user.fullName.charAt(0).toUpperCase() +
                                        user.fullName.slice(1)}
                                </h2>
                                <div className="text-[0.7rem] flex justify-items-start items-center gap-1 font-bold opacity-70 truncate max-w-[190px]">
                                    <div>
                                        {authUser._id === user.lastMessage?.senderId && user.lastMessage?.status === "read" && <svg
                                            className="text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                        </svg>}
                                        {authUser._id === user.lastMessage?.senderId && user.lastMessage?.status === "delivered" && <svg
                                            className="text-base-content"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                        </svg>}
                                        {authUser._id === user.lastMessage?.senderId && user.lastMessage?.status === "sent" && <svg
                                            className="text-base-content "
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 14L8.5 17.5L19 6.5" />
                                        </svg>}
                                    </div>
                                    <div>
                                        {
                                            user?.lastMessage?.text
                                                ? user.lastMessage.senderId === authUser._id
                                                    ? <div>you: {user.lastMessage.text}</div>
                                                    : <div>{user.lastMessage.text}</div>

                                                : user.lastMessage?.media.type === "image"
                                                    ? user.lastMessage.senderId === authUser._id
                                                        ? (
                                                            <div className="flex items-center gap-1">
                                                                you: <Image height={10} width={12} /> <span>Image</span>
                                                            </div>
                                                        )
                                                        : (
                                                            <div className="flex items-center gap-1">
                                                                <Image height={11} width={12} /> <span>Image</span>
                                                            </div>
                                                        )

                                                    : user.lastMessage?.media.type === "video"
                                                        ? user.lastMessage.senderId === authUser._id
                                                            ? (
                                                                <div className="flex items-center gap-1">
                                                                    you: <Video height={18} width={12} /> <span>Video</span>
                                                                </div>
                                                            )
                                                            : (
                                                                <div className="flex items-center gap-1">
                                                                    <Video height={18} width={12} /> <span>Video</span>
                                                                </div>
                                                            )

                                                        : user.lastMessage?.media.type === "pdf"
                                                            ? user.lastMessage.senderId === authUser._id
                                                                ? (
                                                                    <div className="flex items-center gap-1">
                                                                        you: <FileText height={18} width={12} /> <span>PDF</span>
                                                                    </div>
                                                                )
                                                                : (
                                                                    <div className="flex items-center gap-1">
                                                                        <FileText height={18} width={12} /> <span>PDF</span>
                                                                    </div>
                                                                )

                                                            : ""
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeftSide;
