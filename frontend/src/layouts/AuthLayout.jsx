import CleanSnapLogo from "../assets/cleansnap_logo.png";

const AuthLayout = ({ title, subtitle, children }) => {
    const backgroundImage =
        "YOUR_IMAGE_URL_HERE";

    return (
        <div className="flex min-h-screen w-full bg-white">

            {/* =========================
                Branding Panel
            ========================== */}
            <div
                className="hidden md:flex flex-1 items-center justify-center p-14 bg-cover bg-center text-white relative"
                style={{
                    backgroundImage: `url("https://i.pinimg.com/1200x/14/eb/5e/14eb5e71bf4bd0df27f4497a79ee9213.jpg")`,
                }}
            >

                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Branding Content */}
                <div className="max-w-md relative z-10">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-12">
                        <img
                            src={CleanSnapLogo}
                            alt="CleanSnap Logo"
                            className="w-9 h-9 object-contain rounded-lg"
                        />

                        <span className="text-lg font-bold tracking-wide">
                            CleanSnap
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-[34px] leading-tight font-bold mb-4">
                        Report it. Track it. Watch your city get cleaner.
                    </h1>

                    {/* Description */}
                    <p className="text-[15px] leading-relaxed text-white/90">
                        Snap a photo of a waste hotspot, share its location,
                        and follow it through to cleanup — while earning
                        reward points along the way.
                    </p>

                </div>
            </div>

            {/* =========================
                Form Panel
            ========================== */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">

                <div className="w-full max-w-[420px]">

                    {/* Title */}
                    <h2 className="text-[26px] font-bold text-neutral-900 mb-1.5">
                        {title}
                    </h2>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-sm text-neutral-500 mb-7">
                            {subtitle}
                        </p>
                    )}

                    {/* Login / Register Form */}
                    {children}

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;