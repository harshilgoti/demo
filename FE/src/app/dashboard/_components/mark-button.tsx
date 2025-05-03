import { Button } from "@/components/ui/button";
import Spinner from "@/app/(auth)/_components/spinner";
import { dashboardApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MarkAsDoneButtonProps = {
  id: string;
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const markHabitAsDone = async (id: string) => {
  const today = getTodayDate();
  return await dashboardApi.markAsDone(id, today);
};

export const MarkAsDoneButton = ({ id }: MarkAsDoneButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate: markAsDoneHabit, isPending } = useMutation({
    mutationFn: () => markHabitAsDone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userHabits"] });
    },
  });

  return (
    <Button onClick={() => markAsDoneHabit()} disabled={isPending}>
      {isPending ? <Spinner /> : "Mark as Done"}
    </Button>
  );
};
