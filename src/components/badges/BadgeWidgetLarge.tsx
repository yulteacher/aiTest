// src/components/badges/BadgeWidgetLarge.tsx

import React from "react";
import BadgeIcon from "./BadgeIcon";

interface Props {
    badgeIds: string[];   // 5개까지만 받음
}

export default function BadgeWidgetLarge({ badgeIds }: Props) {
    return (
        <div className="badge-widget-large p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-3">나의 대표 배지</h3>

            <div className="flex justify-between items-center">
                {badgeIds.slice(0, 5).map((id) => (
                    <BadgeIcon key={id} id={id} size={64} />
                ))}

                {/* 부족한 칸은 placeholder */}
                {[...Array(Math.max(0, 5 - badgeIds.length))].map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="w-16 h-16 rounded-xl border border-white/20 bg-white/5"
                    ></div>
                ))}
            </div>
        </div>
    );
}
