import * as Yup from "yup";

// Common Email Validation Rule
export const emailValidation = Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter email")
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        "Please enter a valid email"
    );

// Common Password Validation Rule
export const passwordValidation = Yup.string()
    .required("Please enter password")
    .min(6, "Password cannot be less than 6 characters");

// Sign In Schema
export const signInSchema = Yup.object().shape({
    email: emailValidation,
    password: passwordValidation,
});

// Forgot Password Schema
export const forgotPasswordSchema = Yup.object().shape({
    email: emailValidation,
});

// Edit Profile Schema
export const editProfileSchema = Yup.object().shape({
    full_name: Yup.string().trim().required("Please enter full name"),
    phone_number: Yup.string().trim().nullable(),
});

// Change Password Schema
export const changePasswordSchema = Yup.object().shape({
    current_password: Yup.string()
        .required("Please enter current password")
        .min(6, "Current password cannot be less than 6 characters"),
    new_password: Yup.string()
        .required("Please enter new password")
        .min(6, "New password cannot be less than 6 characters"),
    confirm_password: Yup.string()
        .required("Please enter confirm password")
        .oneOf([Yup.ref("new_password"), null], "Your password must match"),
});
