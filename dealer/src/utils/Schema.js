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
        .min(10, "Mobile number must be at least 10 digits")
        .max(20, "Mobile number cannot exceed 20 characters")
        .matches(/^[+]?[0-9\s-]{10,20}$/, "Please enter a valid mobile number"),
});

// Step 3: Single Component Validation Schema
export const step3ComponentItemSchema = Yup.object().shape({
    manufacturer: Yup.string()
        .trim()
        .required("Please enter manufacturer name")
        .min(2, "Manufacturer name must be at least 2 characters")
        .max(100, "Manufacturer name cannot exceed 100 characters"),
    installation_date: Yup.string()
        .required("Please select installation date")
        .test("not-future", "Installation date cannot be in the future", function (val) {
            if (!val) return true;
            const selected = new Date(val);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return selected <= today;
        }),
    warranty_period_months: Yup.number()
        .required("Please select warranty period")
        .positive("Warranty period must be greater than 0"),
    replacement_schedule: Yup.string()
        .nullable()
        .test("valid-replacement", "Replacement schedule date must be after installation date", function (val) {
            const { installation_date } = this.parent;
            if (!val) return true;
            const repDate = new Date(val);
            if (installation_date) {
                return repDate >= new Date(installation_date);
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return repDate >= today;
        }),
    maintenance_notes: Yup.string()
        .max(500, "Maintenance notes cannot exceed 500 characters")
        .nullable(),
    file: Yup.mixed()
        .test("required-file", "Please upload component image or manual", function (value) {
            const { existing_file_url, file_name } = this.parent;
            return Boolean(value || existing_file_url || file_name);
        }),
});

// Step 4: Warranty Details Schema
export const step4WarrantySchema = Yup.object().shape({
    provider: Yup.string()
        .trim()
        .required("Please enter warranty provider name")
        .min(2, "Warranty provider must be at least 2 characters")
        .max(100, "Warranty provider cannot exceed 100 characters"),
    coverage_type: Yup.string()
        .trim()
        .required("Please select coverage type"),
    start_date: Yup.string()
        .required("Please select start date"),
    expiry_date: Yup.string()
        .required("Please select expiry date")
        .test("is-after-start", "Expiry date must be after start date", function (val) {
            const { start_date } = this.parent;
            if (!val || !start_date) return true;
            return new Date(val) > new Date(start_date);
        }),
    claim_instructions: Yup.string()
        .max(1000, "Claim instructions cannot exceed 1000 characters")
        .nullable(),
    claim_email: emailValidation,
    claim_phone: Yup.string()
        .trim()
        .required("Please enter claim phone number")
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number cannot exceed 20 characters")
        .matches(/^[+]?[0-9\s-]{10,20}$/, "Please enter a valid phone number"),
    warranty_document: Yup.mixed().nullable(),
});

// Step 6: Maintenance Setup Schema
export const step6MaintenanceSchema = Yup.object().shape({
    first_service_date: Yup.string()
        .required("Please select first service date"),
    assigned_service_centre: Yup.string()
        .trim()
        .max(150, "Service centre cannot exceed 150 characters")
        .nullable(),
    notes: Yup.string()
        .max(500, "Notes cannot exceed 500 characters")
        .nullable(),
    reminder_before_days: Yup.number()
        .required("Please select reminder days")
        .positive("Reminder days must be greater than 0"),
    notify_push: Yup.mixed(),
    notify_email: Yup.mixed(),
});




