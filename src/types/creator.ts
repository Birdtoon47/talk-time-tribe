
export interface Creator {
  id: string;
  name: string;
  bio?: string;
  profilePic: string;
  ratings?: string;
  totalConsults?: string;
  ratePerMinute?: number;
  minuteIncrement?: number;
  isCreator?: boolean;
  balance?: number;
  totalWithdrawn?: number;
  currencyCode?: string;
}

export interface Service {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'text';
  duration: number;
  price: number;
  createdAt: number;
}

export interface ProfileData {
  name: string;
  bio: string;
  ratePerMinute: number;
  minuteIncrement: number;
  profilePic: string;
}
