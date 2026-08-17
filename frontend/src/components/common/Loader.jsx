const Loader = ({ fullScreen = false }) => {
    const spinner = (
        <div className="w-7 h-7 mx-auto rounded-full border-[3px] border-emerald-600/20 border-t-emerald-600 animate-spin" />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loader;