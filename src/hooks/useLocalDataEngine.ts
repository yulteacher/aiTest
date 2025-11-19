// src/hooks/useLocalDataEngine.ts
import { useState, useEffect } from "react";
import { generateDummyData } from "../data/generateDummy";
import type { User, Post, Poll, Comment } from "../types/interfaces";
import { loadUser } from "../context/AppDataContext";

export function useLocalDataEngine() {
    const [currentUser, setCurrentUserRaw] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);

    /* ----------------------------------------------
     * 🚀 초기 로드 : data + 전체 유저 loadUser 보정
     * ---------------------------------------------- */
    useEffect(() => {
        // dummy 초기화
        if (!localStorage.getItem("users")) {
            const { users, posts, polls } = generateDummyData();
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("posts", JSON.stringify(posts));
            localStorage.setItem("polls", JSON.stringify(polls));
        }

        // users → loadUser 적용
        const loadedUsers = JSON.parse(localStorage.getItem("users") || "[]")
            .map(loadUser);
        setUsers(loadedUsers);

        // posts/polls는 loadUser로 보정된 사용자 데이터 기준으로 reload해야 함
        setPosts(JSON.parse(localStorage.getItem("posts") || "[]"));
        setPolls(JSON.parse(localStorage.getItem("polls") || "[]"));

        // currentUser load
        const saved = localStorage.getItem("currentUser");
        if (saved) setCurrentUserRaw(loadUser(JSON.parse(saved)));
    }, []);

    /* ----------------------------------------------
     * 🛠 공용 저장 함수
     * ---------------------------------------------- */
    const save = (key: string, value: any) =>
        localStorage.setItem(key, JSON.stringify(value));

    /* ----------------------------------------------
     * 🔥 currentUser setter (강력 보정)
     * ---------------------------------------------- */
    const setCurrentUser = (u: User | null) => {
        if (!u) {
            setCurrentUserRaw(null);
            localStorage.removeItem("currentUser");
            return;
        }

        const fixed = loadUser(u);

        setCurrentUserRaw(fixed);
        save("currentUser", fixed);

        // users 배열 자동 업데이트
        setUsers(prev => {
            const updated = prev.map(user =>
                user.id === fixed.id ? fixed : user
            );
            save("users", updated);
            return updated;
        });
    };

    /* ----------------------------------------------
     * 📝 POST CRUD (+ feedCount 증가)
     * ---------------------------------------------- */
    const addPost = (post: Post) => {
        const updated = [post, ...posts];
        setPosts(updated);
        save("posts", updated);

        // ⭐ feedCount 증가 → 유저 업데이트
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                feedCount: (currentUser.feedCount ?? 0) + 1,
            });
        }
    };

    const updatePost = (updatedPost: Post) => {
        const updated = posts.map((p) =>
            p.id === updatedPost.id ? updatedPost : p
        );
        setPosts(updated);
        save("posts", updated);
    };

    const deletePost = (postId: string) => {
        const updated = posts.filter((p) => p.id !== postId);
        setPosts(updated);
        save("posts", updated);
    };

    /* ----------------------------------------------
     * 💬 COMMENT CRUD (+ commentCount 증가)
     * ---------------------------------------------- */
    const addComment = (postId: string, comment: Comment) => {
        const updated = posts.map((p) =>
            p.id === postId
                ? { ...p, commentsList: [...p.commentsList, comment] }
                : p
        );
        setPosts(updated);
        save("posts", updated);

        // ⭐ commentCount 증가
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                commentCount: (currentUser.commentCount ?? 0) + 1,
            });
        }
    };

    const updateComment = (postId: string, commentId: string, updatedComment: Comment) => {
        const updated = posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    commentsList: post.commentsList?.map(c =>
                        c.id === commentId ? { ...c, ...updatedComment } : c
                    ),
                }
                : post
        );
        setPosts(updated);
        save("posts", updated);
    };

    const deleteComment = (postId: string, commentId: string) => {
        const updated = posts.map((p) =>
            p.id === postId
                ? {
                    ...p,
                    commentsList: p.commentsList.filter((c) => c.id !== commentId),
                }
                : p
        );
        setPosts(updated);
        save("posts", updated);
    };

    /* ----------------------------------------------
     * 🗳 POLL CRUD (+ voteCount 증가)
     * ---------------------------------------------- */
    const addPoll = (poll: Poll) => {
        const updated = [poll, ...polls];
        setPolls(updated);
        save("polls", updated);
    };

    const updatePoll = (updatedPoll: Poll) => {
        const updated = polls.map((p) =>
            p.id === updatedPoll.id ? updatedPoll : p
        );
        setPolls(updated);
        save("polls", updated);
    };

    const deletePoll = (pollId: string) => {
        const updated = polls.filter((p) => p.id !== pollId);
        setPolls(updated);
        save("polls", updated);
    };

    /* ----------------------------------------------
     * 🏁 반환
     * ---------------------------------------------- */
    return {
        currentUser,
        setCurrentUser,

        users,
        posts,
        polls,

        addPost,
        updatePost,
        deletePost,

        addComment,
        updateComment,
        deleteComment,

        addPoll,
        updatePoll,
        deletePoll,
    };
}
