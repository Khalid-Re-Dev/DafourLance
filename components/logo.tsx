"use client";

import { useLanguage } from "@/lib/i18n/language-context";

interface LogoProps {
    variant?: "header" | "footer";
    className?: string;
}

/**
 * DafourLance Logo Component
 * - Inline SVG icon (zero network requests, pixel-perfect at any size)
 * - i18n text rendered alongside via Flexbox
 * - DIN Next LT W23 font with Cairo fallback
 * - variant="header" for light backgrounds, variant="footer" for dark
 */
export default function Logo({ variant = "header", className = "" }: LogoProps) {
    const { language, isRTL } = useLanguage();

    const isFooter = variant === "footer";

    // Colors based on variant
    const iconDarkColor = isFooter ? "#ffffff" : "#1d2a3a";
    const iconAccentColor = "#f3825a";
    const primaryTextColor = isFooter ? "#ffffff" : "#1d2a3a";
    const secondaryTextColor = isFooter ? "#9ea5ae" : "#6b7280";

    // i18n text
    const topText = language === "ar" ? "دافورلانس" : "DafourLance";
    const bottomText =
        language === "ar"
            ? "للإستشارات والحلول البرمجية"
            : "Consulting & Software Solutions";

    return (
        <div
            className={`logo-root ${className}`}
            style={{
                display: "flex",
                alignItems: "center",
                gap: isFooter ? "16px" : "14px",
                flexDirection: "row",
                textDecoration: "none",
            }}
        >
            {/* Inline SVG Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 502.49 503.58"
                aria-hidden="true"
                focusable="false"
                className="logo-icon"
                style={{
                    width: isFooter ? "72px" : "56px",
                    height: isFooter ? "72px" : "56px",
                    flexShrink: 0,
                }}
            >
                {/* Microscope diagonal bar */}
                <path
                    d="M185.45,241.7H314a1.36,1.36,0,0,1,1.36,1.36v23.19a0,0,0,0,1,0,0H184.08a0,0,0,0,1,0,0V243.07A1.36,1.36,0,0,1,185.45,241.7Z"
                    transform="translate(376.2 -79) rotate(65.31)"
                    fill={iconDarkColor}
                />
                {/* Microscope lens */}
                <path
                    d="M225.24,246.64c-7.38,3.39-9.82,13.84-5.46,23.34s13.89,14.44,21.26,11"
                    fill={iconDarkColor}
                />
                {/* Microscope stand & base */}
                <path
                    d="M203.46,361.71v3.9a2,2,0,0,0,2,2h43.28a2,2,0,0,0,2-2v-3.9c0-5.29-1.35-9.59-6.65-9.59h-3.47a.15.15,0,0,1-.15-.14s0-49-.1-57.73a1.84,1.84,0,0,0-1.28-1.73l-20.35-3.64a2,2,0,0,0-2.58,1.89v59.37a2,2,0,0,1-2,2h-4C204.81,352.12,203.46,356.42,203.46,361.71Z"
                    fill={iconDarkColor}
                />
                {/* Microscope base plate */}
                <path
                    d="M246.84,393.21A141,141,0,0,0,348,350.55H216.87c-22.55,0-42.15,17.05-43.62,39.54-.07,1-.1,2.07-.1,3.12"
                    fill={iconDarkColor}
                />
                {/* "D" arc (orange) */}
                <path
                    d="M246.84,110.37H197.07l21.68,47.15h28.09a94.27,94.27,0,0,1,94.27,94.27h0a94.06,94.06,0,0,1-35.42,73.61H367.6a140.72,140.72,0,0,0,20.66-73.61h0A141.43,141.43,0,0,0,246.84,110.37Z"
                    fill={iconAccentColor}
                />
                {/* "D" vertical bar (orange) */}
                <polygon
                    points="191.72 157.53 164.39 157.53 164.39 393.2 114.24 393.2 114.24 110.38 170.05 110.38 191.72 157.53"
                    fill={iconAccentColor}
                />
            </svg>

            {/* Text Block */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    lineHeight: 1.2,

                }}
            >
                <span
                    className="logo-primary-text"
                    style={{
                        fontFamily: "'DIN Next LT W23', var(--font-cairo), 'Cairo', sans-serif",
                        fontWeight: 700,
                        fontSize: isFooter ? "28px" : "24px",
                        color: primaryTextColor,
                        letterSpacing: language === "en" ? "0.5px" : "0",
                        whiteSpace: "nowrap",
                    }}
                >
                    {topText}
                </span>
                <span
                    className="logo-secondary-text"
                    style={{
                        fontFamily: "'DIN Next LT W23', var(--font-cairo), 'Cairo', sans-serif",
                        fontWeight: 400,
                        fontSize: isFooter ? "14px" : "12px",
                        color: secondaryTextColor,
                        letterSpacing: language === "en" ? "0.3px" : "0",
                        whiteSpace: "nowrap",
                        marginTop: "2px",
                    }}
                >
                    {bottomText}
                </span>
            </div>
        </div>
    );
}
