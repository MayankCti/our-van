import "./index.css";
const PaginationDropdown = ({
    onChange,
    listPerPages = 10,
    options = [10, 25, 50, 100, 250],
}) => {
    return (
        <div className="d-flex align-items-center gap-2">
            <select
                className="ct_pagination_select_21"
                value={listPerPages}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {options.map((num) => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PaginationDropdown;
