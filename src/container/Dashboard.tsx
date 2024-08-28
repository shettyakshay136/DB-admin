import { useEffect, FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/dashboard/Header";
import Menu from "../component/dashboard/Menu";
import MobileMenu from "../component/dashboard/MobileMenu";

const Dashboard: FC = () => {
    useEffect(() => {
        document.body.className = "main";
        return () => {
            document.body.className = "";
        };
    }, []);

    return (
        <div className="main-dashboard-container">
            <MobileMenu />
            <Header />
            <div className="wrapper">
                <div className="wrapper-box">
                    <Menu />
                    <div className="content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
