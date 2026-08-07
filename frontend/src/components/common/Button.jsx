const Button = ({
    children,
    type = "button",
    onClick,
    variant = "primary",
    isLoading = false,
    disabled = false,
    fullWidth = true
}) => {
    const base =
        "inline-flex items-center justify-center h-[46px] px-5 rounded-xl text-[15px] font-semibold tracking-wide transition-colors duration-150 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700",
        secondary:
            "bg-transparent text-emerald-600 border-[1.5px] border-emerald-600 hover:bg-emerald-50"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
        >
            {isLoading ? (
                <span className="w-[18px] h-[18px] border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;