import { useEffect, useState } from "react"
const useIsMobile = (breakpoint = 630) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint)

    useEffect(() => {
        const handleSize = () => {
            setIsMobile(window.innerWidth <= breakpoint)
        }

        window.addEventListener("resize", handleSize)
        return () => {
            window.removeEventListener("resize", handleSize)
        }
    }, [breakpoint])

    return isMobile
}

export default useIsMobile
