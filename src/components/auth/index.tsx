import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import { Button, Result } from 'antd';

interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    }

    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Sorry, you have to login to access this page."
                extra={<Button type="primary"><Link to={"/login"}>Login here</Link></Button>}
            />
        )
    }


    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button onClick={handleClick} type="primary">Back Home</Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    );
}

export default ProtectedRoute;