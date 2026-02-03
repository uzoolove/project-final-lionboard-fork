import { User } from "@/types/user";

export interface Notification {
  _id: string;
  target_id: number;
  content: string;
  type?: string;
  channel?: string;
  extra?: {
    boardType: string;
    postId: string;
  };
  user: User;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewNotification {
  newNoti: Notification;
  list: Notification[];
}
