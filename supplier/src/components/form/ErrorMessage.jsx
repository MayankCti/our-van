const ErrorMessage = ({ errors, touched, fieldName }) => {
    return (
        <span style={{ color: "red" }}>
            {errors && touched && errors[fieldName] && touched[fieldName] && errors[fieldName]}
        </span>
    );
};

export default ErrorMessage;
