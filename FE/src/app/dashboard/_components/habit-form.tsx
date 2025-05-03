import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { type HabitFormValues, habitSchema } from "@/lib/validation";
import Spinner from "@/app/(auth)/_components/spinner";
import { dashboardApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormType = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export const createHabit = async (title: string) => {
  const result = await dashboardApi.createHabit({
    title,
  });
  return result.data;
};

export const HabitForm = ({ open, setOpen }: FormType) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const useCreateHabit = () =>
    useMutation({
      mutationFn: createHabit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userHabits"] });
      },
    });

  const { mutate: createHabitMutate } = useCreateHabit();

  const defaultValue = {
    title: "",
  };

  const form = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: defaultValue,
    reValidateMode: "onChange",
  });

  const onSubmit = async ({ title }: HabitFormValues) => {
    setLoading(true);
    try {
      await createHabitMutate(title);
      setLoading(false);
      toast.success("Lead has been created successfully!");

      form.reset();

      setOpen(false);
    } catch (error) {
      form.reset();
      toast.error(`${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Habit</DialogTitle>
          </DialogHeader>{" "}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habit Title</FormLabel>
                        <FormControl>
                          <Input placeholder="title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-16"
                >
                  {loading ? <Spinner /> : "Save"}
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  );
};
