import { Link, useNavigate } from "react-router-dom"
import { pageRoutes } from "../../routes/PageRoutes"

const FogotPassword = () => {
    const navigate = useNavigate()
    return (
        <section class="ct_login_bg">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 mx-auto">
                        <img src="assets/img/logo.png" alt="" class="ct_login_logo" />
                        <div class="ct_login_card">
                            <h4>Forgot Password?</h4>
                            <p style={{ maxWidth: "327px" }} class="mx-auto">Don’t worry it happens, please enter the email associated  with your account.</p>
                            <form action="">
                                <div class="form-group mb-4">
                                    <label for="" class="mb-2">Email</label>
                                    <input type="email" class="form-control ct_input" placeholder="Enter your email" />
                                </div>

                                <div class="mt-4 pt-2">
                                    <button class="ct_green_btn w-100">Send Reset Link</button>
                                </div>
                                <p class="mb-0 text-center mt-3 fw-semibold">Already Know Your Password? <Link to={pageRoutes.login} class="ct_green_text">Sign In</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FogotPassword