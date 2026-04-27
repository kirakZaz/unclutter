import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loginUser,
  registerUser,
  logoutUser,
  getExchangeItems,
  getCommunities,
  getEvents,
  getHubLocations,
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
        location: 'Fitzroy',
        joinedAt: '2024-01-01T00:00:00.000Z',
        stats: { itemsGiven: 12, itemsReceived: 5, co2Saved: 24.5 },
      },
    ],
    exchangeItems: [],
    communities: [
      {
        id: 'com-1',
        name: 'Zero Waste Fitzroy',
        description: 'Test community',
        category: 'local',
        members: 100,
        location: 'Fitzroy',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPublic: true,
      },
    ],
    communityPosts: [],
    events: [
      {
        id: 'evt-1',
        title: 'Fitzroy Swap Meet',
        description: 'Test event',
        category: 'swap-meet',
        date: '2026-05-01',
        time: '10:00 AM',
        location: 'Fitzroy Town Hall',
        address: '201 Napier St',
        organizer: 'Zero Waste Fitzroy',
        attendees: 10,
        maxCapacity: 50,
        isFree: true,
      },
    ],
    hubLocations: [
      {
        id: 'hub-1',
        name: 'Fitzroy Drop-off',
        type: 'drop-off',
        description: 'Test hub',
        address: '201 Napier St',
        suburb: 'Fitzroy',
        hours: 'Mon-Sat 9-5',
        acceptedItems: ['clothing', 'books'],
        isActive: true,
      },
    ],
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
        location: 'Brunswick',
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
          location: 'Fitzroy',
        })
      ).toThrow('An account with this email already exists.');
    });

    it('should persist the new user so they can log in', () => {
      registerUser({
        name: 'Persistent User',
        email: 'persist@example.com',
        password: 'pass456',
        location: 'Collingwood',
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
      expect(communities[0].name).toBe('Zero Waste Fitzroy');
    });

    it('getEvents should return seeded events', () => {
      const events = getEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].title).toBe('Fitzroy Swap Meet');
    });

    it('getHubLocations should return active hubs', () => {
      const hubs = getHubLocations();
      expect(hubs.length).toBeGreaterThan(0);
      expect(hubs[0].name).toBe('Fitzroy Drop-off');
    });
  });
});
