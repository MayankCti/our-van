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

// Edit Profile Schema for Supplier
export const editProfileSchema = Yup.object().shape({
    full_name: Yup.string().trim().required("Please enter full name"),
    company_name: Yup.string().trim().required("Please enter company name"),
    phone_number: Yup.string()
        .trim()
        .nullable()
        .test("min-digits", "Phone number must be at least 10 digits", (value) => {
            if (!value) return true;
            return value.length >= 10;
        })
        .test("max-digits", "Phone number cannot exceed 20 characters", (value) => {
            if (!value) return true;
            return value.length <= 20;
        })
        .test("valid-phone", "Please enter a valid phone number", (value) => {
            if (!value) return true;
            return /^[+]?[0-9\s-]{10,20}$/.test(value);
        }),
    city: Yup.string().trim().nullable(),
    abn: Yup.string().trim().nullable(),
    accounting_software_used: Yup.string().trim().nullable(),
    service_region: Yup.string().trim().nullable(),
    services_offered: Yup.string().trim().nullable(),
    company_description: Yup.string().trim().nullable(),
    about_us: Yup.string().trim().nullable(),
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
