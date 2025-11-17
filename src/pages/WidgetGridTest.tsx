import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

const initialLayout = [
    { i: "badge_1", x: 0, y: 0, w: 1, h: 1 },
    { i: "badge_2", x: 1, y: 0, w: 1, h: 1 },
    { i: "badge_3", x: 2, y: 0, w: 1, h: 1 },
];

export default function WidgetGridTest() {
    return (
        <div style={{ width: "100%", padding: 20 }}>
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 6, md: 6, sm: 4, xs: 2, xxs: 1 }}
                rowHeight={80}
                compactType={null}     // ← 이거 매우 중요 (자동 정렬 방지)
                preventCollision={false}
            >
                {initialLayout.map((item) => (
                    <div key={item.i} className="bg-white shadow rounded">
                        <img src={`/badges/level_1.svg`} width="64" />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
