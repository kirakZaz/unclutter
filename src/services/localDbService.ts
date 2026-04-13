import { v4 as uuidv4 } from 'uuid';
import seedData from '../../db.json';
import type {
  LocalDatabase,
  User,
  PublicUser,
  ExchangeItem,
  Community,
  CommunityPost,
  Challenge,
  Donation,
  SupportPost,
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

// ─── Exchange Items ───────────────────────────────────────────────────────────

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

// ─── Challenges ───────────────────────────────────────────────────────────────

export function getChallenges(): Challenge[] {
  return loadDatabase().challenges;
}

export function joinChallenge(challengeId: string): Promise<void> {
  const db = loadDatabase();
  const challenge = db.challenges.find((c) => c.id === challengeId);
  if (challenge) {
    challenge.participants += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}

// ─── Donations ────────────────────────────────────────────────────────────────

export function getDonations(): Donation[] {
  return loadDatabase().donations;
}

export function addDonation(donation: Omit<Donation, 'id' | 'createdAt'>): Promise<Donation> {
  const db = loadDatabase();
  const newDonation: Donation = {
    ...donation,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  db.donations.unshift(newDonation);
  saveDatabase(db);
  return Promise.resolve(newDonation);
}

// ─── Support Posts ────────────────────────────────────────────────────────────

export function getSupportPosts(): SupportPost[] {
  return loadDatabase().supportPosts;
}

export function addSupportPost(post: Omit<SupportPost, 'id' | 'createdAt' | 'replies' | 'likes'>): Promise<SupportPost> {
  const db = loadDatabase();
  const newPost: SupportPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    replies: 0,
    likes: 0,
  };
  db.supportPosts.unshift(newPost);
  saveDatabase(db);
  return Promise.resolve(newPost);
}

export function likeSupportPost(postId: string): Promise<void> {
  const db = loadDatabase();
  const post = db.supportPosts.find((p) => p.id === postId);
  if (post) {
    post.likes += 1;
    saveDatabase(db);
  }
  return Promise.resolve();
}
