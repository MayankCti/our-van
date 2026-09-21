import React from 'react';

const Eye = ({ isEye, onClick }) => {
    return (
        <i
            className={`fa-regular ${!isEye ? "fa-eye-slash" : "fa-eye"} ct_show_eye`}
            style={{ cursor: "pointer" }}
            onClick={() => onClick(!isEye)}
        ></i>
    );
};

export default Eye;
