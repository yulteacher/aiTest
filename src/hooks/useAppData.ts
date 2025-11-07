// src/hooks/useAppData.ts
import { useState, useEffect } from "react";
import { initLocalData } from "../utils/initLocalData";

export const useAppData = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [polls, setPolls] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // ✅ 초기화 + 데이터 로드
    useEffect(() => {
        initLocalData();
        setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
        setPosts(JSON.parse(localStorage.getItem("posts") || "[]"));
        setPolls(JSON.parse(localStorage.getItem("polls") || "[]"));
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null"));
    }, []);

    // ✅ 변경 시 동기화
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        localStorage.setItem("polls", JSON.stringify(polls));
    }, [polls]);

    useEffect(() => {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }, [currentUser]);

    // ✅ 유틸 함수: 특정 유저 업데이트
    const updateUser = (updatedUser) => {
        const newList = users.map(u => u.username === updatedUser.username ? updatedUser : u);
        setUsers(newList);
        if (currentUser?.username === updatedUser.username) setCurrentUser(updatedUser);
    };

    // ✅ 게시글 추가
    const addPost = (post) => {
        setPosts(prev => [...prev, post]);
    };

    // ✅ 투표 추가/갱신
    const updatePoll = (poll) => {
        const newPolls = polls.map(p => p.id === poll.id ? poll : p);
        setPolls(newPolls);
    };

    return {
        users, posts, polls, currentUser,
        setUsers, setPosts, setPolls, setCurrentUser,
        updateUser, addPost, updatePoll,
    };
};
