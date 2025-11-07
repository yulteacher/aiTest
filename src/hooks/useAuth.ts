// =============================
// 🔐 useAuth.ts (v7 — localData 연동 버전)
// 로그인 / 회원가입 / 로그아웃 / 프로필 수정
// =============================
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocalData } from "./useLocalData";
import type { User } from "../types/interfaces";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { get, set } = useLocalData(); // ✅ save → set 으로 변경

  // ✅ 로그인 유지
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ 로그인
  const login = (username: string, password: string): boolean => {
    const users: User[] = get("users");
    if (!users || users.length === 0) {
      toast.error("⚠️ 데이터 초기화 중입니다. 잠시 후 다시 시도해주세요.");
      return false;
    }

    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("currentUser", JSON.stringify(found));
      toast.success(`환영합니다, ${found.username}님 ⚾`);
      return true;
    } else {
      toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
      return false;
    }
  };

  // ✅ 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast("로그아웃 되었습니다 👋");
  };

  // ✅ 회원가입
  const signup = (
    newUser: Omit<User, "xp" | "level" | "badges" | "joinedAt">
  ) => {
    const users = get("users") || [];

    if (users.find((u) => u.username === newUser.username)) {
      toast.error("이미 존재하는 사용자입니다.");
      return false;
    }

    const created: User = {
      ...newUser,
      id: `u_${Date.now()}`,
      xp: 0,
      level: 1,
      badges: [],
      joinedAt: new Date().toISOString(),
    };

    const updated = [...users, created];
    set("users", updated);
    localStorage.setItem("currentUser", JSON.stringify(created));
    setUser(created);
    toast.success(`${created.username}님, 가입을 환영합니다! 🎉`);
    return true;
  };

  // ✅ 프로필 수정
  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

    const users = get("users") || [];
    const idx = users.findIndex((u) => u.id === updatedUserData.id);
    if (idx !== -1) {
      users[idx] = updatedUserData;
      set("users", users);
      toast.success("프로필이 저장되었습니다 ✅");
    }
  };

  return { user, login, logout, signup, updateUser, setUser };
};
