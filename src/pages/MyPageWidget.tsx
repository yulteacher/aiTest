import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import MyPage from "./MyPage"; // 기존 MyPage 기능/로직 모두 담긴 파일

export default function MyPageWidget(props) {
    const [gridWidth, setGridWidth] = useState(window.innerWidth);

    useEffect(() => {
        const wrap = document.querySelector(".mypage-wrap");

        const updateWidth = () => {
            if (wrap?.clientWidth > 0) {
                setGridWidth(wrap.clientWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // 위젯 배치
    const layout = [
        { i: "profile", x: 0, y: 0, w: 12, h: 12 },
        { i: "menu", x: 0, y: 12, w: 12, h: 4 },
        { i: "badge", x: 0, y: 16, w: 12, h: 5 },
        { i: "level", x: 0, y: 21, w: 12, h: 4 },
        { i: "notifications", x: 0, y: 25, w: 12, h: 16 },
    ];

    return (
        <div className="mypage-wrap px-2">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={28}
                width={gridWidth}
                isResizable={false}
                draggableCancel=".no-drag"
                margin={[10, 10]}
            >
                {/* ====================== */}
                {/* ① 프로필 위젯 */}
                {/* ====================== */}
                <div key="profile" className="widget glass rounded-2xl overflow-hidden p-1">
                    <MyPage
                        {...props}
                        showSection="profile"
                        suppressOuterUI={true}
                    />
                </div>

                {/* ====================== */}
                {/* ② 메뉴 위젯 */}
                {/* ====================== */}
                <div key="menu" className="widget glass rounded-2xl overflow-hidden">
                    <MyPage
                        {...props}
                        showSection="menu"
                        suppressOuterUI={true}
                    />
                </div>

                {/* ====================== */}
                {/* ③ 배지 위젯 */}
                {/* ====================== */}
                <div key="badge" className="widget glass rounded-2xl overflow-hidden">
                    <MyPage
                        {...props}
                        showSection="badge"
                        suppressOuterUI={true}
                    />
                </div>

                {/* ====================== */}
                {/* ④ 레벨 위젯 */}
                {/* ====================== */}
                <div key="level" className="widget glass rounded-2xl overflow-hidden">
                    <MyPage
                        {...props}
                        showSection="level"
                        suppressOuterUI={true}
                    />
                </div>

                {/* ====================== */}
                {/* ⑤ 알림 위젯 */}
                {/* ====================== */}
                <div key="notifications" className="widget glass rounded-2xl overflow-hidden">
                    <MyPage
                        {...props}
                        showSection="notifications"
                        suppressOuterUI={true}
                    />
                </div>
            </GridLayout>
        </div>
    );
}
