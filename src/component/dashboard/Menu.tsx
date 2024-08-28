import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Menu: FC = () => {
    const { pathname } = useLocation();

    return (
        <>
            <nav className="side-nav">
                <ul>
                    <li>
                        <Link to="/users" className={`side-menu ${pathname.includes("users") && "side-menu--active"}`}>
                            <div className="side-menu__icon">
                                <FaUser />
                            </div>
                            <div className="side-menu__title"> Users </div>
                        </Link>
                        <Link to="/request/user" className={`side-menu ${pathname.includes("request/user") && "side-menu--active"}`}>
                            <div className="side-menu__icon">
                                <FaUser />
                            </div>
                            <div className="side-menu__title"> Request Users </div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Menu;
