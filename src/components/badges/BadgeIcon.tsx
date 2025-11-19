import React from "react";
import { BADGES } from "../../data/badges";

interface BadgeIconProps {
    badgeId: string;
    size?: "lg" | "md" | "sm";
    showLabel?: boolean;
    onDragStart?: (id: string) => void;
}

export default function BadgeIcon({ badgeId, size = "md", showLabel = false, onDragStart }: BadgeIconProps) {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return null;

    const sizeMap = {
        lg: "w-16 h-16",
        md: "w-12 h-12",
        sm: "w-8 h-8"
    };

    return (
        <div className="flex flex-col items-center justify-center select-none">
            <img
                src={badge.icon}
                alt={badge.name}
                draggable
                onDragStart={() => onDragStart?.(badgeId)}
                className={`${sizeMap[size]} object-contain`}
            />

            {showLabel && (
                <span className="mt-1 text-[clamp(7px,1vw,10px)] text-gray-600 dark:text-gray-400 font-medium tracking-tight text-center">
                    {badge.name}
                </span>
            )}
        </div>
    );
}
