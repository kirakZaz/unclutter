// ─── Auth & User ──────────────────────────────────────────────────────────────

export interface UserStats {
  itemsGiven: number;
  itemsReceived: number;
  co2Saved: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinedAt: string;
  stats: UserStats;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface AuthState {
  currentUser: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  location: string;
}

// ─── Exchange ─────────────────────────────────────────────────────────────────

export type ExchangeType = 'swap' | 'free' | 'sell';
export type ItemStatus = 'available' | 'reserved' | 'completed';
export type ItemCategory = 'fashion' | 'books' | 'kitchen' | 'electronics' | 'furniture' | 'toys' | 'sports' | 'other';

export interface ExchangeItem {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: ExchangeType;
  images: string[];
  location: string;
  createdAt: string;
  status: ItemStatus;
  likes: number;
}

// ─── Communities ──────────────────────────────────────────────────────────────

export type CommunityCategory = 'local' | 'repair' | 'lifestyle' | 'fashion' | 'food' | 'general';

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  members: number;
  location: string;
  createdAt: string;
  isPublic: boolean;
  recentActivity?: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  communityName: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: string;
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeCategory = 'declutter' | 'consumption' | 'fashion' | 'food' | 'digital';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  duration: number;
  participants: number;
  startDate: string;
  endDate: string;
  badge: string;
  difficulty: ChallengeDifficulty;
  isActive: boolean;
}

// ─── Donations ────────────────────────────────────────────────────────────────

export type DonationUrgency = 'low' | 'medium' | 'high';
export type DonationStatus = 'available' | 'claimed' | 'completed';

export interface Donation {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  location: string;
  organization: string;
  createdAt: string;
  status: DonationStatus;
  urgency: DonationUrgency;
}

// ─── Support ──────────────────────────────────────────────────────────────────

export interface SupportPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  tags: string[];
  replies: number;
  likes: number;
  createdAt: string;
}

// ─── Database ─────────────────────────────────────────────────────────────────

export interface LocalDatabase {
  users: User[];
  exchangeItems: ExchangeItem[];
  communities: Community[];
  communityPosts: CommunityPost[];
  challenges: Challenge[];
  donations: Donation[];
  supportPosts: SupportPost[];
}
