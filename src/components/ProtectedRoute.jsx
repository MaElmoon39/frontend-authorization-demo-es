import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children, anonymous = false }) {
    const location = useLocation();
    const from = location.state?.from || '/';

    if (anonymous && !isLoggedIn) {
        //Si el usuario no ha iniciado sesión, devuelve un componente (children)
        return <Navigate to={from} replace />
    }

    if (!anonymous && !isLoggedIn) {
        return <Navigate to='/login' state={{ from: location }} />;
    }

    //De otra forma, renderiza el componente hijo de la ruta protegida
    return children;
}

export default ProtectedRoute;