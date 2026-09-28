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

// Edit Profile Schema
export const editProfileSchema = Yup.object().shape({
    full_name: Yup.string().trim().required("Please enter full name"),
    phone_number: optionalPhoneValidationRule("phone number"),
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
