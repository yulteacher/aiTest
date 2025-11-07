// 🧠 useLocalData.ts (v6 단일형)
import { useState, useEffect } from "react";
import { generateDummyData } from "../data/generateDummy";

export const useLocalData = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [xpHistory, setXpHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("users")) {
      console.log("📦 users 없음 → generateDummyData 실행");
      generateDummyData();
    }
  }, []);

  useEffect(() => {
    const load = (key: string, setter: (v: any) => void) => {
      const val = localStorage.getItem(key);
      if (val) setter(JSON.parse(val));
    };
    ["currentUser", "users", "posts", "polls", "notifications", "xpHistory"].forEach((key) => {
      switch (key) {
        case "currentUser":
          load(key, setCurrentUser);
          break;
        case "users":
          load(key, setUsers);
          break;
        case "posts":
          load(key, setPosts);
          break;
        case "polls":
          load(key, setPolls);
          break;
        case "notifications":
          load(key, setNotifications); 
          break;
        case "xpHistory":
          load(key, setXpHistory);
          break;
      }
    });
  }, []);

  const get = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
  const set = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
  return {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    posts,
    setPosts,
    polls,
    setPolls,
    notifications,
    setNotifications,
    xpHistory,
    setXpHistory,
    get,
    set,
  };
};
