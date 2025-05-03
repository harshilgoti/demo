"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import type { User } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  me: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData?.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authApi.login({ email, password });
      setUser(userData?.data);
      router.push("/dashboard");
      toast.success("Login successful", {
        description: "Welcome back!",
      });
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const me = async () => {
    setIsLoading(true);
    try {
      const userData = await authApi.me();
      setUser(userData?.data);
    } catch (error) {
      router.push("/login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await authApi.register({ fullName, email, password });
      toast.success("Registration successful", {
        description: "Please log in with your new account",
      });
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed", {
        description: "An error occurred during registration",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      router.push("/login");
      toast.success("Logout successful", {
        description: "You have been logged out",
      });
    } catch (error) {
      toast.error("Logout failed", {
        description: "An error occurred during logout",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, me }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
