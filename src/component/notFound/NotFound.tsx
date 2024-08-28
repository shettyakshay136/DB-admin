import { useNavigate } from "react-router";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    };

    return (
        <div className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
            <div className="text-white mt-10 lg:mt-0">
                <div className="intro-x text-8xl font-medium">404</div>
                <div className="intro-x text-xl lg:text-3xl font-medium mt-5">Oops. The page you are visit is not found.</div>
                <div className="intro-x text-lg mt-3">You may have mistyped the address or the page may have moved.</div>
                <button
                    className="intro-x btn py-3 px-4 text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10"
                    onClick={goToHome}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
