import { Link, useNavigate } from "react-router-dom"
import { pageRoutes } from "../../routes/PageRoutes"

const Login = () => {
    const navigate = useNavigate()
    return (
        <section className="ct_login_bg">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        <img src="assets/img/logo.png" alt="" className="ct_login_logo" />
                        <div className="ct_login_card">
                            <h4>Welcome back</h4>
                            <p>Please sign in to catch up on what you've missed</p>
                            <form action="">
                                <div className="form-group mb-4">
                                    <label htmlFor="" className="mb-2">Email</label>
                                    <input type="email" className="form-control ct_input" placeholder="Enter your email" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="" className="mb-2">Password</label>
                                    <div className="position-relative">
                                        <input type="password" className="form-control ct_input ct_input_pe_40" placeholder="Enter your password" />
                                        <i className="fa-regular fa-eye-slash ct_show_eye"></i>
                                    </div>
                                </div>
                                <Link to={pageRoutes.fogotPassword} className="ct_fw_600 ct_green_text text-end d-block">Forgot Password?</Link>
                                <div className="mt-4 pt-2">
                                    <a className="ct_green_btn" onClick={() => navigate(pageRoutes?.dashboard)}>Sign In</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
