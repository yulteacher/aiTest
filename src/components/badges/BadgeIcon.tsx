// src/components/badges/BadgeIcon.tsx

import React from "react";
import { BADGES } from "../../data/badges";

interface Props {
    id: string;        // "level_3", "comment_1" ...
    size?: number;     // default: 48
}

export default function BadgeIcon({ id, size = 48 }: Props) {
    const badge = BADGES.find((b) => b.id === id);

    if (!badge) return null;

    return (
        <img
            src={badge.icon}
            alt={badge.name}
            width={size}
            height={size}
            className="badge-icon"
        />
    );
}
