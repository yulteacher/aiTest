// src/hooks/useAppData.ts
import { useState, useEffect } from "react";
import { initLocalData } from "../data/initLocalData";
import type { Post, Poll, User } from "../types/interfaces";

export const useAppData = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const { users, posts, polls } = initLocalData();
        setUsers(users);
        setPosts(posts);
        setPolls(polls);

        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
    }, []);

    const refreshLocalData = () => {
        setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
        setPosts(JSON.parse(localStorage.getItem("posts") || "[]"));
        setPolls(JSON.parse(localStorage.getItem("polls") || "[]"));
    };

    return {
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        posts,
        setPosts,
        polls,
        setPolls,
        refreshLocalData,
    };
};
