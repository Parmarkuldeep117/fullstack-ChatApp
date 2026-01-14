import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import ChatSkeleton from '../components/ChatSkeleton';
import RightSkeleton from "../components/RightSkeleton";
import useIsMobile from "../hook/useIsMobile";
import { useMessageStore } from "../store/useMessageStore";

const RightSide = () => {
  const { selectedUsers, isMessageLoading } = useMessageStore()
  const isMobile = useIsMobile()

  if (isMessageLoading) {
    return (
      <div className={`flex-1 ${isMobile && "bg-base-200 h-[100dvh]"} p-4`}>
        <ChatSkeleton />
      </div>
    );
  }

  return (
    <div className={`right ${isMobile && selectedUsers ? "fixed inset-0 z-100 bg-base-200" : ""} scrollbar h-full overflow-auto border-base-200`}>
      {!selectedUsers ? <div className="h-full scrollbar overflow-auto"><RightSkeleton /></div> :
        <div className="flex flex-col h-full">
          <ChatHeader />
          <div className="h-[80vh] scrollbar overflow-auto">
            <ChatMessages />
          </div>
          <ChatInput />
        </div>
      }
    </div>
  )
}

export default RightSide
