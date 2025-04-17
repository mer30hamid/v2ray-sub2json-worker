// src/routes/Sub2JSON/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { convert } from '$lib/utils/conversion';
import { isBase64, isValidUri } from '$lib';

export const GET: RequestHandler = async ({ url, platform }) => {
	const basePath = platform?.env?.BASE_PATH || import.meta.env.BASE_PATH || '/Sub2JSON';
	const sub = url.searchParams.get('sub') || 'https://example.com/sub';
	const limit = url.searchParams.get('limit')?.split(',');


	let data = "";
	const lines = sub.split(/\r\n|\n|\r/).filter(line => line.trim()); // Skip empty lines
  
	for (const line of lines) {
	  if (isValidUri(line, true)) {
		data += line + "\n"; // Proxy URI, add directly
	  } else if (isValidUri(line)) {
		try {
		  const response = await fetch(line);
		  if (!response.ok) {
			console.error(`Fetch failed for ${line}: ${response.status}`);
			continue; // Skip failed fetches
		  }
		  const responseText = await response.text();
		  data += isBase64(responseText) ? atob(responseText) : responseText;
		} catch (error) {
		  //console.error(`Error fetching ${line}: ${error.message}`);
		  continue; // Skip fetch errors
		}
	  } else {
		console.log(`Skipping invalid line: ${line}`);
	  }
	}

	try {
		const result = await convert(data, limit);
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
