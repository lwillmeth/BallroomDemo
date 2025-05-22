import { db } from '../db/localdb';

export const getDancePreferences = () => {
    const entries = Object.entries(db);
    if (entries.length === 0) {
        return { mostPopular: null, leastPopular: null };
    }
    // Sort by count descending
    entries.sort((a, b) => b[1] - a[1]);
    const mostPopular = entries[0][0];
    const leastPopular = entries[entries.length - 1][0];
    return { mostPopular, leastPopular, all: db };
};