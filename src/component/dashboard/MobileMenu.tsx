import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Logo_Transparent.png";
import { RiMenu2Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

const MobileMenu: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { pathname } = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <div className="mobile-menu md:hidden">
                <div className="mobile-menu-bar">
                    <div className="menu__icon flex mr-auto">
                        <img alt="Rentweet" className="h-8" src={Logo} />
                    </div>
                    <div id="mobile-menu-toggler" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <RiMenu2Fill className="w-5 h-5 text-white" />
                    </div>
                </div>
                <ul className={`border-t border-white/[0.08] py-5  ${isMenuOpen ? "" : "hidden"}`}>
                    <li>
                        <Link to="/users" className={`menu  ${pathname.includes("users") && "side-menu--active"}`}>
                            <div className="menu__icon"><FaUser /></div>
                            <div className="menu__title"> User </div>
                        </Link>
                        <Link to="/request/users" className={`menu  ${pathname.includes("users") && "side-menu--active"}`}>
                            <div className="menu__icon"><FaUser /></div>
                            <div className="menu__title"> Request User </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default MobileMenu;
