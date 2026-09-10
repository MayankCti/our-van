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

// Step 1: Vehicle Information Schema
export const step1VehicleInfoSchema = Yup.object().shape({
    van_name: Yup.string()
        .trim()
        .required("Please enter van name")
        .min(2, "Van name must be at least 2 characters")
        .max(100, "Van name cannot exceed 100 characters"),
    vin: Yup.string()
        .trim()
        .required("Please enter VIN number")
        .length(17, "VIN number must be exactly 17 characters")
        .matches(/^[a-zA-Z0-9]{17}$/, "VIN must be 17 alphanumeric characters"),
    make: Yup.string()
        .trim()
        .required("Please enter make")
        .min(2, "Make must be at least 2 characters")
        .max(50, "Make cannot exceed 50 characters"),
    model: Yup.string()
        .trim()
        .required("Please enter model")
        .min(2, "Model must be at least 2 characters")
        .max(50, "Model cannot exceed 50 characters"),
    manufacture_year: Yup.string()
        .trim()
        .required("Please enter manufacture year")
        .matches(/^(19|20)\d{2}$/, "Please enter a valid 4-digit year (e.g. 2024)")
        .test("valid-year", "Manufacture year cannot be in the future", (val) => {
            if (!val) return true;
            const year = parseInt(val, 10);
            return year >= 1900 && year <= new Date().getFullYear() + 1;
        }),
    registration_number: Yup.string()
        .trim()
        .required("Please enter registration number")
        .min(3, "Registration number must be at least 3 characters")
        .max(20, "Registration number cannot exceed 20 characters")
        .matches(/^[a-zA-Z0-9\s-]+$/, "Registration number can only contain letters, numbers, spaces, and hyphens"),
    engine: Yup.string()
        .trim()
        .required("Please enter engine details")
        .min(2, "Engine details must be at least 2 characters")
        .max(200, "Engine details cannot exceed 200 characters"),
    chassis_number: Yup.string()
        .trim()
        .required("Please enter chassis number")
        .min(6, "Chassis number must be at least 6 characters")
        .max(30, "Chassis number cannot exceed 30 characters")
        .matches(/^[a-zA-Z0-9-]+$/, "Chassis number can only contain letters, numbers, and hyphens"),
    color: Yup.string()
        .trim()
        .required("Please enter vehicle color")
        .min(2, "Vehicle color must be at least 2 characters")
        .max(50, "Color cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s-]+$/, "Vehicle color can only contain letters, spaces, and hyphens"),
    van_id: Yup.mixed().nullable(),
    vehicle_photos: Yup.mixed()
        .test("required", "At least one vehicle photo is required", function (value) {
            if (!value) return false;
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            if (typeof value === "object" && typeof value.length === "number") {
                return value.length > 0;
            }
            return Boolean(value);
        }),
});

// Step 2: Owner Details Schema
export const step2OwnerDetailsSchema = Yup.object().shape({
    owner_name: Yup.string()
        .trim()
        .required("Please enter full name")
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters"),
    email: emailValidation,
    phone_number: Yup.string()
        .trim()
        .required("Please enter mobile number")
        .min(7, "Mobile number must be at least 7 digits")
        .max(20, "Mobile number cannot exceed 20 characters")
        .matches(/^[+]?[0-9\s-]{7,20}$/, "Please enter a valid mobile number"),
});
