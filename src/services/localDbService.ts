import { v4 as uuidv4 } from 'uuid';
import seedData from '../../db.json';
import type {
  LocalDatabase,
  User,
  PublicUser,
  ExchangeItem,
  Community,
  CommunityPost,
  CommunityEvent,
  HubLocation,
  CommunityImpact,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';

const DB_STORAGE_KEY = 'unclutter_db';
const SESSION_KEY = 'unclutter_session';

// ─── Database Initialisation ──────────────────────────────────────────────────

function loadDatabase(): LocalDatabase {
  const stored = localStorage.getItem(DB_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as LocalDatabase;
  }
  const initialDb = seedData as LocalDatabase;
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(initialDb));
  return initialDb;
}

function saveDatabase(db: LocalDatabase): void {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

// ─── Auth Operations ──────────────────────────────────────────────────────────

export function loginUser(credentials: LoginCredentials): PublicUser {
  const db = loadDatabase();
  const foundUser = db.users.find(
    (user) =>
      user.email.toLowerCase() === credentials.email.toLowerCase() &&
      user.passwordHash === credentials.password
  );

  if (!foundUser) {
    throw new Error('Invalid email or password.');
  }

  const token = uuidv4();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: foundUser.id, token }));

  const { passwordHash: _omit, ...publicUser } = foundUser;
  return publicUser;
}

export function registerUser(credentials: RegisterCredentials): PublicUser {
  const db = loadDatabase();
  const emailExists = db.users.some(
    (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: uuidv4(),
    email: credentials.email,
    passwordHash: credentials.password,
    name: credentials.name,
    avatar: '',
    bio: '',
    location: credentials.location,
    joinedAt: new Date().toISOString(),
    stats: { itemsGiven: 0, itemsReceived: 0, co2Saved: 0 },
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = uuidv4();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, token }));

  const { passwordHash: _omit, ...publicUser } = newUser;
  return publicUser;
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function restoreSession(): { user: PublicUser; token: string } | null {
  const sessionRaw = localStorage.getItem(SESSION_KEY);
  if (!sessionRaw) return null;

  const session = JSON.parse(sessionRaw) as { userId: string; token: string };
  const db = loadDatabase();
  const foundUser = db.users.find((user) => user.id === session.userId);
  if (!foundUser) return null;

  const { passwordHash: _omit, ...publicUser } = foundUser;
  return { user: publicUser, token: session.token };
}

// ─── Give & Receive (Exchange Items) ─────────────────────────────────────────

export function getExchangeItems(): ExchangeItem[] {
  return loadDatabase().exchangeItems;
}

export function addExchangeItem(item: Omit<ExchangeItem, 'id' | 'createdAt' | 'likes'>): Promise<ExchangeItem> {
  const db = loadDatabase();
  const newItem: ExchangeItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  db.exchangeItems.unshift(newItem);
  saveDatabase(db);
  return Promise.resolve(newItem);
}

export function likeExchangeItem(itemId: string): Promise<void> {
  const db = loadDatabase();
  const item = db.exchangeItems.find((i) => i.id === itemId);
  if (item) {
    item.likes += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}

// ─── Communities ──────────────────────────────────────────────────────────────

export function getCommunities(): Community[] {
  return loadDatabase().communities;
}

export function joinCommunity(communityId: string): Promise<void> {
  const db = loadDatabase();
  const community = db.communities.find((c) => c.id === communityId);
  if (community) {
    community.members += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function getCommunityPosts(communityId?: string): CommunityPost[] {
  const posts = loadDatabase().communityPosts ?? [];
  if (communityId) return posts.filter((p) => p.communityId === communityId);
  return posts;
}

export function addCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes'>): Promise<CommunityPost> {
  const db = loadDatabase();
  const newPost: CommunityPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  if (!db.communityPosts) db.communityPosts = [];
  db.communityPosts.unshift(newPost);
  saveDatabase(db);
  return Promise.resolve(newPost);
}

export function likeCommunityPost(postId: string): Promise<void> {
  const db = loadDatabase();
  const post = (db.communityPosts ?? []).find((p) => p.id === postId);
  if (post) {
    post.likes += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}

// ─── Events ──────────────────────────────────────────────────────────────────

export function getEvents(): CommunityEvent[] {
  return loadDatabase().events ?? [];
}

export function joinEvent(eventId: string): Promise<void> {
  const db = loadDatabase();
  const event = (db.events ?? []).find((e) => e.id === eventId);
  if (event && event.attendees < event.maxCapacity) {
    event.attendees += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}

// ─── Hub Locations ───────────────────────────────────────────────────────────

export function getHubLocations(): HubLocation[] {
  return (loadDatabase().hubLocations ?? []).filter((h) => h.isActive);
}

// ─── Community Impact ────────────────────────────────────────────────────────

export function getCommunityImpact(): CommunityImpact {
  const db = loadDatabase();
  const totalItemsCirculated = db.exchangeItems.length * 2;
  const totalMembers = db.communities.reduce((sum, c) => sum + c.members, 0);
  const totalCo2Saved = db.users.reduce((sum, u) => sum + u.stats.co2Saved, 0);
  const totalEvents = (db.events ?? []).length;
  const activeHubs = (db.hubLocations ?? []).filter((h) => h.isActive).length;

  return {
    totalItemsCirculated,
    totalMembers,
    totalCo2Saved,
    totalEvents,
    activeHubs,
  };
}
