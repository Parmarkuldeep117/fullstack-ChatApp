const MessageSkeleton = ({ isSender }) => {
    return (
        <div
            className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"
                }`}
        >
            {/* Avatar (receiver only) */}
            {!isSender && (
                <div className="skeleton w-8 h-8 rounded-full" />
            )}

            {/* Message bubble */}
            <div className="flex flex-col gap-2">
                <div
                    className={`skeleton rounded-2xl ${isSender
                            ? "w-48 h-10 rounded-br-none"
                            : "w-40 h-10 rounded-bl-none"
                        }`}
                />
                <div className="skeleton w-20 h-3 opacity-60" />
            </div>

            {/* Avatar (sender only) */}
            {isSender && (
                <div className="skeleton w-8 h-8 rounded-full" />
            )}
        </div>
    );
};

export default MessageSkeleton;
