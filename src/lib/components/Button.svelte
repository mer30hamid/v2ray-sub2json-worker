<!-- src/lib/components/Button.svelte -->
<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let className = '';
	export let ariaLabel = '';
	export let onClick = () => {};
</script>

<button {type} class="button {className}" aria-label={ariaLabel} on:click={onClick}>
	<slot />
</button>

<style>
	.button {
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		transition:
			background-color 0.3s,
			transform 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.button:hover {
		transform: translateY(-2px);
	}
</style>
