import { Hono, Context } from 'hono'
import { serve } from '@hono/node-server';
import { calculatePartners, CalculatePartnersRequest } from './handlers/calculatePartners'

const app = new Hono()

app.get('/*', (c) => {
  return c.text('POST /calculate-partners')
});

app.post('/calculate-partners', async (c: Context) => {
  try {
    const body: CalculatePartnersRequest = await c.req.json()
    const result = await calculatePartners(body)
    return c.json(result, 200)
  } catch (error: any) {
    return c.json({ error: error.message }, 400)
  }
});

const port = process.env.PORT || 3000;
console.log(`Server running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port: Number(port),
});
