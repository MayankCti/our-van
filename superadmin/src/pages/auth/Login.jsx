import { useNavigate } from "react-router-dom"
import { pageRoutes } from "../../routes/PageRoutes"

const Login = () => {
    const navigate = useNavigate()
    return (
        <section class="ct_login_bg">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 mx-auto">
                        <img src="assets/img/logo.png" alt="" class="ct_login_logo" />
                        <div class="ct_login_card">
                            <h4>Welcome back</h4>
                            <p>Please sign in to catch up on what you've missed</p>
                            <form action="">
                                <div class="form-group mb-4">
                                    <label for="" class="mb-2">Email</label>
                                    <input type="email" class="form-control ct_input" placeholder="Enter your email" />
                                </div>
                                <div class="form-group mb-3">
                                    <label for="" class="mb-2">Password</label>
                                    <div class="position-relative">
                                        <input type="password" class="form-control ct_input ct_input_pe_40" placeholder="Enter your password" />
                                        <i class="fa-regular fa-eye-slash ct_show_eye"></i>
                                    </div>
                                </div>
                                <a href="forgot-password.html" class="ct_fw_600 ct_green_text text-end d-block">Forgot Password?</a>
                                <div class="mt-4 pt-2">
                                    <a class="ct_green_btn" onClick={() => navigate(pageRoutes?.dashboard)}>Sign In</a>
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