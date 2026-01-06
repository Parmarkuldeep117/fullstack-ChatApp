import { Cog, LogOut, Menu, UserRoundPen, X } from "lucide-react";
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useIsMobile from "../hook/useIsMobile";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";

const Navbar = () => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { selectedUsers } = useMessageStore()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const navRef = useRef(null)

  if (isMobile && selectedUsers) return null

  return (
    <header
      className="w-full text-base-content brand-font shadow-md">
      <div className={`max-w-7xl h-15 mx-auto flex items-center justify-end ${isMobile ? "px-1" : "px-5"} py-1`}>

        <NavLink to="/home" className="flex mr-auto items-center ">
          <img
            src="/yap.png"
            alt="Yappy logo"
            className="size-14 object-cover"
          />
          <span
            className="text-xl text-base-content p-1 rounded bg-base-300 brand-font font-bold rounded-r-2xl px-2 pr-3 tracking-wider">YAPPY</span>
        </NavLink>
        <Menu
          onClick={() => {
            navRef.current.style.right = "2px"
          }}
          size={35} className="menu absolute hidden right-2 top-3" />

        <nav
          ref={navRef}
          className="flex gap-2 
          transition-all duration-300
          bg-base-200 pr-2
          ease-in font-Alfa ">
          <NavLink to="/profile"
            className={({ isActive }) => (isActive ? "active" : "passive")}>
            <X
              size={30} color="black"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                navRef.current.style.right = "-300px"
              }}
              className="exit absolute hidden top-2 right-3" />
            <div
              className="gap-1 bg-base-100 text-base-content font-bartle cursor-pointer px-[0.4rem] py-[0.2rem] rounded-xl flex justify-center items-center"><UserRoundPen className="sm:w-5 w-3" /> Profile</div>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "passive")}>
            <div
              className="gap-1 bg-base-100 text-base-content font-bartle cursor-pointer px-[0.4rem] py-[0.2rem] rounded-xl flex justify-center items-center"><Cog className="sm:w-5 w-3" /> Settings</div>
          </NavLink>
          <button
            onClick={handleLogout}
            className='passive'>
            <div className="gap-1 bg-base-100 text-base-content font-bartle cursor-pointer px-[0.4rem] py-[0.2rem] rounded-xl flex justify-center items-center"><LogOut className="sm:w-5 w-3" />Logout</div>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
