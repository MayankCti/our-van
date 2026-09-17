import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { pageRoutes } from "../../routes/PageRoutes";
import { authLogin } from "../../redux/actions/authAction";
import { signInSchema } from "../../utils/Schema";
import ErrorMessage from "../../components/form/ErrorMessage";
import Eye from "../../components/form/Eye";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isEye, setIsEye] = useState(false);
    const { isLoading } = useSelector((state) => state?.authReducer || {});

    const initialValues = {
        email: "",
        password: "",
    };

    const handleLogin = (values) => {
        const callback = (response) => {
            if (response?.success) {
                navigate(pageRoutes?.dashboard);
            }
        };

        dispatch(
            authLogin({
                payload: {
                    email: values.email.trim(),
                    password: values.password,
                },
                callback,
            })
        );
    };

    return (
        <section className="ct_login_bg">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        <img src="assets/img/logo.png" alt="Logo" className="ct_login_logo" />
                        <div className="ct_login_card">
                            <h4>Welcome back</h4>
                            <p>Please sign in to catch up on what you've missed</p>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={signInSchema}
                                onSubmit={(values) => {
                                    handleLogin(values);
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="email" className="mb-2">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control ct_input"
                                                placeholder="Enter your email"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                            />
                                            <ErrorMessage
                                                errors={errors}
                                                touched={touched}
                                                fieldName="email"
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="password" className="mb-2">Password</label>
                                            <div className="position-relative">
                                                <input
                                                    type={isEye ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    className="form-control ct_input ct_input_pe_40"
                                                    placeholder="Enter your password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                />
                                                <Eye isEye={isEye} onClick={setIsEye} />
                                            </div>
                                            <ErrorMessage
                                                errors={errors}
                                                touched={touched}
                                                fieldName="password"
                                            />
                                        </div>

                                        <Link to={pageRoutes.fogotPassword} className="ct_fw_600 ct_green_text text-end d-block">
                                            Forgot Password?
                                        </Link>

                                        <div className="mt-4 pt-2">
                                            <button
                                                type="submit"
                                                className="ct_green_btn w-100 border-0"
                                                disabled={isLoading}
                                                style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                                            >
                                                {isLoading ? (
                                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Signing In...
                                                    </span>
                                                ) : (
                                                    "Sign In"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;