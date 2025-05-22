import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { serve, ServerType } from '@hono/node-server';
import { app } from './index';

describe('POST /calculate-partners', () => {
  let server: ServerType;
  
  beforeAll(async () => {
    server = await serve({ fetch: app.fetch, port: 0 });
  });

  afterAll(async () => {
    await server.close();
  });

  it('returns 200 and result for valid input', async () => {
    const response = await request(server)
      .post('/calculate-partners')
      .send({
        total_leaders: 2,
        total_followers: 2,
        dance_styles: ['Waltz'],
        leader_knowledge: { '1': ['Waltz'], '2': ['Waltz'] },
        follower_knowledge: { 'A': ['Waltz'], 'B': ['Waltz'] },
        dance_duration_minutes: 10
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('average_dance_partners');
  });

  it('returns 400 for invalid input', async () => {
    const response = await request(server)
      .post('/calculate-partners')
      .send({
        total_leaders: 0,
        total_followers: 2,
        dance_styles: ['Waltz'],
        leader_knowledge: { '1': ['Waltz'] },
        follower_knowledge: { 'A': ['Waltz'] },
        dance_duration_minutes: 10
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('total_leaders');
  });
});