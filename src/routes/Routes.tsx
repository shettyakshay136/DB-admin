import { BrowserRouter, Navigate, Outlet, Routes as ReactRouter, Route } from "react-router-dom";
import NotFoundPage from "../component/notFound/NotFound";
import Dashboard from "../container/Dashboard";
import Login from "../container/Login";
import RequestUsers from "../pages/requestUser";
import Trips from "../pages/trips";
import Users from "../pages/users";
import { getLocalStorage } from "../utils";

export const ProtectedRoutes = () => {
    const storedValues = getLocalStorage("travel-admin");
    // if (!storedValues) {
    //     setLocalStorage("travel-admin", localStorageValue);
    // }
    return <>{storedValues.token ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

const Routes = () => {
    return (
        <BrowserRouter>
            <ReactRouter>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="" element={<Navigate to={"/users"} />} />
                    <Route path="" element={<Dashboard />}>
                        <Route path="users" element={<Users />} />
                        <Route path="/users/trips/:uid" element={<Trips />} />
                        <Route path="/request/user" element={<RequestUsers />} />
                    </Route>
                </Route>
            </ReactRouter>
        </BrowserRouter>
    );
};
export default Routes;
