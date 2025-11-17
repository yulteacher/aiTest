// React Widget Clone Layout (iOS 스타일 대시보드 위젯)
// 파일 구조 예시: src/App.jsx 단일 파일 버전
// 실제 클론 시 컴포넌트를 분리하면 더 좋음

import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./widgets.css";

export default function TestPage() {
    const [gridWidth, setGridWidth] = useState(window.innerWidth);
    const [rowHeight, setRowHeight] = useState(30);
    useEffect(() => {
        function updateWidth() {
            const wrap = document.querySelector(".wrap");
            if (wrap && wrap.clientWidth > 0) {
                setGridWidth(wrap.clientWidth);
            }
        }
        function updateHeight() {
            // wrap 높이 기준 혹은 화면 높이 기준
            setRowHeight(window.innerHeight * 0.04); // 4vh
        }
        updateWidth();
        updateHeight();
        window.addEventListener("resize", () => { updateWidth(); updateHeight(); });
        return () => window.removeEventListener("resize", () => { updateWidth(); updateHeight(); });
    }, []);

    const layout = [
        { i: "w1", x: 0, y: 0, w: 12, h: 4 },
        { i: "w2", x: 0, y: 4, w: 12, h: 5 },
        { i: "w3", x: 0, y: 9, w: 12, h: 4 },
        { i: "w4", x: 0, y: 13, w: 12, h: 4 },
    ];

    return (
        <div className="wrap">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={rowHeight}
                width={gridWidth}
                isResizable={false}
                draggableCancel=".no-drag"
            >
                <div key="w1" className="widget glass"><HeaderWidget /></div>
                <div key="w2" className="widget glass"><ProgressWidget /></div>
                <div key="w3" className="widget glass"><WorkspaceWidget /></div>
                <div key="w4" className="widget glass"><TodoWidget /></div>
            </GridLayout>
        </div>
    );
}


// =========================
// 개별 위젯 컴포넌트
// =========================

function HeaderWidget() {
    return (
        <div className="headerWidget widgerbox">
            <div className="mini-icon" />
            <h3 className="title">Chat에게 물어보세요</h3>
            <div className="icons">
                <div className="ic" />
                <div className="ic" />
                <div className="ic" />
            </div>
        </div>
    );
}

function ProgressWidget() {
    return (
        <div className="progressWidget widgerbox" >
            <h4>B팀 프로젝트 진행률</h4>

            <div className="progressBox">
                <div className="circle">
                    <div className="percent">40%</div>
                </div>

                <div className="nums">
                    <div>
                        <strong>4</strong>
                        <p>완료됨</p>
                    </div>
                    <div>
                        <strong>6</strong>
                        <p>진행중</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WorkspaceWidget() {
    return (
        <div className="workspaceWidget widgerbox">
            <h4>워크스페이스 팀</h4>

            <div className="teamList">
                <div className="teamCircle" /><p>A팀</p>
                <div className="teamCircle" /><p>B팀</p>
                <div className="teamCircle" /><p>C팀</p>
                <div className="teamCircle" /><p>D팀</p>
            </div>
        </div>
    );
}

function TodoWidget() {
    return (
        <div className="todoWidget widgerbox">
            <div className="dateBox">
                <div className="day">2025. 08</div>
                <div className="big">08</div>
                <div className="weekday">금요일</div>
            </div>

            <div className="todoList">
                <h4>TO DO</h4>
                <ul>
                    <li>오늘 일정목록입니다.</li>
                    <li>오늘 일정목록입니다.</li>
                </ul>
            </div>
        </div>
    );
}
