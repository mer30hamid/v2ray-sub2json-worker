<!-- src/lib/components/Textarea.svelte -->
<script>
	export let value = '';
	export let placeholder = '';
	export let id = 'sub';
	export let required = true;
</script>

<textarea {id} name="sub" bind:value {placeholder} {required} aria-label="Subscription Links"
></textarea>

<style>
	textarea {
		width: 100%;
		min-height: 120px;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 0.95rem;
		resize: vertical;
		direction: ltr;
		transition: border-color 0.3s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	textarea:focus {
		border-color: var(--primary);
		outline: none;
	}
	textarea::placeholder {
		color: #aaa;
		font-style: italic;
	}
</style>
