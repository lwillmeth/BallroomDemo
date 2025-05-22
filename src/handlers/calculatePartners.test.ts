import { describe, it, expect } from '@jest/globals';
import { calculatePartners, CalculatePartnersRequest } from './calculatePartners'

describe('calculatePartners', () => {
    const baseRequest: CalculatePartnersRequest = {
        total_leaders: 2,
        total_followers: 3,
        dance_styles: ['Waltz', 'Tango', 'Foxtrot'],
        leader_knowledge: {
            '1': ['Waltz', 'Tango'],
            '2': ['Foxtrot']
        },
        follower_knowledge: {
            'A': ['Waltz', 'Tango', 'Foxtrot'],
            'B': ['Tango'],
            'C': ['Waltz']
        },
        dance_duration_minutes: 15
    }

    describe('minimum values', () => {
        it('requires total_leaders > 0', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                total_leaders: 0
            }
            await expect(calculatePartners(req)).rejects.toThrow('total_leaders and total_followers must be greater than 0.')
        })

        it('requires dance_styles > 0', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                dance_styles: []
            }
            await expect(calculatePartners(req)).rejects.toThrow('dance_styles must contain at least 1 value.')
        })

        it('requires dance_duration_minutes > 5', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                dance_duration_minutes: 3
            }
            await expect(calculatePartners(req)).rejects.toThrow('dance_duration_minutes must be at least 5 minutes.')
        })
    })

    describe('checking results', () => {
        it('returns the correct average for the baseRequest', async () => {
            const res = await calculatePartners(baseRequest)
            expect(res.average_dance_partners).toBe(1.2)
        })

        it('returns the correct average for a shorter dance session', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                dance_duration_minutes: 5
            }
            const res = await calculatePartners(req)
            expect(res).toHaveProperty('average_dance_partners')
            expect(typeof res.average_dance_partners).toBe('number')
            expect(res.average_dance_partners).toBe(0.4)
        })

        it('does not let a leader be their own follower', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                total_leaders: 1,
                total_followers: 1,
                leader_knowledge: {
                    '1': ['Waltz'],
                },
                follower_knowledge: {
                    '1': ['Waltz'],
                },
            }
            const res = await calculatePartners(req)
            expect(res.average_dance_partners).toBe(0)
        })

        it('does not pair a leader and follower more than once', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                total_leaders: 1,
                total_followers: 1,
                leader_knowledge: {
                    'A': ['Waltz', 'Waltz'],
                },
                follower_knowledge: {
                    '1': ['Waltz', 'Waltz'],
                },
            }
            const res = await calculatePartners(req)
            expect(res.average_dance_partners).toBe(1)
        })

        it('returns 0 when no followers match any leader', async () => {
            const req: CalculatePartnersRequest = {
                ...baseRequest,
                total_leaders: 1,
                total_followers: 1,
                leader_knowledge: { '1': ['Waltz'] },
                follower_knowledge: { 'A': ['Tango'] }
            }
            const res = await calculatePartners(req)
            expect(res.average_dance_partners).toBe(0)
        })

        it('returns correct average when partners dance multiple times', async () => {
            const req: CalculatePartnersRequest = {
                total_leaders: 2,
                total_followers: 2,
                dance_styles: ['Waltz'],
                leader_knowledge: {
                    '1': ['Waltz'],
                    '2': ['Waltz']
                },
                follower_knowledge: {
                    'A': ['Waltz'],
                    'B': ['Waltz']
                },
                dance_duration_minutes: 100
            }
            const res = await calculatePartners(req)
            expect(res.average_dance_partners).toBe(2)
        })
    })
})