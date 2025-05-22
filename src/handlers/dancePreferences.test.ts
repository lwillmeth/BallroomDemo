import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getDancePreferences', () => {
  beforeEach(() => {
    // Reset the db mock before each test
    jest.resetModules();
  });

  it('returns nulls when db is empty', () => {
    jest.doMock('../db/localdb', () => ({ db: {} }), { virtual: true });
    const { getDancePreferences } = require('./dancePreferences');
    const result = getDancePreferences();
    expect(result.mostPopular).toBeNull();
    expect(result.leastPopular).toBeNull();
  });

  it('returns the most and least popular dance styles', () => {
    jest.doMock('../db/localdb', () => ({
      db: { Waltz: 5, Tango: 2, Foxtrot: 8 }
    }), { virtual: true });
    const { getDancePreferences } = require('./dancePreferences');
    const result = getDancePreferences();
    expect(result.mostPopular).toBe('Foxtrot');
    expect(result.leastPopular).toBe('Tango');
    expect(result.all).toEqual({ Waltz: 5, Tango: 2, Foxtrot: 8 });
  });

  it('returns the only style as both most and least popular if only one exists', () => {
    jest.doMock('../db/localdb', () => ({
      db: { Waltz: 3 }
    }), { virtual: true });
    const { getDancePreferences } = require('./dancePreferences');
    const result = getDancePreferences();
    expect(result.mostPopular).toBe('Waltz');
    expect(result.leastPopular).toBe('Waltz');
  });
});