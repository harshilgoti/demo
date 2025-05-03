export interface User {
  id: string;
  name: string;
  email: string;
  fullName: string;
}

export interface Habit {
  id: string;
  title: string;
  isTodayCompleted: boolean;
  createdBy: User;
}
