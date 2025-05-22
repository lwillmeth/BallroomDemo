import { db, updateDanceCount } from '../db/localdb';

export interface DancerKnowledge {
    [key: string]: string[];
}

export interface CalculatePartnersRequest {
    total_leaders: number;
    total_followers: number;
    dance_styles: string[];
    leader_knowledge: DancerKnowledge;
    follower_knowledge: DancerKnowledge;
    dance_duration_minutes: number;
}

export interface CalculatePartnersResponse {
    average_dance_partners: number;
}

const DANCE_LENGTH_MINUTES = 5;

export const calculatePartners = async ({
    total_followers,
    total_leaders,
    dance_styles,
    leader_knowledge,
    follower_knowledge,
    dance_duration_minutes
}: CalculatePartnersRequest): Promise<CalculatePartnersResponse> => {
    if (total_leaders <= 0 || total_followers <= 0) {
        throw new Error('total_leaders and total_followers must be greater than 0.');
    }

    if (dance_styles?.length <= 0) {
        throw new Error('dance_styles must contain at least 1 value.');
    }

    if (dance_duration_minutes < DANCE_LENGTH_MINUTES) {
        throw new Error(`dance_duration_minutes must be at least ${DANCE_LENGTH_MINUTES} minutes.`);
    }

    // Map each leader to a Set of unique followers they dance with
    const leaderToFollowers: Record<string, Set<string>> = {};

    const numDances = Math.floor(dance_duration_minutes / DANCE_LENGTH_MINUTES);

    for(let i=0; i < numDances; i++) {
        const currentDanceStyle = dance_styles[i % dance_styles.length];
        const dancePartners = getPartnersByDanceStyle(currentDanceStyle, leader_knowledge, follower_knowledge);

        for (const { leader, follower } of dancePartners) {
            if (!leaderToFollowers[leader]) {
                leaderToFollowers[leader] = new Set();
            }
            leaderToFollowers[leader].add(follower);
        }

        updateDanceCount(currentDanceStyle, 1);
    }

    // Calculate the average number of unique dance partners per leader
    const totalUniquePairs = Object.values(leaderToFollowers).reduce((sum, followers) => sum + followers.size, 0) * 2;
    const average_dance_partners = totalUniquePairs / (total_leaders + total_followers);
    return { average_dance_partners };
};

const getPartnersByDanceStyle = (
  danceStyle: string,
  leader_knowledge: DancerKnowledge,
  follower_knowledge: DancerKnowledge
): { leader: string; follower: string }[] => {
  // Get eligible leaders and followers for this style
  const eligibleLeaders = Object.entries(leader_knowledge)
    .filter(([_, styles]) => styles.includes(danceStyle))
    .map(([id]) => id);

  const eligibleFollowers = Object.entries(follower_knowledge)
    .filter(([_, styles]) => styles.includes(danceStyle))
    .map(([id]) => id);

  // Shuffle arrays for random matching
  const shuffle = <T>(arr: T[]) => arr.sort(() => Math.random() - 0.5);
  const leaders = shuffle([...eligibleLeaders]);
  const followers = shuffle([...eligibleFollowers]);

  const matches: Array<{ leader: string; follower: string }> = [];
  const pairCount = Math.min(leaders.length, followers.length);

  // Each leader and follower is only selected once
  for (let i = 0; i < pairCount; i++) {
    if (leaders[i] !== followers[i]) {
      // Skip if a leader is matched with themselves
      matches.push({ leader: leaders[i], follower: followers[i] });
    }
  }

  return matches;
};
