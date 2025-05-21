import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { calculatePartnersHandler } from './handlers/calculatePartners'

const app = new Hono()

app.post('/calculate-partners', calculatePartnersHandler);

export const handler = handle(app)
