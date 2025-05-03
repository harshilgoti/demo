"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { dashboardApi } from "@/lib/api";
import { Input } from "@/components/ui/input";

type FormType = {
  open: boolean;
  setOpen: (val: boolean) => void;
  habitId: string;
};

export const HabitTracker = ({ open, setOpen, habitId }: FormType) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<any>(null);

  const onSubmit = async (data: Date) => {
    const date = new Date(data);
    const formatted = date.toISOString().split("T")[0];

    setLoading(true);
    try {
      const data = await dashboardApi.getHabitStatus(habitId, formatted);
      setDate(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmitDate = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="min-w-3xl">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Habit Tracker</DialogTitle>
          </DialogHeader>{" "}
          <div className="flex flex-col items-center justify-center p-4 bg-white">
            <div className="w-full p-4 h-36 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <span>Please select date</span>
              <Input
                placeholder="title"
                type="date"
                onChange={(e) => {
                  e.stopPropagation();
                  handleSubmitDate(e);
                }}
                onClick={(e) => e.stopPropagation()}
              />

              {loading
                ? "Checking..."
                : date && (
                    <div className="my-4 text-md">
                      Status: {date?.isCompleted ? "Completed" : "Pending"}
                    </div>
                  )}
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};
