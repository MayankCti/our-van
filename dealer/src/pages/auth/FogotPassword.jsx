import { Link, useNavigate } from "react-router-dom"
import { pageRoutes } from "../../routes/PageRoutes"

const FogotPassword = () => {
    const navigate = useNavigate()
    return (
        <section className="ct_login_bg">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        <img src="assets/img/logo.png" alt="" className="ct_login_logo" />
                        <div className="ct_login_card">
                            <h4>Forgot Password?</h4>
                            <p style={{ maxWidth: "327px" }} className="mx-auto">Don’t worry it happens, please enter the email associated with your account.</p>
                            <form action="">
                                <div className="form-group mb-4">
                                    <label htmlFor="" className="mb-2">Email</label>
                                    <input type="email" className="form-control ct_input" placeholder="Enter your email" />
                                </div>

                                <div className="mt-4 pt-2">
                                    <button type="button" className="ct_green_btn w-100">Send Reset Link</button>
                                </div>
                                <p className="mb-0 text-center mt-3 fw-semibold">Already Know Your Password? <Link to={pageRoutes.login} className="ct_green_text">Sign In</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FogotPassword
