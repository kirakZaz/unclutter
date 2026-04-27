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

// ─── Give & Receive (Exchange) ───────────────────────────────────────────────

export type ExchangeType = 'free' | 'swap';
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

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventCategory = 'swap-meet' | 'repair-cafe' | 'skill-share' | 'workshop' | 'social';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  address: string;
  organizer: string;
  attendees: number;
  maxCapacity: number;
  isFree: boolean;
  communityId?: string;
  communityName?: string;
}

// ─── Hub Locations ───────────────────────────────────────────────────────────

export type HubType = 'drop-off' | 'charity-partner' | 'repair-cafe' | 'circular-van';

export interface HubLocation {
  id: string;
  name: string;
  type: HubType;
  description: string;
  address: string;
  suburb: string;
  hours: string;
  acceptedItems: string[];
  isActive: boolean;
}

// ─── Community Impact ────────────────────────────────────────────────────────

export interface CommunityImpact {
  totalItemsCirculated: number;
  totalMembers: number;
  totalCo2Saved: number;
  totalEvents: number;
  activeHubs: number;
}

// ─── Database ─────────────────────────────────────────────────────────────────

export interface LocalDatabase {
  users: User[];
  exchangeItems: ExchangeItem[];
  communities: Community[];
  communityPosts: CommunityPost[];
  events: CommunityEvent[];
  hubLocations: HubLocation[];
}
