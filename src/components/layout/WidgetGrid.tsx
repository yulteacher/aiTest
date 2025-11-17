// src/components/layout/WidgetGrid.tsx
import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface WidgetGridProps {
    storageKey: string;       // unique ID per page (예: "badges-grid", "mypage-grid")
    children: React.ReactNode[];
    cols?: number;
    rowHeight?: number;
    width?: number;
}

export default function WidgetGrid({
    storageKey,
    children,
    cols = 12,
    rowHeight = 30,
    width = 360,
}: WidgetGridProps) {

    // -----------------------------
    // 1) 저장된 레이아웃 불러오기
    // -----------------------------
    const loadSavedLayout = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Layout load error:", e);
            return null;
        }
    };

    // 기본 layout 자동 생성
    const generateDefaultLayout = () =>
        children.map((_, i) => ({
            i: `w${i}`,
            x: 0,
            y: i * 3,
            w: 12,
            h: 3,
        }));

    const [layout, setLayout] = useState(loadSavedLayout() || generateDefaultLayout());

    // -----------------------------
    // 2) 레이아웃 변경 시 저장
    // -----------------------------
    const handleLayoutChange = (newLayout: any) => {
        setLayout(newLayout);
        localStorage.setItem(storageKey, JSON.stringify(newLayout));
    };

    return (
        <GridLayout
            className="layout"
            layout={layout}
            cols={cols}
            rowHeight={rowHeight}
            width={width}
            onLayoutChange={handleLayoutChange}
            draggableCancel=".no-drag"
            isResizable={true}
            isDraggable={true}
        >
            {children.map((child, i) => (
                <div key={`w${i}`} className="widget-wrapper">
                    {child}
                </div>
            ))}
        </GridLayout>
    );
}
