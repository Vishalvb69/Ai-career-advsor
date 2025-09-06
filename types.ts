
export interface Profile {
  interests: string;
  skills: string;
  isBeginner: boolean;
}

export interface Recommendation {
  career: string;
  explanation:string;
  skills: string[];
  famousPerson: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}