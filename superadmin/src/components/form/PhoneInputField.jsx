import React, { useRef, useState, useEffect } from 'react';
import RawPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Handle CommonJS / ESM default export variation in Vite / React 19
const PhoneInput =
  typeof RawPhoneInput === 'function'
    ? RawPhoneInput
    : typeof RawPhoneInput?.default === 'function'
    ? RawPhoneInput.default
    : RawPhoneInput?.default || RawPhoneInput;

const PhoneInputField = ({
  value = '',
  onChange,
  onBlur,
  name,
  id,
  placeholder = 'Enter phone number',
  disabled = false,
  readOnly = false,
  className = '',
  country = 'au',
  preferredCountries = ['au', 'in', 'nz', 'gb', 'us'],
  enableSearch = false,
  isInvalid = false,
}) => {
  const wrapperRef = useRef(null);
  const [isDropup, setIsDropup] = useState(false);

  const checkDropupPosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 240 && spaceAbove > 200) {
        setIsDropup(true);
      } else {
        setIsDropup(false);
      }
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      checkDropupPosition();
    };
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
    };
  }, []);

  const handleChange = (phoneVal, countryData, event, formattedValue) => {
    if (typeof onChange === 'function') {
      const formatted = phoneVal ? (phoneVal.startsWith('+') ? phoneVal : `+${phoneVal}`) : '';
      onChange(formatted, countryData, formattedValue);
    }
  };

  const handleBlurEvent = () => {
    if (typeof onBlur === 'function') {
      onBlur({
        target: {
          name: name || id,
          value: value,
        },
      });
    }
  };

  return (
    <div
      ref={wrapperRef}
      onMouseDown={checkDropupPosition}
      className={`ct_phone_input_wrapper ${isDropup ? 'dropup' : ''} ${disabled || readOnly ? 'disabled' : ''} ${isInvalid ? 'is-invalid' : ''} ${className}`}
    >
      <PhoneInput
        country={country}
        preferredCountries={preferredCountries}
        enableSearch={enableSearch}
        searchPlaceholder="Search country..."
        value={value ? String(value) : ''}
        onChange={handleChange}
        onBlur={handleBlurEvent}
        disabled={disabled || readOnly}
        placeholder={placeholder}
        countryCodeEditable={true}
        inputProps={{
          name: name || id,
          id: id || name,
          readOnly: readOnly,
          autoComplete: 'tel',
        }}
        containerClass="w-100 ct_phone_container"
        inputClass="form-control ct_input ct_phone_field w-100"
        buttonClass="ct_phone_btn"
        dropdownClass="ct_phone_dropdown shadow-sm"
      />
    </div>
  );
};

export default PhoneInputField;
