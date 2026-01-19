
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LeftSide from "../components/LeftSide";
import RightSide from "../components/RightSide";
import useIsMobile from "../hook/useIsMobile";
import { useMessageStore } from "../store/useMessageStore";


const Home = () => {
  const isMobile = useIsMobile()
  const location = useLocation()
  const { selectedUsers, reset } = useMessageStore()

  const isChatRoute = location.pathname.includes("chat/")

  useEffect(() => {
    if (!isChatRoute) {
      reset()
    }
  }, [location.pathname])


  return (
    <div className="h-full w-full scrollbar overflow-hidden font-bartle ">

      {!isMobile && <div className="griddy scrollbar overflow-hidden mx-auto h-full w-[98vw]">
        {/* left side */}
        <LeftSide />
        {/* right side */}
        <div className={`${isMobile ? "hidden" : "block"}`}>
          <RightSide />
        </div>
      </div>}

      {isMobile && (
        <>
          {!isChatRoute && !selectedUsers && <LeftSide />}
          <Outlet />
        </>
      )

      }
    </div>
  )
}

export default Home
