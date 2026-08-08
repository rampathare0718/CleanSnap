const StatCard = ({ label, value, icon: Icon, accent = "emerald" }) => {
    const accents = {
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600"
    };

    return (
        <div className="flex items-center gap-4 p-5 rounded-xl border border-neutral-200 bg-white">
            <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${accents[accent]}`}>
                {Icon && <Icon size={20} />}
            </div>
            <div>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;