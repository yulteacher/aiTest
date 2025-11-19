// BadgeWidgetSmall.tsx
import React from "react";
import BadgeIcon from "./BadgeIcon";

interface Props {
    badgeIds: string[];
}

export default function BadgeWidgetSmall({ badgeIds }: Props) {
    return (
        <div className="badge-widget-small p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
            <h4 className="text-white text-md font-semibold mb-2">보유 배지</h4>

            <div className="grid grid-cols-5 gap-2">
                {badgeIds.length === 0 && (
                    <div className="text-white/70 col-span-5 text-center py-4 text-sm">
                        아직 배지가 없습니다.
                    </div>
                )}

                {badgeIds.slice(0, 5).map((id) => (
                    <BadgeIcon key={id} badgeId={id} size="lg" showLabel />
                ))}
            </div>
        </div>
    );
}
