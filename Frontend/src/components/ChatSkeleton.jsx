import MessageSkeleton from "./MessageSkeleton";

const ChatSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
      <MessageSkeleton isSender={true} />
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
    </div>
  );
};

export default ChatSkeleton;
