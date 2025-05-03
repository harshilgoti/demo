"use client";
import { DataTable } from "./_components/data-table";
import { useRouter } from "next/navigation";
import { useAuth } from "../(auth)/_components/auth-provider";
import { dashboardApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Habit } from "@/lib/types";
import { useEffect } from "react";

export default function Page() {
  const { data = [] } = useQuery<Habit[]>({
    queryKey: ["userHabits"],
    queryFn: dashboardApi.getAllHabits,
  });

  const router = useRouter();
  const { user, me } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await me();
      if (!user) {
        router.push("/login");
      } else {
        checkAuth();
      }
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <DataTable data={data || []} />
      </div>
    </div>
  );
}
