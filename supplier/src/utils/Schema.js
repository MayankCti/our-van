import * as Yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";

// Reusable Country-Code Aware Phone Validator
export const validatePhoneNumberByCountry = (value, defaultCountry = 'AU') => {
    if (!value || !String(value).trim()) return false;
    const str = String(value).trim();
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length < 6) return false;

    try {
        if (str.startsWith('+')) {
            return isValidPhoneNumber(str);
        }
        if (isValidPhoneNumber('+' + str)) return true;
        return isValidPhoneNumber(str, defaultCountry);
    } catch {
        return digitsOnly.length >= 7 && digitsOnly.length <= 16;
    }
};

export const phoneValidationRule = (fieldLabel = 'phone number') =>
    Yup.string()
        .trim()
        .required(`Please enter ${fieldLabel}`)
        .test('is-valid-phone', `Please enter a valid ${fieldLabel}`, (value) => {
            return validatePhoneNumberByCountry(value);
        });

export const optionalPhoneValidationRule = (fieldLabel = 'phone number') =>
    Yup.string()
        .trim()
        .nullable()
        .test('is-valid-phone', `Please enter a valid ${fieldLabel}`, (value) => {
            if (!value || !String(value).trim()) return true;
            return validatePhoneNumberByCountry(value);
        });

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
    phone_number: optionalPhoneValidationRule("phone number"),
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
