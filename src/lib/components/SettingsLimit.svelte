<!-- src/lib/components/SettingsLimit.svelte -->
<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	let { updateLimit, protocols } = $props();
	let checkedProtocols: string[] = $state([]);
	function handleChange() {
		updateLimit(checkedProtocols);
	}
</script>

<details class="settings-limit">
	<summary>{m.settingsLimitTitle()}</summary>
	<div class="settings-content">
		{#each protocols as { id, value, label }}
			<div class="settings-option">
				<input type="checkbox" {id} bind:group={checkedProtocols} {value} onchange={handleChange} />
				<label for={id}>{label}</label>
			</div>
		{/each}
	</div>
</details>

<style>
	.settings-limit {
		width: 100%;
		margin: 0 auto;
		border: 1px solid #ddd;
		border-radius: 6px;
		overflow: hidden;
		font-family: Tahoma, sans-serif;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		font-size: 0.7rem;
		margin-top: 25px;
	}

	.settings-limit summary {
		padding: 12px 16px;
		background: #f9f9f9;
		cursor: pointer;
		display: flex;
		align-items: center;
		list-style: none;

		color: #444;
	}

	.settings-limit summary::-webkit-details-marker {
		display: none;
	}

	.settings-limit summary::before {
		content: '⚙️';
		margin-left: 8px;
		margin-right: 8px;
		font-size: 1.1em;
	}

	.settings-limit[open] summary {
		background: #f0f0f0;
	}

	.settings-content {
		padding: 0;
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease;
		background: white;
	}

	.settings-limit[open] .settings-content {
		padding: 16px;
		max-height: 500px;
	}

	.settings-option {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	.settings-option input[type='checkbox'] {
		margin-left: 8px;
		margin-right: 8px;
	}

	.settings-option label {
		cursor: pointer;
		user-select: none;
	}
</style>
