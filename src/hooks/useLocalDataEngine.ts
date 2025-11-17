// src/hooks/useLocalDataEngine.ts
import { useState, useEffect } from "react";
import { generateDummyData } from "../data/generateDummy";
import type { User, Post, Poll, Comment } from "../types/interfaces";

export function useLocalDataEngine(): {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;

    users: User[];
    posts: Post[];
    polls: Poll[];

    addPost: (post: Post) => void;
    updatePost: (post: Post) => void;
    deletePost: (postId: string) => void;

    addComment: (postId: string, comment: Comment) => void;
    updateComment: (postId: string, commentId: string, updatedComment: Comment) => void;
    deleteComment: (postId: string, commentId: string) => void;

    addPoll: (poll: Poll) => void;
    updatePoll: (poll: Poll) => void;
    deletePoll: (pollId: string) => void;
} {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);

    /* 최초 로드 */
    useEffect(() => {
        if (!localStorage.getItem("users")) {
            const { users, posts, polls } = generateDummyData();
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("posts", JSON.stringify(posts));
            localStorage.setItem("polls", JSON.stringify(polls));
        }

        setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
        setPosts(JSON.parse(localStorage.getItem("posts") || "[]"));
        setPolls(JSON.parse(localStorage.getItem("polls") || "[]"));

        const saved = localStorage.getItem("currentUser");
        if (saved) setCurrentUser(JSON.parse(saved));
    }, []);

    const save = (key: string, value: any) =>
        localStorage.setItem(key, JSON.stringify(value));

    /* -------------------------
     * 📝 POST CRUD
     * ------------------------- */

    const addPost = (post: Post) => {
        const updated = [post, ...posts];
        setPosts(updated);
        save("posts", updated);
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

    /* -------------------------
     * 💬 COMMENT CRUD
     * ------------------------- */

    const addComment = (postId: string, comment: Comment) => {
        const updated = posts.map((p) =>
            p.id === postId
                ? { ...p, commentsList: [...p.commentsList, comment] }
                : p
        );
        setPosts(updated);
        save("posts", updated);
    };

    const updateComment = (
        postId: string,
        commentId: string,
        updatedComment: Comment
    ) => {
        setPosts(prev =>
            prev.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        commentsList: post.commentsList?.map(c =>
                            c.id === commentId ? { ...c, ...updatedComment } : c
                        ),
                    }
                    : post
            )
        );
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

    /* -------------------------
     * 🗳 POLL CRUD
     * ------------------------- */

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
