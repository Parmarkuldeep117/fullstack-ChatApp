import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = ({ children }) => {
    const { authUser, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return null;

    if (authUser) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;
