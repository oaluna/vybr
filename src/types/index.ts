export interface Match {
  id: string;
  name: string;
  age: number;
  avatar: string;
  compatibility: number;
  interests: string[];
  lastActive: string;
  bio: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'match' | 'message';
  matchId: string;
  text: string;
}
