import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

// Vercel Serverless Function handler
// This wraps the Express app so Vercel can route requests to it
export default function handler(req: VercelRequest, res: VercelResponse) {
    // @ts-ignore - Express app is also a request handler
    return app(req, res);
}
