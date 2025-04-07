// src/routes/Sub2JSON/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { convert } from '$lib/utils/conversion';

export const GET: RequestHandler = async ({ url, platform }) => {
	const basePath = platform?.env?.BASE_PATH || import.meta.env.BASE_PATH || '/Sub2JSON';
	const sub = url.searchParams.get('sub') || 'https://example.com/sub';
	const limit = url.searchParams.get('limit')?.split(',');

	try {
		const result = await convert(sub, limit);
		return new Response(JSON.stringify(result, null, 2), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Conversion error:', errorMessage);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
