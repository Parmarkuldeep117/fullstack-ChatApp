import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import RightSkeleton from "../components/RightSkeleton";
import useIsMobile from "../hook/useIsMobile";
import { useMessageStore } from "../store/useMessageStore";

const RightSide = () => {
  const { selectedUsers, isMessageLoading } = useMessageStore()
  const isMobile = useIsMobile()

  return (
    <div className={`right ${isMobile && selectedUsers ? "fixed inset-0 z-100" : ""} scrollbar h-full overflow-auto border-base-200`}>
      {!selectedUsers ? <div className="h-full scrollbar overflow-auto"><RightSkeleton /></div> :
        <div className="flex flex-col h-full">
          <ChatHeader />
          <div className="h-[80vh] scrollbar overflow-auto">
            {!isMessageLoading && <ChatMessages />}
          </div>
          <ChatInput />
        </div>
      }
    </div>
  )
}

export default RightSide
