import type { AvailableLanguageTag } from "../../lib/paraglide/runtime"
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit"
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};

// declare namespace App {
// 	interface Platform {
// 		env?: {
// 			BASE_PATH?: string;
// 			HOME_PATH?: string;
// 		};
// 	}

 	interface Locals {
    paraglide: ParaglideLocals<AvailableLanguageTag>,

// 		paraglide: {
// 			lang: string;
// 			translate: (key: string, options?: any) => string;
// 		};
// 	}
// }

// interface ImportMetaEnv {
// 	BASE_PATH: string;
// 	HOME_PATH: string;
// }

// interface ImportMeta {
// 	readonly env: ImportMetaEnv;
// }

// declare namespace NodeJS {
// 	interface ProcessEnv {
// 		BASE_PATH?: string;
// 		HOME_PATH?: string;
// 	}
// }
