import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getComponentsList, createVanStep3 } from '../../../redux/slices/vanSlice';
import { step3ComponentItemSchema } from '../../../utils/Schema';

const renderComponentIcon = (iconKey, name = "") => {
    const key = (iconKey || "").toLowerCase();
    const lowerName = (name || "").toLowerCase();

    if (key === "battery" || lowerName.includes("battery")) {
        return (
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.25 30V25.5H10.5L15.75 18V22.5H19.5L14.25 30ZM1.5 30C1.075 30 0.71875 29.8563 0.43125 29.5688C0.14375 29.2812 0 28.925 0 28.5V4.5C0 4.075 0.14375 3.71875 0.43125 3.43125C0.71875 3.14375 1.075 3 1.5 3H4.5V0H10.5V3H13.5C13.925 3 14.2812 3.14375 14.5688 3.43125C14.8563 3.71875 15 4.075 15 4.5V15C14.475 15 13.9625 15.0438 13.4625 15.1313C12.9625 15.2188 12.475 15.35 12 15.525V6H3V27H6.525C6.725 27.575 6.96875 28.1125 7.25625 28.6125C7.54375 29.1125 7.8875 29.575 8.2875 30H1.5Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "solar-panels" || key === "solar" || lowerName.includes("solar")) {
        return (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 30L3 15H27L30 30H0ZM1.5 3V0H6V3H1.5ZM3.675 27H13.5V24H4.275L3.675 27ZM6.1875 10.9875L4.05 8.8875L7.2375 5.7L9.375 7.8L6.1875 10.9875ZM4.875 21H13.5V18H5.475L4.875 21ZM15 7.5C12.925 7.5 11.1562 6.76875 9.69375 5.30625C8.23125 3.84375 7.5 2.075 7.5 0H10.5C10.5 1.25 10.9375 2.3125 11.8125 3.1875C12.6875 4.0625 13.75 4.5 15 4.5C16.25 4.5 17.3125 4.0625 18.1875 3.1875C19.0625 2.3125 19.5 1.25 19.5 0H22.5C22.5 2.075 21.7687 3.84375 20.3062 5.30625C18.8438 6.76875 17.075 7.5 15 7.5ZM13.5 13.5V9H16.5V13.5H13.5ZM16.5 27H26.325L25.725 24H16.5V27ZM16.5 21H25.125L24.525 18H16.5V21ZM23.8125 10.9875L20.6625 7.8L22.7625 5.7L25.95 8.85L23.8125 10.9875ZM24 3V0H28.5V3H24Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "fridge" || lowerName.includes("fridge") || lowerName.includes("refrigerator")) {
        return (
            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9V4.5H9V9H6ZM6 22.5V15H9V22.5H6ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H21C21.825 0 22.5312 0.29375 23.1187 0.88125C23.7062 1.46875 24 2.175 24 3V27C24 27.825 23.7062 28.5312 23.1187 29.1187C22.5312 29.7062 21.825 30 21 30H3ZM3 27H21V13.5H3V27ZM3 10.5H21V3H3V10.5Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "water-pump" || key === "waterpump" || lowerName.includes("water") || lowerName.includes("pump")) {
        return (
            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4125 25.5C12.7125 25.475 12.9688 25.3562 13.1812 25.1437C13.3937 24.9312 13.5 24.675 13.5 24.375C13.5 24.025 13.3875 23.7437 13.1625 23.5312C12.9375 23.3188 12.65 23.225 12.3 23.25C11.275 23.325 10.1875 23.0438 9.0375 22.4062C7.8875 21.7687 7.1625 20.6125 6.8625 18.9375C6.8125 18.6625 6.68125 18.4375 6.46875 18.2625C6.25625 18.0875 6.0125 18 5.7375 18C5.3875 18 5.1 18.1312 4.875 18.3937C4.65 18.6562 4.575 18.9625 4.65 19.3125C5.075 21.5875 6.075 23.2125 7.65 24.1875C9.225 25.1625 10.8125 25.6 12.4125 25.5ZM12 30C8.575 30 5.71875 28.825 3.43125 26.475C1.14375 24.125 0 21.2 0 17.7C0 15.2 0.99375 12.4812 2.98125 9.54375C4.96875 6.60625 7.975 3.425 12 0C16.025 3.425 19.0312 6.60625 21.0187 9.54375C23.0062 12.4812 24 15.2 24 17.7C24 21.2 22.8563 24.125 20.5688 26.475C18.2812 28.825 15.425 30 12 30ZM12 27C14.6 27 16.75 26.1188 18.45 24.3563C20.15 22.5938 21 20.375 21 17.7C21 15.875 20.2438 13.8125 18.7313 11.5125C17.2188 9.2125 14.975 6.7 12 3.975C9.025 6.7 6.78125 9.2125 5.26875 11.5125C3.75625 13.8125 3 15.875 3 17.7C3 20.375 3.85 22.5938 5.55 24.3563C7.25 26.1188 9.4 27 12 27Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "air-conditioner" || key === "ac" || lowerName.includes("air") || lowerName.includes("conditioner")) {
        return (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 30V23.775L8.625 28.575L6.525 26.475L13.5 19.5V16.5H10.5L3.525 23.475L1.425 21.375L6.225 16.5H0V13.5H6.225L1.425 8.625L3.525 6.525L10.5 13.5H13.5V10.5L6.525 3.525L8.625 1.425L13.5 6.225V0H16.5V6.225L21.375 1.425L23.475 3.525L16.5 10.5V13.5H19.5L26.475 6.525L28.575 8.625L23.775 13.5H30V16.5H23.775L28.575 21.375L26.475 23.475L19.5 16.5H16.5V19.5L23.475 26.475L21.375 28.575L16.5 23.775V30H13.5Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "gas-system" || key === "gas" || lowerName.includes("gas")) {
        return (
            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 30C4.35 30 2.9375 29.4125 1.7625 28.2375C0.5875 27.0625 0 25.65 0 24V12C0 10.575 0.425 9.3375 1.275 8.2875C2.125 7.2375 3.2 6.5375 4.5 6.1875V3C4.5 2.175 4.79375 1.46875 5.38125 0.88125C5.96875 0.29375 6.675 0 7.5 0H16.5C17.325 0 18.0312 0.29375 18.6187 0.88125C19.2062 1.46875 19.5 2.175 19.5 3V6.1875C20.8 6.5375 21.875 7.2375 22.725 8.2875C23.575 9.3375 24 10.575 24 12V24C24 25.65 23.4125 27.0625 22.2375 28.2375C21.0625 29.4125 19.65 30 18 30H6ZM3 16.5H21V12C21 11.175 20.7062 10.4688 20.1187 9.88125C19.5312 9.29375 18.825 9 18 9H6C5.175 9 4.46875 9.29375 3.88125 9.88125C3.29375 10.4688 3 11.175 3 12V16.5ZM6 27H18C18.825 27 19.5312 26.7062 20.1187 26.1187C20.7062 25.5312 21 24.825 21 24V19.5H3V24C3 24.825 3.29375 25.5312 3.88125 26.1187C4.46875 26.7062 5.175 27 6 27ZM13.5 6H16.5V3H7.5V6H10.5C10.5 5.575 10.6437 5.21875 10.9312 4.93125C11.2188 4.64375 11.575 4.5 12 4.5C12.425 4.5 12.7812 4.64375 13.0688 4.93125C13.3563 5.21875 13.5 5.575 13.5 6Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "brakes" || lowerName.includes("brake")) {
        return (
            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.375 29.85C19.775 29.6 18.4062 28.9 17.2687 27.75C16.1312 26.6 15.4375 25.225 15.1875 23.625H17.4C17.625 24.625 18.0938 25.4813 18.8062 26.1938C19.5187 26.9062 20.375 27.375 21.375 27.6V29.85ZM23.625 29.8875V27.6C24.825 27.325 25.8125 26.725 26.5875 25.8C27.3625 24.875 27.75 23.775 27.75 22.5C27.75 21.225 27.3625 20.125 26.5875 19.2C25.8125 18.275 24.825 17.675 23.625 17.4V15.1125C25.425 15.3875 26.9375 16.2188 28.1625 17.6063C29.3875 18.9938 30 20.625 30 22.5C30 24.375 29.3875 26.0062 28.1625 27.3937C26.9375 28.7812 25.425 29.6125 23.625 29.8875ZM15.1875 21.375C15.4375 19.775 16.1312 18.4 17.2687 17.25C18.4062 16.1 19.775 15.4 21.375 15.15V17.4C20.375 17.625 19.5187 18.0938 18.8062 18.8062C18.0938 19.5187 17.625 20.375 17.4 21.375H15.1875ZM21 25.5V19.5L25.65 22.5L21 25.5ZM10.95 30L10.35 25.2C10.025 25.075 9.71875 24.925 9.43125 24.75C9.14375 24.575 8.8625 24.3875 8.5875 24.1875L4.125 26.0625L0 18.9375L3.8625 16.0125C3.8375 15.8375 3.825 15.6688 3.825 15.5063C3.825 15.3438 3.825 15.175 3.825 15C3.825 14.825 3.825 14.6562 3.825 14.4937C3.825 14.3312 3.8375 14.1625 3.8625 13.9875L0 11.0625L4.125 3.9375L8.5875 5.8125C8.8625 5.6125 9.15 5.425 9.45 5.25C9.75 5.075 10.05 4.925 10.35 4.8L10.95 0H19.2L19.8 4.8C20.125 4.925 20.4312 5.075 20.7188 5.25C21.0063 5.425 21.2875 5.6125 21.5625 5.8125L26.025 3.9375L30.15 11.0625L27.375 13.1625C26.825 12.8875 26.2625 12.6562 25.6875 12.4688C25.1125 12.2812 24.5 12.15 23.85 12.075L26.2125 10.275L24.75 7.725L21.0375 9.3C20.4875 8.725 19.8813 8.24375 19.2188 7.85625C18.5562 7.46875 17.8375 7.175 17.0625 6.975L16.575 3H13.6125L13.0875 6.975C12.3125 7.175 11.5938 7.46875 10.9312 7.85625C10.2687 8.24375 9.6625 8.7125 9.1125 9.2625L5.4 7.725L3.9375 10.275L7.1625 12.675C7.0375 13.05 6.95 13.425 6.9 13.8C6.85 14.175 6.825 14.575 6.825 15C6.825 15.4 6.85 15.7875 6.9 16.1625C6.95 16.5375 7.0375 16.9125 7.1625 17.2875L3.9375 19.725L5.4 22.275L9.1125 20.7C9.5375 21.125 9.99375 21.5063 10.4812 21.8438C10.9688 22.1812 11.5 22.4625 12.075 22.6875C12.1 24.1125 12.3938 25.45 12.9563 26.7C13.5188 27.95 14.275 29.05 15.225 30H10.95ZM12.4875 19.5375C12.6375 19.0375 12.8188 18.5562 13.0312 18.0938C13.2437 17.6313 13.4875 17.1875 13.7625 16.7625C13.4875 16.5625 13.275 16.3062 13.125 15.9937C12.975 15.6812 12.9 15.35 12.9 15C12.9 14.375 13.1187 13.8438 13.5562 13.4062C13.9937 12.9688 14.525 12.75 15.15 12.75C15.5 12.75 15.8375 12.8312 16.1625 12.9937C16.4875 13.1562 16.75 13.375 16.95 13.65C17.375 13.375 17.8125 13.1312 18.2625 12.9187C18.7125 12.7063 19.1875 12.533 19.6875 12.4125C19.2375 11.6125 18.6125 10.9688 17.8125 10.4812C17.0125 9.99375 16.125 9.75 15.15 9.75C13.675 9.75 12.4312 10.2625 11.4187 11.2875C10.4062 12.3125 9.9 13.55 9.9 15C9.9 15.95 10.1313 16.8312 10.5938 17.6437C11.0562 18.4562 11.6875 19.0875 12.4875 19.5375Z" fill="#475569" />
            </svg>
        );
    }

    if (key === "suspension" || lowerName.includes("suspension")) {
        return (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.6 27.0375L16.3875 18.825L19.5375 15.675L27.75 23.8875L24.6 27.0375ZM3.9 27.0375L0.75 23.8875L11.1 13.5375L8.55 10.9875L7.5 12.0375L5.5875 10.125V13.2L4.5375 14.25L0 9.7125L1.05 8.6625H4.125L2.25 6.7875L7.575 1.4625C8.075 0.9625 8.6125 0.6 9.1875 0.375C9.7625 0.15 10.35 0.0375 10.95 0.0375C11.55 0.0375 12.1375 0.15 12.7125 0.375C13.2875 0.6 13.825 0.9625 14.325 1.4625L10.875 4.9125L12.75 6.7875L11.7 7.8375L14.25 10.3875L17.625 7.0125C17.525 6.7375 17.4438 6.45 17.3813 6.15C17.3188 5.85 17.2875 5.55 17.2875 5.25C17.2875 3.775 17.7937 2.53125 18.8062 1.51875C19.8188 0.50625 21.0625 0 22.5375 0C22.9125 0 23.2688 0.0375 23.6063 0.1125C23.9438 0.1875 24.2875 0.3 24.6375 0.45L20.925 4.1625L23.625 6.8625L27.3375 3.15C27.5125 3.5 27.6313 3.84375 27.6938 4.18125C27.7563 4.51875 27.7875 4.875 27.7875 5.25C27.7875 6.725 27.2812 7.96875 26.2687 8.98125C25.2562 9.99375 24.0125 10.5 22.5375 10.5C22.2375 10.5 21.9375 10.475 21.6375 10.425C21.3375 10.375 21.05 10.2875 20.775 10.1625L3.9 27.0375Z" fill="#475569" />
            </svg>
        );
    }

    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#475569" />
        </svg>
    );
};

// Component validation helper using Yup schema
const validateComponent = (item) => {
    const errors = {};
    if (!item.manufacturer || !item.manufacturer.trim()) {
        errors.manufacturer = "Please enter manufacturer name";
    } else if (item.manufacturer.trim().length < 2) {
        errors.manufacturer = "Manufacturer name must be at least 2 characters";
    } else if (item.manufacturer.trim().length > 100) {
        errors.manufacturer = "Manufacturer name cannot exceed 100 characters";
    }

    if (!item.installation_date) {
        errors.installation_date = "Please select installation date";
    } else {
        const instDate = new Date(item.installation_date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (instDate > today) {
            errors.installation_date = "Installation date cannot be in the future";
        }
    }

    if (!item.warranty_period_months || Number(item.warranty_period_months) <= 0) {
        errors.warranty_period_months = "Please select warranty period";
    }

    if (item.replacement_schedule) {
        const repDate = new Date(item.replacement_schedule);
        if (item.installation_date) {
            const instDate = new Date(item.installation_date);
            if (repDate < instDate) {
                errors.replacement_schedule = "Replacement schedule date must be after installation date";
            }
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (repDate < today) {
                errors.replacement_schedule = "Replacement schedule date cannot be in the past";
            }
        }
    }

    if (item.maintenance_notes && item.maintenance_notes.length > 500) {
        errors.maintenance_notes = "Maintenance notes cannot exceed 500 characters";
    }

    // At least one photo / document is required for each component
    if (!item.file && !item.existing_file_url) {
        errors.file = "Please upload component image or manual";
    }

    return errors;
};


const Step3Components = ({ onPrev, onNext, initialData, vanId }) => {
    const dispatch = useDispatch();

    const {
        componentsList = [],
        isComponentsLoading = false,
        isLoading: isSubmitting = false,
        vanId: reduxVanId,
    } = useSelector((state) => state?.vanReducer || {});

    const activeVanId = vanId || reduxVanId;

    // State for selected components dictionary { [temp_id]: componentObject }
    const [selectedComponents, setSelectedComponents] = useState({});
    const [customComponents, setCustomComponents] = useState([]);
    const [activeComponentId, setActiveComponentId] = useState(null);

    // Validation and Error states
    const [componentErrors, setComponentErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [selectionError, setSelectionError] = useState('');
    const [customNameError, setCustomNameError] = useState('');
    const [fileError, setFileError] = useState('');

    // Custom Component Input State
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customNameInput, setCustomNameInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Fetch master components list on mount
    useEffect(() => {
        dispatch(getComponentsList());
    }, [dispatch]);

    // Populate from initialData or saved progress
    useEffect(() => {
        if (initialData) {
            let initialArr = [];
            if (Array.isArray(initialData)) {
                initialArr = initialData;
            } else if (typeof initialData === 'object' && Object.keys(initialData).length > 0) {
                initialArr = Object.values(initialData);
            }

            if (initialArr.length > 0) {
                const restoredMap = {};
                const restoredCustoms = [];

                initialArr.forEach((item, idx) => {
                    const tempId = item.temp_id || (item.is_custom ? `custom_${idx + 1}` : `component_${item.component_type_id || item.id}`);
                    restoredMap[tempId] = {
                        temp_id: tempId,
                        component_type_id: item.is_custom ? null : (item.component_type_id || item.id),
                        component_name: item.component_name || item.name || '',
                        is_custom: Boolean(item.is_custom),
                        icon_key: item.icon_key || '',
                        manufacturer: item.manufacturer || '',
                        installation_date: item.installation_date ? item.installation_date.split('T')[0] : '',
                        warranty_period_months: item.warranty_period_months || 12,
                        replacement_schedule: item.replacement_schedule ? item.replacement_schedule.split('T')[0] : '',
                        maintenance_notes: item.maintenance_notes || '',
                        file: item.file || null,
                        file_name: item.file_name || (item.file ? item.file.name : ''),
                        file_preview: item.file_preview || null,
                        existing_file_url: item.image_url || item.file_url || null,
                    };

                    if (item.is_custom) {
                        restoredCustoms.push({
                            temp_id: tempId,
                            id: null,
                            name: item.component_name || item.name || `Custom ${idx + 1}`,
                            slug: 'custom',
                            icon_key: 'custom',
                            is_custom: true,
                        });
                    }
                });

                setSelectedComponents(restoredMap);
                if (restoredCustoms.length > 0) {
                    setCustomComponents(restoredCustoms);
                }
                const firstKey = Object.keys(restoredMap)[0];
                if (firstKey) {
                    setActiveComponentId(firstKey);
                }
            }
        }
    }, [initialData]);

    // Handle Master Component Checkbox Toggle
    const handleToggleMasterComponent = (comp) => {
        const tempId = `component_${comp.id}`;
        setSelectionError('');

        setSelectedComponents((prev) => {
            const next = { ...prev };
            if (next[tempId]) {
                delete next[tempId];
                // Remove errors & touched for this component
                setComponentErrors((errs) => {
                    const newErrs = { ...errs };
                    delete newErrs[tempId];
                    return newErrs;
                });
                setTouchedFields((touched) => {
                    const newTouched = { ...touched };
                    delete newTouched[tempId];
                    return newTouched;
                });

                if (activeComponentId === tempId) {
                    const remainingKeys = Object.keys(next);
                    setActiveComponentId(remainingKeys.length > 0 ? remainingKeys[0] : null);
                }
            } else {
                next[tempId] = {
                    temp_id: tempId,
                    component_type_id: comp.id,
                    component_name: comp.name,
                    is_custom: false,
                    icon_key: comp.icon_key || comp.slug || '',
                    manufacturer: '',
                    installation_date: '',
                    warranty_period_months: 12,
                    replacement_schedule: '',
                    maintenance_notes: '',
                    file: null,
                    file_name: '',
                    file_preview: null,
                    existing_file_url: null,
                };
                if (!activeComponentId) {
                    setActiveComponentId(tempId);
                }
            }
            return next;
        });
    };

    // Handle Adding a Custom Component
    const handleAddCustomComponent = () => {
        const trimmed = customNameInput.trim();
        if (!trimmed) {
            setCustomNameError("Please enter custom component name");
            return;
        }

        if (trimmed.length > 50) {
            setCustomNameError("Component name cannot exceed 50 characters");
            return;
        }

        // Check for duplicates
        const existsMaster = componentsList.some((c) => c.name?.toLowerCase() === trimmed.toLowerCase());
        const existsCustom = customComponents.some((c) => c.name?.toLowerCase() === trimmed.toLowerCase());
        if (existsMaster || existsCustom) {
            setCustomNameError("A component with this name already exists");
            return;
        }

        setCustomNameError('');
        setSelectionError('');
        const tempId = `custom_${Date.now()}`;
        const newCustom = {
            temp_id: tempId,
            id: null,
            name: trimmed,
            slug: 'custom',
            icon_key: 'custom',
            is_custom: true,
        };

        setCustomComponents((prev) => [...prev, newCustom]);
        setSelectedComponents((prev) => ({
            ...prev,
            [tempId]: {
                temp_id: tempId,
                component_type_id: null,
                component_name: trimmed,
                is_custom: true,
                icon_key: 'custom',
                manufacturer: '',
                installation_date: '',
                warranty_period_months: 12,
                replacement_schedule: '',
                maintenance_notes: '',
                file: null,
                file_name: '',
                file_preview: null,
                existing_file_url: null,
            },
        }));

        setActiveComponentId(tempId);
        setCustomNameInput('');
        setIsAddingCustom(false);
    };

    // Handle Removing a Custom Component entirely
    const handleRemoveCustomComponent = (tempId) => {
        setCustomComponents((prev) => prev.filter((c) => c.temp_id !== tempId));
        setSelectedComponents((prev) => {
            const next = { ...prev };
            delete next[tempId];
            if (activeComponentId === tempId) {
                const remainingKeys = Object.keys(next);
                setActiveComponentId(remainingKeys.length > 0 ? remainingKeys[0] : null);
            }
            return next;
        });
        setComponentErrors((errs) => {
            const newErrs = { ...errs };
            delete newErrs[tempId];
            return newErrs;
        });
        setTouchedFields((touched) => {
            const newTouched = { ...touched };
            delete newTouched[tempId];
            return newTouched;
        });
    };

    // Handle Active Component Field Changes
    const handleFieldChange = (field, value) => {
        if (!activeComponentId) return;

        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            const updated = {
                ...current,
                [field]: value,
            };

            // Re-validate this component to clear/update error for this field
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });
    };

    // Handle Field Blur (mark as touched)
    const handleFieldBlur = (field) => {
        if (!activeComponentId) return;
        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                [field]: true,
            },
        }));

        const current = selectedComponents[activeComponentId];
        if (current) {
            const errs = validateComponent(current);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));
        }
    };

    // File Upload Handler for Active Component
    const handleFileUpload = (files) => {
        if (!activeComponentId || !files || files.length === 0) return;
        const file = files[0];
        setFileError('');

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Invalid file type. Please upload a PNG, JPG, WEBP, or PDF file.");
            toast.error("Invalid file format");
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setFileError("File size exceeds 10MB limit. Please upload a smaller file.");
            toast.error("File size exceeds 10MB");
            return;
        }

        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            const updated = {
                ...current,
                file: file,
                file_name: file.name,
                file_preview: previewUrl,
            };

            // Re-validate to clear file error immediately
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });

        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                file: true,
            },
        }));
    };

    const handleRemoveFile = () => {
        if (!activeComponentId) return;
        setFileError('');
        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            if (current.file_preview && !current.existing_file_url) {
                URL.revokeObjectURL(current.file_preview);
            }
            const updated = {
                ...current,
                file: null,
                file_name: '',
                file_preview: null,
                existing_file_url: null,
            };

            // Re-validate to show file required error
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });

        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                file: true,
            },
        }));
    };

    const selectedKeys = Object.keys(selectedComponents);
    const selectedList = Object.values(selectedComponents);
    const activeComponent = activeComponentId ? selectedComponents[activeComponentId] : null;
    const activeErrors = (activeComponentId && componentErrors[activeComponentId]) || {};
    const activeTouched = (activeComponentId && touchedFields[activeComponentId]) || {};

    // Validate all selected components
    const validateAll = () => {
        let hasError = false;
        const newErrors = {};
        const allTouched = {};
        let firstInvalidId = null;

        selectedList.forEach((item) => {
            const errs = validateComponent(item);
            newErrors[item.temp_id] = errs;
            allTouched[item.temp_id] = {
                manufacturer: true,
                installation_date: true,
                warranty_period_months: true,
                replacement_schedule: true,
                maintenance_notes: true,
                file: true,
            };

            if (Object.keys(errs).length > 0) {
                hasError = true;
                if (!firstInvalidId) {
                    firstInvalidId = item.temp_id;
                }
            }
        });

        setComponentErrors(newErrors);
        setTouchedFields(allTouched);

        return { isValid: !hasError, firstInvalidId, errors: newErrors };
    };

    // Handle Step 3 Submission
    const handleSubmit = () => {
        if (selectedList.length === 0) {
            setSelectionError("Please select at least one component to proceed.");
            toast.error("Please select at least one component");
            return;
        }

        if (!activeVanId) {
            toast.error("Van ID not found. Please complete Step 1 first.");
            return;
        }

        // Validate all components
        const { isValid, firstInvalidId } = validateAll();
        if (!isValid) {
            if (firstInvalidId && firstInvalidId !== activeComponentId) {
                setActiveComponentId(firstInvalidId);
                const invalidName = selectedComponents[firstInvalidId]?.component_name || "Component";
                toast.error(`Please complete the required details for "${invalidName}"`);
            } else {
                toast.error("Please fill in all required fields marked with *");
            }
            return;
        }

        // Build Payload according to API specs
        const componentsPayload = selectedList.map((item) => ({
            temp_id: item.temp_id,
            component_type_id: item.is_custom ? null : item.component_type_id,
            ...(item.is_custom ? { component_name: item.component_name } : {}),
            is_custom: Boolean(item.is_custom),
            manufacturer: item.manufacturer ? item.manufacturer.trim() : "",
            installation_date: item.installation_date || "",
            warranty_period_months: item.warranty_period_months ? Number(item.warranty_period_months) : 12,
            replacement_schedule: item.replacement_schedule || "",
            maintenance_notes: item.maintenance_notes ? item.maintenance_notes.trim() : "",
        }));

        const fileMeta = [];
        const filesToAppend = [];

        selectedList.forEach((item) => {
            if (item.file) {
                fileMeta.push({
                    temp_id: item.temp_id,
                    file_type: "COMPONENT_IMAGE",
                });
                filesToAppend.push(item.file);
            }
        });

        const formData = new FormData();
        formData.append('components', JSON.stringify(componentsPayload));

        if (fileMeta.length > 0) {
            formData.append('file_meta', JSON.stringify(fileMeta));
            filesToAppend.forEach((file) => {
                formData.append('files', file);
            });
        }

        const callback = (response) => {
            if (response?.success || response?.status === true || response?.statusCode === 200) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, selectedComponents);
                }
            }
        };

        dispatch(
            createVanStep3({
                vanId: activeVanId,
                payload: formData,
                callback,
            })
        );
    };

    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">3. Van Components</h2>
                    <div className="step-badge">Step 3 of 7</div>
                </div>

                {/* Master Component Checkboxes */}
                <div>
                    {isComponentsLoading && componentsList.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                            <span className="text-muted ct_fs_14">Loading available components...</span>
                        </div>
                    ) : (
                        <div className="row">
                            {componentsList.map((comp) => {
                                const tempId = `component_${comp.id}`;
                                const isChecked = Boolean(selectedComponents[tempId]);
                                const hasErr = Boolean(componentErrors[tempId] && Object.keys(componentErrors[tempId]).length > 0);

                                return (
                                    <div className="col-xl-3 col-md-4 col-sm-6 mb-3 position-relative" key={comp.id}>
                                        <input
                                            type="checkbox"
                                            id={`comp_chk_${comp.id}`}
                                            className="van-checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleMasterComponent(comp)}
                                        />
                                        <label
                                            htmlFor={`comp_chk_${comp.id}`}
                                            className={`van-component-box ${isChecked && hasErr ? 'border-danger' : ''}`}
                                        >
                                            <div>{renderComponentIcon(comp.icon_key || comp.slug, comp.name)}</div>
                                            <h5>{comp.name}</h5>
                                            {isChecked && (
                                                <div className="position-absolute top-0  m-2" style={{ right: "20px" }}>
                                                    {hasErr ? (
                                                        <span className="badge rounded-pill d-flex align-items-center justify-content-center bg-danger" title="Incomplete details" style={{ fontSize: '10px', width: "20px", height: "20px" }}>
                                                            !
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill d-flex align-items-center justify-content-center bg-success" title="Configured" style={{ fontSize: '10px', width: "20px", height: "20px" }}>
                                                            <i className="fa-solid fa-check"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                );
                            })}

                            {/* Custom Components List */}
                            {customComponents.map((custom) => {
                                const isChecked = Boolean(selectedComponents[custom.temp_id]);
                                const hasErr = Boolean(componentErrors[custom.temp_id] && Object.keys(componentErrors[custom.temp_id]).length > 0);

                                return (
                                    <div className="col-xl-3 col-md-4 col-sm-6 mb-3 position-relative" key={custom.temp_id}>
                                        <input
                                            type="checkbox"
                                            id={`comp_chk_${custom.temp_id}`}
                                            className="van-checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    setSelectedComponents((prev) => {
                                                        const next = { ...prev };
                                                        delete next[custom.temp_id];
                                                        if (activeComponentId === custom.temp_id) {
                                                            const remaining = Object.keys(next);
                                                            setActiveComponentId(remaining.length > 0 ? remaining[0] : null);
                                                        }
                                                        return next;
                                                    });
                                                } else {
                                                    setSelectionError('');
                                                    setSelectedComponents((prev) => ({
                                                        ...prev,
                                                        [custom.temp_id]: {
                                                            temp_id: custom.temp_id,
                                                            component_type_id: null,
                                                            component_name: custom.name,
                                                            is_custom: true,
                                                            icon_key: 'custom',
                                                            manufacturer: '',
                                                            installation_date: '',
                                                            warranty_period_months: 12,
                                                            replacement_schedule: '',
                                                            maintenance_notes: '',
                                                            file: null,
                                                            file_name: '',
                                                            file_preview: null,
                                                            existing_file_url: null,
                                                        },
                                                    }));
                                                    if (!activeComponentId) {
                                                        setActiveComponentId(custom.temp_id);
                                                    }
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`comp_chk_${custom.temp_id}`}
                                            className={`van-component-box ${isChecked && hasErr ? 'border-danger' : ''}`}
                                        >
                                            <div>{renderComponentIcon('custom', custom.name)}</div>
                                            <h5>{custom.name}</h5>
                                            {isChecked && (
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    {hasErr ? (
                                                        <span className="badge rounded-pill bg-danger" title="Incomplete details" style={{ fontSize: '10px' }}>
                                                            !
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill bg-success" title="Configured" style={{ fontSize: '10px' }}>
                                                            <i className="fa-solid fa-check"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0  m-2 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: '22px', height: '22px', right: "20px", padding: 0, zIndex: 10 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCustomComponent(custom.temp_id);
                                            }}
                                            title="Remove custom component"
                                        >
                                            <i className="fa-solid fa-xmark" style={{ fontSize: '11px' }}></i>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Selection Error Message */}
                    {selectionError && (
                        <div className="alert alert-danger py-2 px-3 mt-2 d-flex align-items-center gap-2 ct_fs_14" style={{ borderRadius: '8px' }}>
                            <i className="fa-solid fa-circle-exclamation text-danger"></i>
                            <span>{selectionError}</span>
                        </div>
                    )}

                    {/* Add Custom Component Section */}
                    {isAddingCustom ? (
                        <div className="card p-3 mt-3 border-success" style={{ borderRadius: '12px' }}>
                            <label className="ct_label mb-2">Custom Component Name <span className="text-danger">*</span></label>
                            <div className="">
                                <input
                                    type="text"
                                    className={`form-control ct_input ${customNameError ? 'is-invalid border-danger' : ''}`}
                                    placeholder="e.g. Custom Solar Controller"
                                    value={customNameInput}
                                    onChange={(e) => {
                                        setCustomNameInput(e.target.value);
                                        if (customNameError) setCustomNameError('');
                                    }}
                                    autoFocus
                                />
                                <div className='d-flex align-items-center ct_flex_col_575 gap-3 mt-3 justify-content-end'>
                                    <button
                                        type="button"
                                        className="ct_green_btn ct_btn_h_45 ct_w_100_575"
                                        onClick={handleAddCustomComponent}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className=" btn ct_btn_gray ct_btn_h_45 ct_w_100_575"
                                        onClick={() => {
                                            setIsAddingCustom(false);
                                            setCustomNameInput('');
                                            setCustomNameError('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            {customNameError && (
                                <span className="text-danger ct_fs_12 d-block mt-2">
                                    <i className="fa-solid fa-circle-exclamation me-1"></i>
                                    {customNameError}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className="ct_fs_16 ct_fw_500 ct_green_text mt-3 d-inline-block"
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsAddingCustom(true)}
                        >
                            <i className="fa-solid fa-plus me-2"></i> Add Custom component
                        </div>
                    )}

                    {/* Component Details Form Section */}
                    {selectedKeys.length > 0 ? (
                        <>
                            {/* Component Selector Dropdown */}
                            <div className="ct_mt_30 ct_mb_30 d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div className="dropdown ct_w_100_575">
                                    <button
                                        className="btn filter-dropdown dropdown-toggle ct_w_100_575 d-flex align-items-center justify-content-between"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            {activeComponentId && componentErrors[activeComponentId] && Object.keys(componentErrors[activeComponentId]).length > 0 ? (
                                                <span className="badge bg-danger rounded-pill px-3 py-2" style={{ fontSize: '10px' }}>Incomplete</span>
                                            ) : (
                                                <span className="badge bg-success rounded-pill px-3 py-2" style={{ fontSize: '10px' }}>Configured</span>
                                            )}
                                            <span>{activeComponent?.component_name || "Select Component"} Details</span>
                                        </div>
                                        <svg className="ms-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.34 7L10.67 14.67L3 7" stroke="#3D8B37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu w-100 p-0">
                                        {selectedList.map((item) => {
                                            const itemErrs = componentErrors[item.temp_id] || {};
                                            const hasErrs = Object.keys(itemErrs).length > 0;

                                            return (
                                                <li key={item.temp_id}>
                                                    <button
                                                        type="button"
                                                        className={`dropdown-item d-flex align-items-center justify-content-between ${item.temp_id === activeComponentId ? 'active' : ''}`}
                                                        onClick={() => setActiveComponentId(item.temp_id)}
                                                    >
                                                        <span>{item.component_name} Details</span>
                                                        {hasErrs ? (
                                                            <span className="badge bg-danger rounded-pill" style={{ fontSize: '9px' }}>!</span>
                                                        ) : (
                                                            <i className="fa-solid fa-check text-success" style={{ fontSize: '11px' }}></i>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <span className="text-muted ct_fs_14">
                                    Configuring: <strong className="text-dark">{activeComponent?.component_name}</strong> ({selectedKeys.indexOf(activeComponentId) + 1} of {selectedKeys.length} selected)
                                </span>
                            </div>

                            {activeComponent && (
                                <div className="row">
                                    {/* Manufacturer */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Manufacturer <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ct_input ${activeErrors?.manufacturer && activeTouched?.manufacturer ? 'is-invalid border-danger' : ''}`}
                                                placeholder="e.g. Dometic / Energy Drive"
                                                value={activeComponent.manufacturer || ''}
                                                onChange={(e) => handleFieldChange('manufacturer', e.target.value)}
                                                onBlur={() => handleFieldBlur('manufacturer')}
                                            />
                                            {activeErrors?.manufacturer && activeTouched?.manufacturer && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.manufacturer}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Installation Date */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Installation Date <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className={`form-control ct_input ${activeErrors?.installation_date && activeTouched?.installation_date ? 'is-invalid border-danger' : ''}`}
                                                value={activeComponent.installation_date || ''}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => handleFieldChange('installation_date', e.target.value)}
                                                onBlur={() => handleFieldBlur('installation_date')}
                                            />
                                            {activeErrors?.installation_date && activeTouched?.installation_date && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.installation_date}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warranty Period */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Warranty Period <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-control ct_input ct_select_custom ${activeErrors?.warranty_period_months && activeTouched?.warranty_period_months ? 'is-invalid border-danger' : ''}`}
                                                value={activeComponent.warranty_period_months || 12}
                                                onChange={(e) => handleFieldChange('warranty_period_months', Number(e.target.value))}
                                                onBlur={() => handleFieldBlur('warranty_period_months')}
                                            >
                                                <option value={6}>6 Months</option>
                                                <option value={12}>1 Year (12 Months)</option>
                                                <option value={24}>2 Years (24 Months)</option>
                                                <option value={36}>3 Years (36 Months)</option>
                                                <option value={48}>4 Years (48 Months)</option>
                                                <option value={60}>5 Years (60 Months)</option>
                                            </select>
                                            {activeErrors?.warranty_period_months && activeTouched?.warranty_period_months && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.warranty_period_months}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Replacement Schedule */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">Replacement Schedule</label>
                                            <input
                                                type="date"
                                                className={`form-control ct_input ${activeErrors?.replacement_schedule && activeTouched?.replacement_schedule ? 'is-invalid border-danger' : ''}`}
                                                value={activeComponent.replacement_schedule || ''}
                                                min={activeComponent.installation_date || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => handleFieldChange('replacement_schedule', e.target.value)}
                                                onBlur={() => handleFieldBlur('replacement_schedule')}
                                            />
                                            {activeErrors?.replacement_schedule && activeTouched?.replacement_schedule && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.replacement_schedule}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Maintenance Notes */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">Maintenance Notes</label>
                                            <textarea
                                                className={`form-control ct_custom_textarea ${activeErrors?.maintenance_notes && activeTouched?.maintenance_notes ? 'is-invalid border-danger' : ''}`}
                                                rows="3"
                                                placeholder="Add specific care instructions or notes..."
                                                value={activeComponent.maintenance_notes || ''}
                                                onChange={(e) => handleFieldChange('maintenance_notes', e.target.value)}
                                                onBlur={() => handleFieldBlur('maintenance_notes')}
                                            ></textarea>
                                            {activeErrors?.maintenance_notes && activeTouched?.maintenance_notes && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.maintenance_notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Manual / Image Upload */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Component Image / Manual Upload <span className="text-danger">*</span>
                                            </label>
                                            <div
                                                className={`upload-box text-center ${isDragging ? 'border-primary' : ''} ${(activeErrors?.file && activeTouched?.file) || fileError ? 'border-danger' : ''}`}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(true);
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                        handleFileUpload(e.dataTransfer.files);
                                                    }
                                                }}
                                            >
                                                <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                                </svg>
                                                <div>
                                                    <label htmlFor="compManualInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2" style={{ cursor: 'pointer' }}>
                                                        <span className="ct_fw_400">Drag and drop file here, or </span>
                                                        <span className="ct_fw_700 ct_green_text">Browse Files</span><br />
                                                        <span className="ct_fs_12 ct_fw_600">PNG, JPG, WEBP, or PDF (Max 10MB)</span>
                                                    </label>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="compManualInput"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                                                    hidden
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            handleFileUpload(e.target.files);
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                />
                                            </div>

                                            {/* File Error Messages */}
                                            {fileError && (
                                                <span className="text-danger ct_fs_12 d-block mt-2">
                                                    <i className="fa-solid fa-circle-exclamation me-1"></i>
                                                    {fileError}
                                                </span>
                                            )}
                                            {activeErrors?.file && activeTouched?.file && !activeComponent.file && !activeComponent.existing_file_url && (
                                                <span className="text-danger ct_fs_12 d-block mt-2">
                                                    <i className="fa-solid fa-circle-exclamation me-1"></i>
                                                    {activeErrors.file}
                                                </span>
                                            )}

                                            {/* File Attachment / Preview */}
                                            {(activeComponent.file_name || activeComponent.file_preview || activeComponent.existing_file_url) && (
                                                <div className="mt-3 p-2 bg-light rounded d-flex align-items-center justify-content-between border" style={{ maxWidth: '380px' }}>
                                                    <div className="d-flex align-items-center gap-2 text-truncate">
                                                        {activeComponent.file_preview ? (
                                                            <img
                                                                src={activeComponent.file_preview}
                                                                alt="preview"
                                                                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                                                            />
                                                        ) : (
                                                            <i className="fa-solid fa-file-pdf text-danger fs-4"></i>
                                                        )}
                                                        <span className="ct_fs_14 text-truncate">{activeComponent.file_name || 'Uploaded File'}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger border-0"
                                                        onClick={handleRemoveFile}
                                                        title="Remove file"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 bg-light rounded mt-4 border border-dashed">
                            <p className="mb-0 text-muted ct_fs_14">
                                <i className="fa-solid fa-circle-info me-2 text-success"></i>
                                Please select at least one component from above to configure its details.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stepper Buttons */}
            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <button
                    type="button"
                    onClick={() => {
                        if (typeof onPrev === 'function') {
                            onPrev(selectedComponents);
                        }
                    }}
                    className="previous action-button-previous ct_w_100_575 border-0"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedList.length === 0}
                    className="ct_form_next action-button ct_w_100_575 border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ cursor: isSubmitting || selectedList.length === 0 ? 'not-allowed' : 'pointer', opacity: isSubmitting || selectedList.length === 0 ? 0.7 : 1 }}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Saving...</span>
                        </>
                    ) : (
                        'Save & Continue'
                    )}
                </button>
            </div>
        </fieldset>
    );
};

export default Step3Components;
