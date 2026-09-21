import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { pageRoutes } from "../../routes/PageRoutes";
import { authForgotPassword } from "../../redux/actions/authAction";
import { forgotPasswordSchema } from "../../utils/Schema";
import ErrorMessage from "../../components/form/ErrorMessage";

const FogotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state?.authReducer || {});

    const initialValues = {
        email: "",
    };

    const handleForgotPassword = (values, { resetForm }) => {
        const callback = (response) => {
            if (response?.success || response?.statusCode === 200) {
                resetForm();
            }
        };

        dispatch(
            authForgotPassword({
                payload: {
                    email: values.email.trim(),
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
                        <img src="/assets/img/logo.png" alt="Logo" className="ct_login_logo" />
                        <div className="ct_login_card">
                            <h4>Forgot Password?</h4>
                            <p style={{ maxWidth: "327px" }} className="mx-auto">
                                Don’t worry it happens, please enter the email associated with your account.
                            </p>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={forgotPasswordSchema}
                                onSubmit={handleForgotPassword}
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
                                        <div className="form-group mb-4">
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
                                                        Sending Reset Link...
                                                    </span>
                                                ) : (
                                                    "Send Reset Link"
                                                )}
                                            </button>
                                        </div>
                                        <p className="mb-0 text-center mt-3 fw-semibold">
                                            Already Know Your Password? <Link to={pageRoutes.login} className="ct_green_text">Sign In</Link>
                                        </p>
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

export default FogotPassword;
