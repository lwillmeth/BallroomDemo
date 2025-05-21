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

    // Assumes that a dance will not begin if there's not enough time left to finish it
    const maxNumDances = Math.floor(dance_duration_minutes / DANCE_LENGTH_MINUTES);
    const dancesPerLeader = findPartnersByLeader(dance_styles, leader_knowledge, follower_knowledge);

    // console.log({ dancesPerLeader})
    const totalDances = Object.values(dancesPerLeader).reduce((acc, followers) => {
        const dancesPerLeader = followers.length > maxNumDances ? maxNumDances : followers.length;
        return acc + dancesPerLeader;
    }, 0);

    // Assumes the average should be rounded down to the nearest whole number
    return { average_dance_partners: Math.floor(totalDances / total_leaders) };
};

const findPartnersByLeader = (
    dance_styles: string[],
    leader_knowledge: DancerKnowledge,
    follower_knowledge: DancerKnowledge
): Record<string, string[]> => {
    const partners: Record<string, string[]> = {};

    for (const leaderId in leader_knowledge) {
        const leaderStyles = leader_knowledge[leaderId];
        partners[leaderId] = [];

        for (const followerId in follower_knowledge) {
            // Assumes that a dancer cannot lead and follow at the same time
            if (leaderId === followerId) continue;

            const followerStyles = follower_knowledge[followerId];
            const canFollowLeader = leaderStyles.some(style => dance_styles.includes(style) && followerStyles.includes(style));
            if (canFollowLeader) {
                partners[leaderId].push(followerId);
            }
        }
  }

  return partners;
}