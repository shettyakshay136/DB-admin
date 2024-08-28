import { Menu, Transition } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiMenu2Fill } from "react-icons/ri";

const Header: FC = () => {
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.removeItem("travel-admin");
        navigate("/login");
    };

    const currentMode = localStorage.getItem("Mode") as string;
    const htmlTag = document.querySelector("html");

    const [mode] = useState(currentMode);

    useEffect(() => {
        if (!mode || mode === null) {
            localStorage.setItem("Mode", "light");
        } else {
            localStorage.setItem("Mode", mode);
        }
        if (htmlTag) {
            htmlTag.className = mode;
        }
    }, [htmlTag, mode]);

    return (
        <>
            <div className="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] -mt-7 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12">
                <div className="h-full flex items-center justify-between">
                    <div className="-intro-x hidden md:flex">
                        {/* <img alt="Rentweet" className="h-8 cursor-pointer" src={Logo}  */}
                        <span className="text-white text-lg ml-3 cursor-pointer" onClick={() => navigate("/users")}>
                            Distance Buddy
                        </span>
                    </div>
                    <div className="text-left flex justify-center items-center">
                        <div className="relative inline-block">
                            <Menu>
                                {({ open }) => (
                                    <>
                                        <span className="rounded-md shadow-sm">
                                            <Menu.Button className="dropdown-toggle w-5 h-5 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110">
                                                <RiMenu2Fill className="w-5 h-5 text-white transform" />
                                            </Menu.Button>
                                        </span>
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items
                                                static
                                                className="notification-content__box dropdown-content absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                                            >
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        <div
                                                            className="bg-gray-100 text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left cursor-pointer"
                                                            onClick={onLogOut}
                                                        >
                                                            Log out
                                                        </div>
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                )}
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
