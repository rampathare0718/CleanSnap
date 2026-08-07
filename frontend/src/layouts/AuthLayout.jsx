const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Branding panel — hidden on small screens */}
            <div className="hidden md:flex flex-1 items-center justify-center p-14 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
                <div className="max-w-md">
                    <div className="flex items-center gap-2.5 mb-12">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 font-bold text-sm">
                            CS
                        </span>
                        <span className="text-lg font-bold tracking-wide">CleanSnap</span>
                    </div>

                    <h1 className="text-[34px] leading-tight font-bold mb-4">
                        Report it. Track it. Watch your city get cleaner.
                    </h1>

                    <p className="text-[15px] leading-relaxed text-white/85">
                        Snap a photo of a waste hotspot, share its location, and follow it
                        through to cleanup — while earning reward points along the way.
                    </p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-[420px]">
                    <h2 className="text-[26px] font-bold text-neutral-900 mb-1.5">{title}</h2>
                    {subtitle && <p className="text-sm text-neutral-500 mb-7">{subtitle}</p>}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;