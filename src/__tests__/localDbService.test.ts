import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loginUser,
  registerUser,
  logoutUser,
  getExchangeItems,
  getCommunities,
  getChallenges,
  getDonations,
  getSupportPosts,
} from '@/services/localDbService';

// Mock uuid so IDs are predictable in tests
vi.mock('uuid', () => ({ v4: () => 'test-generated-uuid' }));

// Mock db.json seed
vi.mock('../../db.json', () => ({
  default: {
    users: [
      {
        id: 'seed-user-1',
        email: 'alice@example.com',
        passwordHash: 'demo123',
        name: 'Alice Green',
        avatar: '',
        bio: 'Test bio',
        location: 'Berlin',
        joinedAt: '2024-01-01T00:00:00.000Z',
        stats: { itemsGiven: 12, itemsReceived: 5, co2Saved: 24.5 },
      },
    ],
    exchangeItems: [],
    communities: [
      {
        id: 'com-1',
        name: 'Zero Waste Berlin',
        description: 'Test community',
        category: 'local',
        members: 100,
        location: 'Berlin',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPublic: true,
      },
    ],
    challenges: [
      {
        id: 'chal-1',
        title: '30-Day Declutter',
        description: 'Test challenge',
        category: 'declutter',
        duration: 30,
        participants: 500,
        startDate: '2024-12-01T00:00:00.000Z',
        endDate: '2024-12-31T00:00:00.000Z',
        badge: '🏆',
        difficulty: 'easy',
        isActive: true,
      },
    ],
    donations: [],
    supportPosts: [],
  },
}));

describe('localDbService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loginUser', () => {
    it('should return a public user on successful login', () => {
      const user = loginUser({ email: 'alice@example.com', password: 'demo123' });

      expect(user.id).toBe('seed-user-1');
      expect(user.name).toBe('Alice Green');
      expect(user).not.toHaveProperty('passwordHash');
    });

    it('should throw on invalid credentials', () => {
      expect(() =>
        loginUser({ email: 'alice@example.com', password: 'wrongpassword' })
      ).toThrow('Invalid email or password.');
    });

    it('should throw on unknown email', () => {
      expect(() =>
        loginUser({ email: 'unknown@example.com', password: 'demo123' })
      ).toThrow('Invalid email or password.');
    });

    it('should be case-insensitive for email', () => {
      const user = loginUser({ email: 'ALICE@EXAMPLE.COM', password: 'demo123' });
      expect(user.id).toBe('seed-user-1');
    });
  });

  describe('registerUser', () => {
    it('should create a new user and return public profile', () => {
      const newUser = registerUser({
        name: 'New User',
        email: 'new@example.com',
        password: 'secret123',
        location: 'Paris',
      });

      expect(newUser.name).toBe('New User');
      expect(newUser.email).toBe('new@example.com');
      expect(newUser).not.toHaveProperty('passwordHash');
    });

    it('should throw if email already exists', () => {
      expect(() =>
        registerUser({
          name: 'Duplicate',
          email: 'alice@example.com',
          password: 'password',
          location: 'Berlin',
        })
      ).toThrow('An account with this email already exists.');
    });

    it('should persist the new user so they can log in', () => {
      registerUser({
        name: 'Persistent User',
        email: 'persist@example.com',
        password: 'pass456',
        location: 'London',
      });

      const loggedIn = loginUser({ email: 'persist@example.com', password: 'pass456' });
      expect(loggedIn.name).toBe('Persistent User');
    });
  });

  describe('logoutUser', () => {
    it('should remove the session from localStorage', () => {
      loginUser({ email: 'alice@example.com', password: 'demo123' });
      expect(localStorage.getItem('unclutter_session')).not.toBeNull();

      logoutUser();
      expect(localStorage.getItem('unclutter_session')).toBeNull();
    });
  });

  describe('data queries', () => {
    it('getExchangeItems should return an array', () => {
      const items = getExchangeItems();
      expect(Array.isArray(items)).toBe(true);
    });

    it('getCommunities should return seeded communities', () => {
      const communities = getCommunities();
      expect(communities.length).toBeGreaterThan(0);
      expect(communities[0].name).toBe('Zero Waste Berlin');
    });

    it('getChallenges should return seeded challenges', () => {
      const challenges = getChallenges();
      expect(challenges.length).toBeGreaterThan(0);
      expect(challenges[0].isActive).toBe(true);
    });

    it('getDonations should return an array', () => {
      const donations = getDonations();
      expect(Array.isArray(donations)).toBe(true);
    });

    it('getSupportPosts should return an array', () => {
      const posts = getSupportPosts();
      expect(Array.isArray(posts)).toBe(true);
    });
  });
});
