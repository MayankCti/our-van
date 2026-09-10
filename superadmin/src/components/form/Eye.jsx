const Eye = ({ isEye, onClick }) => {
    return (
        <div>
            <i
                className={`fa-regular ct_show_eye ${!isEye ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => onClick(!isEye)}
            ></i>
        </div>
    );
};

export default Eye;
