import MessageSkeleton from "./MessageSkeleton";

const ChatSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
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
