import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { auth, db } from "../firebaseConfig";
import { emailValidation } from "../helper/validation";
import { setLocalStorage } from "../utils";
import { LoginInterface, UserResponseErrorInterface } from "./types";

const initialValues: LoginInterface = {
    email: "",
    password: "",
};

export const loginValidation = object({
    email: emailValidation.required("Please enter email"),
    password: string().min(5, `Password length must be minimum 5 character`).required("Please enter password"),
});

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (value: LoginInterface) => {
        try {
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(auth, value.email, value.password);
            const user = userCredential.user as any;

            const adminDocRef = doc(db, "admin", user.uid);
            const adminDoc = await getDoc(adminDocRef);
            console.table({ admin: await adminDoc.data(), user });
            if (!adminDoc.exists()) {
                await auth.signOut();
            } else {
                try {
                    const admin = await adminDoc.data();
                    setLocalStorage("travel-admin", { admin: { ...admin, uid: user.uid }, token: user.accessToken });
                } catch (e) {
                    console.log(e);
                }
                navigate("/users");
            }
        } catch (error) {
            const typeSafeError = error as UserResponseErrorInterface;
            const message = typeSafeError.code.split("/")[1];
            toast.error(message);
        } finally {
            setLoading(false);
            navigate("/users");
        }
    };

    useEffect(() => {
        document.body.classList.add("login");
    }, []);

    return (
        <div>
            <div className="container sm:px-10">
                <div className="lg:grid grid-cols-2 gap-4 h-screen content-vh-center">
                    <div className="hidden lg:flex flex-col min-h-screen">
                        <div className="my-auto w-full xl:max-w-1/2">
                            <div className="-intro-x text-white font-medium text-3xl leading-tight mt-10">Distance Buddy</div>
                            <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">Admin Panel</div>
                        </div>
                    </div>
                    <div className="lg:h-screen flex items-center justify-center py-5 lg:py-0 mt-0 lg:my-auto">
                        <div className="my-auto mx-auto lg:ml-20 bg-white dark:bg-darkmode-600 lg:bg-transparent px-5 sm:px-8 py-8 lg:p-0 rounded-md shadow-md lg:!shadow-none w-full sm:w-3/4 lg:w-3/4 xl:w-auto login-logo-section">
                            <h2 className="lg:intro-x font-bold text-2xl lg:text-3xl text-center lg:text-left">Welcome</h2>
                            <div className="lg:intro-x mt-8">
                                <Formik initialValues={initialValues} validationSchema={loginValidation} onSubmit={onSubmit}>
                                    {({ values, handleChange, errors, handleBlur, touched }) => (
                                        <Form>
                                            <input
                                                name="email"
                                                type="text"
                                                className="lg:intro-x login__input form-control py-3 px-4 block undefined"
                                                placeholder="Enter email"
                                                defaultValue=""
                                                autoFocus
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.email && touched.email && (
                                                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400 italic">
                                                    {errors.email}
                                                </p>
                                            )}

                                            <input
                                                name="password"
                                                type="password"
                                                className="lg:intro-x login__input form-control py-3 px-4 block mt-4 undefined"
                                                placeholder="Enter password"
                                                defaultValue=""
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.email && touched.email && (
                                                <p id="standard_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400 italic">
                                                    {errors.email}
                                                </p>
                                            )}

                                            <div className="lg:intro-x text-center xl:text-left mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top dark:text-[#1B253B]"
                                                >
                                                    {loading ? (
                                                        <LoaderIcon style={{ height: "17px", width: "17px", margin: "auto" }} />
                                                    ) : (
                                                        "Login"
                                                    )}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
