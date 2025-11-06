// =============================
// 🔐 useAuth.ts
// 로그인 / 회원가입 / 로그아웃 관리 훅 (수정 버전)
// =============================
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocalData } from "./useLocalData";
import type { User } from "../types/interfaces";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { get, set, registerUser, initData } = useLocalData();

  // ✅ 데이터 초기화 자동 보정 (없으면 새로 주입)
  useEffect(() => {
    const users = get("users");
    if (!users || users.length === 0) {
      console.log("⚙️ useAuth: users 데이터 없음 → initData() 실행");
      initData();
    }
  }, []);

  // ✅ 로그인 상태 유지
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

  // ✅ 회원가입 완료
  const signup = (newUser: Omit<User, "xp" | "level" | "badges" | "joinedAt">) => {
    registerUser(newUser);
    const users = get("users");
    const created = users.find((u) => u.username === newUser.username);
    if (created) {
      setUser(created);
      localStorage.setItem("currentUser", JSON.stringify(created));
      toast.success(`${created.username}님, 가입을 환영합니다! 🎉`);
    }
  };

  // ✅ 프로필 업데이트
  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
    const users = get("users");
    const idx = users.findIndex((u) => u.id === updatedUserData.id);
    if (idx !== -1) {
      users[idx] = updatedUserData;
      set("users", users);
    }
  };

  return { user, login, logout, signup, updateUser, setUser };
};
