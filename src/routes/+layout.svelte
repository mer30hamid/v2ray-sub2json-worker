<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	let { children } = $props();
	import { locales, localizeHref, setLocale, getLocale } from '$lib/paraglide/runtime';

	const textDirection: 'rtl' | 'ltr' = getLocale() === 'fa-ir' ? 'rtl' : 'ltr';

	function getOtherLanguageForSwitch(currentLang: 'en' | 'fa-ir'): 'en' | 'fa-ir' {
		if (currentLang === 'en') {
			return 'fa-ir';
		}
		return 'en';
	}
</script>

<div class="container" dir={textDirection}>
	{#if page.url.pathname !== '/'}
		<button class="lang-toggle" onclick={() => setLocale(getOtherLanguageForSwitch(getLocale()))}>
			<span id="langEmoji">{getLocale() === 'en' ? '🇮🇷' : '🌐'}</span>
			<span id="langText">{getLocale() === 'en' ? 'فارسی' : 'English'}</span>
		</button>
	{/if}

	{@render children()}
	<div style="display:none">
		{#each locales as locale}
			<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
		{/each}
	</div>
</div>

<style>
	.container {
		background: #fff;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: var(--shadow);
		width: 100%;
		max-width: 600px;
		text-align: center;
	}

	/* Removed html[dir="ltr"] .lang-toggle to keep right-aligned */
	.lang-toggle {
		padding: 0.5rem 1rem;
		background: var(--gray);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s;
		margin-bottom: 1rem;
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.5rem;
		width: 7rem;
		direction: rtl;
	}
	.lang-toggle:hover {
		background: #5a6268;
	}

	@media (max-width: 480px) {
		.container {
			padding: 1rem;
		}
		.lang-toggle {
			position: static;
			width: 100%;
			max-width: 140px;
			margin: 0 0 1rem auto; /* Right-aligned on mobile */
		}
	}
</style>
