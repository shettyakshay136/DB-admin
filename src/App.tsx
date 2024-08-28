import Routes from "./routes/Routes";
import { Toaster } from "react-hot-toast";
import "./assets/css/_tailwind.css";
import "./assets/css/app.css";
import "react-tooltip/dist/react-tooltip.css";

import "./assets/css/Index.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastDuration } from "./helper/constant";

const App = () => {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: ToastDuration }} />
            <Routes />
        </>
    );
};

export default App;
