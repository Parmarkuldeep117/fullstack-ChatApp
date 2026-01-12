const LeftSideSkeleton = () => {
    return (
        <div className="contacts py-2 gap-3 flex flex-col h-[90vh] overflow-y-auto">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex p-2 rounded-2xl gap-5
            bg-gradient-to-br from-base-300 via-base-200 to-base-300"
                >
                    {/* Avatar */}
                    <div className="size-12 rounded-full shimmer shrink-0"></div>

                    {/* Text */}
                    <div className="flex flex-col justify-between gap-2 flex-1">
                        <div className="h-4 w-32 shimmer rounded"></div>
                        <div className="h-3 w-48 shimmer rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LeftSideSkeleton;
