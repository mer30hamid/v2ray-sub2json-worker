import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
	    sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',

			//https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy
			strategy: ['url'],

			// Only use this option in serverless environments where each request gets
			// its own isolated runtime context. Using it in multi-request server
			// environments could lead to data leakage between concurrent requests.
			// https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit#troubleshooting
			disableAsyncLocalStorage: true
		})
	]
});
