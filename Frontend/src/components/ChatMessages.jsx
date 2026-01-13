import { File, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hook/useIsMobile";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import ImagePreview from "./ImagePreview";

const ChatMessages = () => {
    const { authUser, socket } = useAuthStore();
    const { messages, selectedUsers } = useMessageStore();
    const [previewImage, setPreviewImage] = useState(null);
    const bottomRef = useRef(null)
    const isMobile = useIsMobile()

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, [selectedUsers, messages])


    useEffect(() => {
        if (!socket || !selectedUsers._id || !messages?.length) return

        socket?.emit("mark-read", {
            senderId: selectedUsers._id
        })
    }, [selectedUsers?._id, messages.length])


    useEffect(() => {

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setPreviewImage(null)
            }
        }

        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [])

    useEffect(() => {
        document.body.style.overflow = previewImage ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [previewImage]);


    if (!messages || messages.length === 0) {
        return (
            <div className={`p-4 h-full flex flex-col leading-8 justify-center ${isMobile && "bg-base-200"} place-items-center text-sm opacity-60`}>
                <h1 className="tracking-wide">No messages yet</h1>
                <h1 className="text-center tracking-widest text-2xl">Start the Yapping 👻</h1>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isMobile && "bg-base-200"} gap-4 p-4`}>
            <ImagePreview
                src={previewImage}
                onClose={() => setPreviewImage(null)}
            />

            {messages.map((msg) => {
                if (!msg) return null;

                const isMe = msg.senderId === authUser._id;

                const avatar = isMe
                    ? authUser.profilepic || "/default.jpg"
                    : selectedUsers?.profilepic || "/default.jpg";

                const time = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "";

                return (
                    <div
                        key={msg._id}
                        className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                            }`}
                    >

                        {!isMe && (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        )}

                        <div
                            className={`max-w-[80%] p-2 rounded-xl text-sm break-words
                ${isMe
                                    ? "bg-primary text-primary-content rounded-br-none"
                                    : "bg-base-300 rounded-bl-none"
                                }
              `}
                        >
                            {msg.text && <p>{msg.text}</p>}

                            {msg?.media?.type === "image" ? (
                                <img
                                    src={msg.media?.url}
                                    alt="sent"
                                    onClick={() => setPreviewImage(msg?.media.url)}
                                    className="mt-2 max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition"
                                />
                            ) : ""
                            }
                            {
                                msg?.media?.type === "video" ? (
                                    <div className="flex relative justify-center items-center">
                                        <video
                                            muted
                                            preload="metadata"
                                            className="mt-2 max-h-45 max-w-50 rounded-lg cursor-pointer hover:opacity-90 transition"
                                            src={msg.media.url} />

                                        <button
                                            onClick={() => { setPreviewImage(msg.media.url) }}
                                            className="absolute"
                                        >
                                            <Play fill="#111" stroke="#111" size={50} className={`p-2 rounded-3xl cursor-pointer hover:bg-gray-500  `} />
                                        </button>
                                    </div>
                                ) : ""
                            }



                            {/* Time */}
                            {time && (
                                <div className={`mt-1 text-[0.6rem] flex gap-1 opacity-60 justify-end`}>
                                    {
                                        msg?.media?.type === "pdf" ? (
                                            <div
                                                className="flex flex-col max-w-50"
                                            >
                                                <div
                                                    className="mt-2 border p-2 flex flex-col gap-1 rounded-lg cursor-pointer hover:opacity-90 border-b-2 transition"
                                                >
                                                    <span className="flex items-center text-sm justify-center"> <File className="fill-gray-500 shrink-0" size={18} /> {msg?.media?.filename || "PDF file"}</span>
                                                    <span
                                                        className="flex justify-between"
                                                    ><h2>{(msg?.media?.size / 1024).toFixed() + " " + "KB"}</h2>
                                                        <h3>{time}</h3>
                                                    </span>
                                                </div>
                                                <div className="flex justify-center relative items-center mt-1">

                                                    <span className="text-[1rem] font-bold hover:shadow-xl"><a
                                                        href={msg?.media.url}
                                                        download={msg.media?.filename}
                                                    >
                                                        Download
                                                    </a></span>
                                                    <div
                                                        className="absolute right-0 bottom-0"
                                                    >{msg.senderId === authUser._id && msg.status === "sent" && <svg
                                                        className="text-base-content opacity-60"
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 14L8.5 17.5L19 6.5" />
                                                    </svg>}
                                                        {msg.senderId === authUser._id && msg.status === "delivered" && <svg
                                                            className="text-base-content"
                                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                                        </svg>}
                                                        {msg.senderId.toString() === authUser._id && msg.status === "read" && <svg
                                                            className="text-blue-500"
                                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                                        </svg>}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : ""
                                    }
                                    {msg?.media?.type !== "pdf" && time}
                                    <span>{msg?.media?.type !== "pdf" && msg.senderId === authUser._id && msg.status === "sent" && <svg
                                        className="text-primary-content opacity-60"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 14L8.5 17.5L19 6.5" />
                                    </svg>}
                                        {msg?.media?.type !== "pdf" && msg.senderId === authUser._id && msg.status === "delivered" && <svg
                                            className="text-primary-content"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                        </svg>}
                                        {msg?.media?.type !== "pdf" && msg.senderId === authUser._id && msg.status === "read" && <svg
                                            className="text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517" />
                                            <path d="M7.5 13.8333L11 17.5L21.5 6.5" />
                                        </svg>}
                                    </span>
                                </div>
                            )
                            }
                        </div>

                        {/* Sender Avatar */}
                        {isMe && (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        )
                        }
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages;
