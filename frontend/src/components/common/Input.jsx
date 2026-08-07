const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    error = "",
    required = false,
    as = "input",
    children
}) => {
    const fieldBase =
        "h-11 w-full px-3.5 rounded-lg border-[1.5px] bg-neutral-50 text-sm text-neutral-900 outline-none transition-colors duration-150 focus:bg-white focus:ring-4";

    const fieldState = error
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-neutral-200 focus:border-emerald-600 focus:ring-emerald-100";

    return (
        <div className="flex flex-col mb-4 text-left">
            {label && (
                <label htmlFor={name} className="mb-1.5 text-[13px] font-semibold text-neutral-800">
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            {as === "select" ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${fieldBase} ${fieldState} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23666%22><path d=%22M7 10l5 5 5-5z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:18px]`}
                >
                    {children}
                </select>
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${fieldBase} ${fieldState}`}
                />
            )}

            {error && <span className="mt-1.5 text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;