export const db: Record<string, number> = {};

export const updateDanceCount = (danceStyle: string, count: number) => {
    if (!db[danceStyle]) {
        db[danceStyle] = 0;
    }
    db[danceStyle] += count;
}