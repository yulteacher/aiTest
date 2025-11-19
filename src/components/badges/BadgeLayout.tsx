import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState, useEffect } from "react";
import BadgeIcon from "./BadgeIcon";

export default function BadgeLayout({
    top5Badges = [],
    showLabel = false,
    onUpdate,
    isDragging = false,
    setIsBadgeDragging,
}) {
    // Ensure we have exactly 5 badges
    const safeBadges = Array.isArray(top5Badges) ? top5Badges : [];
    const paddedBadges = [...safeBadges];
    while (paddedBadges.length < 5) {
        paddedBadges.push(null);
    }

    // Convert null values to placeholder IDs for @dnd-kit compatibility
    const processedBadges = paddedBadges.slice(0, 5).map((id, idx) => id || `empty-${idx}`);

    const [badges, setBadges] = useState(processedBadges);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const safeBadges = Array.isArray(top5Badges) ? top5Badges : [];
        const paddedBadges = [...safeBadges];
        while (paddedBadges.length < 5) {
            paddedBadges.push(null);
        }
        const processed = paddedBadges.slice(0, 5).map((id, idx) => id || `empty-${idx}`);
        setBadges(processed);
    }, [top5Badges]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        })
    );

    const handleDragStart = (e) => {
        setActiveId(e.active.id);
        setIsBadgeDragging?.(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        setActiveId(null);
        setIsBadgeDragging?.(false);

        if (!over) return;

        const oldIndex = badges.indexOf(active.id);
        const newIndex = badges.indexOf(over.id);

        if (oldIndex !== newIndex) {
            const updated = arrayMove(badges, oldIndex, newIndex);
            setBadges(updated);

            // Convert back: empty-X → null
            const convertedBadges = updated.map(id => id.startsWith('empty-') ? null : id);

            onUpdate({
                mainBadge: convertedBadges[0],
                slots: convertedBadges.slice(1),
            });
        }
    };

    return (
        <div className="relative w-full" style={{ height: 230 }}>

            {/* ⭐ 메인 자리를 2×2 고정으로 유지 */}
            <div
                className="absolute z-0 bg-transparent"
                style={{
                    left: 10,
                    top: 10,
                    width: "calc(50% - 10px)",
                    height: "calc(50% - 10px)",
                }}
            />

            {/* ⭐ 메인 드래그 중 강조 */}
            {activeId === badges[0] && (
                <div
                    className="absolute z-10 border-2 border-sky-400 bg-sky-100/40 dark:bg-sky-900/40 rounded-2xl"
                    style={{
                        left: 10,
                        top: 10,
                        width: "calc(50% - 10px)",
                        height: "100%",
                    }}
                />
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={badges}>
                    <div
                        className="absolute inset-0"
                        style={{
                            display: "grid",
                            gridTemplateAreas: `
                                "main main r1 r2"
                                "main main r3 r4"
                            `,
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            gap: 10,
                            padding: 10,
                            pointerEvents: isDragging ? "none" : "auto",
                        }}
                    >
                        {badges.map((id, index) => (
                            <BadgeItem
                                key={id}
                                id={id}
                                index={index}
                                isMain={index === 0}
                                showLabel={showLabel}
                                isActive={id === activeId}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

function BadgeItem({ id, index, isMain, showLabel, isActive }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style: any = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    /** ⭐ 메인: grid-area 강제 */
    if (isMain) {
        style.gridArea = "main";

        // 드래그 중 → 1×1로 축소
        if (isActive) {
            style.gridColumn = "auto";
            style.gridRow = "auto";
        }
    } else {
        // 오른쪽 슬롯 4개 고정
        const areas = ["r1", "r2", "r3", "r4"];
        style.gridArea = areas[index - 1];
    }

    // Check if this is an empty slot
    const isEmpty = id.startsWith('empty-');
    const actualBadgeId = isEmpty ? null : id;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={`
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow
                rounded-2xl flex items-center justify-center
                transition-all select-none
                ${isMain ? "z-20" : ""}
                ${isActive ? "opacity-50 scale-105" : ""}
            `}
        >
            {actualBadgeId ? (
                <BadgeIcon
                    badgeId={actualBadgeId}
                    size={isMain ? "lg" : "md"}
                    showLabel={showLabel}
                />
            ) : (
                <span className="text-gray-400 text-xs">
                    {isMain ? "대표" : `Slot ${index}`}
                </span>
            )}
        </div>
    );
}
