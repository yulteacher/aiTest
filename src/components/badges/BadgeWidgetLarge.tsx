// BadgeWidgetLarge.tsx
import React from "react";
import BadgeIcon from "./BadgeIcon";

interface Props {
    badgeIds: string[];
}

export default function BadgeWidgetLarge({ badgeIds }: Props) {
    return (
        <div className="badge-widget-large p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-3">나의 대표 배지</h3>

            <div className="flex justify-between items-center gap-3">
                {badgeIds.slice(0, 5).map((id) => (
                    <BadgeIcon key={id} badgeId={id} size="lg" showLabel />
                ))}

                {[...Array(Math.max(0, 5 - badgeIds.length))].map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="w-20 h-20 rounded-xl border border-white/20 bg-white/5"
                    />
                ))}
            </div>
        </div>
    );
}
