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
    phone_number: phoneValidationRule("mobile number"),
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
    claim_phone: phoneValidationRule("claim phone number"),
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

// Parts Management - Add Part Schema
export const addPartSchema = Yup.object().shape({
    part_name: Yup.string()
        .trim()
        .required("Please enter part name")
        .min(2, "Part name must be at least 2 characters")
        .max(100, "Part name cannot exceed 100 characters"),
    manufacturer: Yup.string()
        .trim()
        .required("Please enter manufacturer name")
        .min(2, "Manufacturer name must be at least 2 characters")
        .max(100, "Manufacturer name cannot exceed 100 characters"),
    original_cost: Yup.number()
        .typeError("Original cost must be a valid number")
        .required("Please enter original cost")
        .min(0, "Original cost cannot be negative"),
    service_cost: Yup.number()
        .typeError("Service cost must be a valid number")
        .required("Please enter service cost")
        .min(0, "Service cost cannot be negative")
        .test(
            "greater-than-original",
            "Service cost must be greater than original cost",
            function (val) {
                const { original_cost } = this.parent;
                if (val === undefined || val === null || isNaN(val) || original_cost === undefined || original_cost === null || isNaN(original_cost)) {
                    return true;
                }
                return Number(val) > Number(original_cost);
            }
        ),
    stock_quantity: Yup.number()
        .typeError("Stock quantity must be a valid number")
        .required("Please enter stock quantity")
        .integer("Stock quantity must be a whole number")
        .min(0, "Stock quantity cannot be negative"),
    low_stock_threshold: Yup.number()
        .typeError("Low stock threshold must be a valid number")
        .required("Please enter low stock threshold")
        .integer("Low stock threshold must be a whole number")
        .min(0, "Low stock threshold cannot be negative")
        .test(
            "less-than-stock",
            "Low stock alert threshold must be less than stock quantity",
            function (val) {
                const { stock_quantity } = this.parent;
                if (val === undefined || val === null || isNaN(val) || stock_quantity === undefined || stock_quantity === null || isNaN(stock_quantity)) {
                    return true;
                }
                return Number(val) < Number(stock_quantity);
            }
        ),
});

// Parts Management - Edit Part Schema (Threshold is not restricted to less than stock_quantity)
export const editPartSchema = Yup.object().shape({
    part_name: Yup.string()
        .trim()
        .required("Please enter part name")
        .min(2, "Part name must be at least 2 characters")
        .max(100, "Part name cannot exceed 100 characters"),
    manufacturer: Yup.string()
        .trim()
        .required("Please enter manufacturer name")
        .min(2, "Manufacturer name must be at least 2 characters")
        .max(100, "Manufacturer name cannot exceed 100 characters"),
    original_cost: Yup.number()
        .typeError("Original cost must be a valid number")
        .required("Please enter original cost")
        .min(0, "Original cost cannot be negative"),
    service_cost: Yup.number()
        .typeError("Service cost must be a valid number")
        .required("Please enter service cost")
        .min(0, "Service cost cannot be negative")
        .test(
            "greater-than-original",
            "Service cost must be greater than original cost",
            function (val) {
                const { original_cost } = this.parent;
                if (val === undefined || val === null || isNaN(val) || original_cost === undefined || original_cost === null || isNaN(original_cost)) {
                    return true;
                }
                return Number(val) > Number(original_cost);
            }
        ),
    stock_quantity: Yup.number()
        .typeError("Stock quantity must be a valid number")
        .required("Please enter stock quantity")
        .integer("Stock quantity must be a whole number")
        .min(0, "Stock quantity cannot be negative"),
    low_stock_threshold: Yup.number()
        .typeError("Low stock threshold must be a valid number")
        .required("Please enter low stock threshold")
        .integer("Low stock threshold must be a whole number")
        .min(0, "Low stock threshold cannot be negative"),
});

export const partSchema = addPartSchema;

// Supplier Validation Schema (Create)
export const createSupplierSchema = Yup.object().shape({
    full_name: Yup.string()
        .trim()
        .required("Please enter full name")
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters"),
    email: emailValidation,
});

// Create Technician Validation Schema
export const createTechnicianSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Please enter technician name")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
    email: emailValidation,
    password: Yup.string()
        .required("Please enter password")
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password cannot exceed 50 characters"),
    job_role: Yup.string()
        .trim()
        .max(100, "Job role cannot exceed 100 characters")
        .nullable(),
    contact_number: phoneValidationRule("contact number"),
    home_address: Yup.string()
        .trim()
        .max(250, "Address cannot exceed 250 characters")
        .nullable(),
});

// Service Validation Schema
export const serviceSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Please enter service name")
        .min(2, "Service name must be at least 2 characters")
        .max(150, "Service name cannot exceed 150 characters"),
    cost: Yup.number()
        .typeError("Service cost must be a valid number")
        .required("Please enter service cost")
        .min(0, "Service cost cannot be negative"),
});

export const createServiceSchema = serviceSchema;
export const updateServiceSchema = serviceSchema;

// Maintenance Validation Schema
export const createMaintenanceSchema = Yup.object().shape({
    van_id: Yup.number()
        .typeError("Please select a van")
        .required("Please select a van"),
    title: Yup.string()
        .trim()
        .required("Please enter task title")
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title cannot exceed 200 characters"),
    maintenance_type: Yup.string()
        .trim()
        .required("Please select or enter maintenance type")
        .max(100, "Maintenance type cannot exceed 100 characters"),
    priority: Yup.string()
        .oneOf(["high", "medium", "low"], "Priority must be high, medium, or low")
        .required("Please select priority"),
    description: Yup.string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .nullable(),
    job_location: Yup.string()
        .trim()
        .required("Please enter job location")
        .max(300, "Location cannot exceed 300 characters"),
    schedule_date: Yup.string()
        .required("Please select schedule date")
        .test("is-future-or-today", "Schedule date cannot be in the past", (value) => {
            if (!value) return false;
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;
            return value >= todayStr;
        }),
    schedule_time: Yup.string()
        .required("Please select schedule time")
        .test("is-future-time", "Schedule time must be later than current time", function (value) {
            const { schedule_date } = this.parent;
            if (!schedule_date || !value) return true;

            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;

            if (schedule_date === todayStr) {
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();
                const currentTimeInMinutes = currentHours * 60 + currentMinutes;

                const [selectedHours, selectedMinutes] = value.split(':').map(Number);
                const selectedTimeInMinutes = selectedHours * 60 + (selectedMinutes || 0);

                return selectedTimeInMinutes > currentTimeInMinutes;
            }
            return true;
        }),
    estimated_hours: Yup.number()
        .typeError("Estimated hours must be a valid number")
        .required("Please enter estimated hours")
        .positive("Estimated hours must be greater than 0")
        .max(1000, "Estimated hours is too large"),
    assignee_type: Yup.string()
        .required("Please select assignee type"),
    assignee_id: Yup.number()
        .typeError("Please select an assignee")
        .required("Please select an assignee"),
    services: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string()
                    .trim()
                    .required("Service name is required"),
                cost: Yup.number()
                    .typeError("Cost must be a valid number")
                    .required("Cost is required")
                    .min(0, "Cost cannot be negative"),
                is_custom: Yup.boolean().default(false),
                service_id: Yup.number().nullable(),
            })
        )
        .min(1, "Please add at least one service to the maintenance task"),
});


