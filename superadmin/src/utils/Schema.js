import * as Yup from "yup";

// Common Email Validation Rule
const emailValidation = Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter email")
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        "Please enter a valid email"
    );

// Common Password Validation Rule
const passwordValidation = Yup.string()
    .required("Please enter password")
    .min(8, "Password cannot be less than 8 characters")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%&'*+-.,:;<=>?^_`{|}~])/,
        "Strong passwords require at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
    );

// Common File Validation Rule
const fileValidation = Yup.mixed()
    .test("fileType", "Please upload a valid image", (value) => {
        if (!value || typeof value === "string") return true;
        const validFileTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ];
        return validFileTypes.includes(value.type);
    })
    .test("fileSize", "File size must be less than or equal to 10MB", (value) => {
        if (!value || typeof value === "string") return true;
        const maxSizeInBytes = 10 * 1024 * 1024;
        return value.size <= maxSizeInBytes;
    })
    .required("Please upload an image");

// Sign In Schema
export const signInSchema = Yup.object().shape({
    email: emailValidation,
    password: passwordValidation,
});

// Forgot Password Schema
export const forgotPasswordSchema = Yup.object().shape({
    email: emailValidation,
});

// Change Password Schema
export const changePasswordSchema = Yup.object().shape({
    current_password: Yup.string()
        .required("Please enter current password")
        .min(8, "Current password cannot be less than 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%&'*+-.,:;<=>?^_`{|}~])/,
            "Please enter a valid password"
        ),
    new_password: Yup.string()
        .required("Please enter new password")
        .min(8, "New password cannot be less than 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%&'*+-.,:;<=>?^_`{|}~])/,
            "Strong passwords require at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
        ),
    confirm_password: Yup.string()
        .required("Please enter confirm password")
        .oneOf([Yup.ref("new_password"), null], "Your password must match"),
});

// Edit Profile Schema
export const editProfileSchema = Yup.object().shape({
    full_name: Yup.string().trim().required("Please enter full name"),
});

// Component Schema
export const componentSchema = Yup.object().shape({
    name: Yup.string().trim().required("Please enter component name"),
});

// Dealer Schema
export const dealerSchema = Yup.object().shape({
    dealer_name: Yup.string()
        .trim()
        .required("Please enter dealer name")
        .min(2, "Dealer name must be at least 2 characters")
        .max(100, "Dealer name cannot exceed 100 characters"),
    email: emailValidation,
    phone_number: Yup.string()
        .trim()
        .required("Please enter phone number")
        .min(7, "Phone number must be at least 7 digits")
        .max(20, "Phone number cannot exceed 20 characters")
        .matches(/^[+]?[0-9\s-]{7,20}$/, "Please enter a valid phone number"),
});


