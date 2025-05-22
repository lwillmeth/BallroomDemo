import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import { z } from 'zod';
import { calculatePartners, CalculatePartnersRequest } from './handlers/calculatePartners';

export const app = new Hono()

app.get('/*', (c) => {
  return c.text('Try calling: POST /calculate-partners')
});

const CalculatePartnersRequestSchema = z.object({
  total_leaders: z.number().int().min(1),
  total_followers: z.number().int().min(1),
  dance_styles: z.array(z.string()).min(1),
  leader_knowledge: z.record(z.array(z.string())),
  follower_knowledge: z.record(z.array(z.string())),
  dance_duration_minutes: z.number().int().min(5),
});

app.post('/calculate-partners', async (c: Context) => {
  try {
    const body: CalculatePartnersRequest = await c.req.json()
    const parsed = CalculatePartnersRequestSchema.parse(body)
    const result = await calculatePartners(parsed)
    return c.json(result, 200)
  } catch (error: any) {
    return c.json({ error: error.message }, 400)
  }
});

const port = process.env.PORT || 3000;
console.log(`Server running on http://localhost:${port}`)
serve({
  fetch: app.fetch,
  port: Number(port),
});
