import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { calculatePartners } from './handlers/calculatePartners'

const app = new Hono()

app.post('/calculate-partners', async () => {
  calculatePartners
});

export const handler = handle(app)
