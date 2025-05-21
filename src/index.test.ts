import { describe, it, expect } from '@jest/globals';
import { handler } from './index'
import { LambdaEvent, LambdaContext } from 'hono/aws-lambda';

describe('POST /calculate-partners', () => {
    const context: LambdaContext = {} as any
    const baseEvent: LambdaEvent = {
        routeKey: 'POST /calculate-partners',
        rawPath: '/calculate-partners',
        requestContext: { http: { method: 'POST', path: '/calculate-partners' } } as any,
        body: JSON.stringify({
            total_leaders: 2,
            total_followers: 2,
            dance_styles: ['Waltz'],
            leader_knowledge: { '1': ['Waltz'], '2': ['Waltz'] },
            follower_knowledge: { 'A': ['Waltz'], 'B': ['Waltz'] },
            dance_duration_minutes: 10
        }),
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json' },
        version: '2.0',
        rawQueryString: '',
    }

  it('returns 200 and result for valid input', async () => {
    const response = await handler(baseEvent, context)
    expect(response.statusCode).toBe(200)
    expect(response.body).toContain('average_dance_partners')
  })

  it('returns 400 for invalid input', async () => {
    const event = {
        ...baseEvent,
      body: JSON.stringify({
        total_leaders: 0,
        total_followers: 2,
        dance_styles: ['Waltz'],
        leader_knowledge: { '1': ['Waltz'] },
        follower_knowledge: { 'A': ['Waltz'] },
        dance_duration_minutes: 10
      }),
    }

    const response = await handler(event, context)
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('error')
  })
})