const QuickAction = ({ icon: Icon, label, description, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-4 p-5 rounded-xl border border-neutral-200 bg-white text-left hover:border-emerald-400 hover:shadow-sm transition w-full"
        >
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-600 text-white shrink-0">
                {Icon && <Icon size={20} />}
            </div>
            <div>
                <p className="font-semibold text-neutral-900">{label}</p>
                {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
            </div>
        </button>
    );
};

export default QuickAction;