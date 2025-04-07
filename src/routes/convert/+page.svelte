<!-- src/routes/convert/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import SettingsLimit from '$lib/components/SettingsLimit.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let sub = $state('');
	let status = $state('');
	let statusClass = $state('status');
	let limitValue = $state('');

	const basePath = import.meta.env.BASE_PATH || '/sub2json';
	const homePath = import.meta.env.HOME_PATH || '/convert';

	async function copyToClipboard() {
		if (!sub.trim()) {
			status = m.error();
			statusClass = 'status error';
			return;
		}
		const url = `${window.location.origin}${basePath}?sub=${encodeURIComponent(sub)}${limitValue ? '&limit=' + limitValue : ''}`;
		try {
			await navigator.clipboard.writeText(url);
			status = m.copied();
			statusClass = 'status success';
			setTimeout(() => (status = ''), 3000);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			status = m.copyFailed + errorMessage;
			statusClass = 'status error';
		}
	}

	function clearTextarea() {
		sub = '';
		status = m.cleared('fa-ir');
		statusClass = 'status success';
		setTimeout(() => (status = ''), 2000);
	}

	function updateLimit(checked: string[]) {
		limitValue = checked.length ? checked.join(',') : '';
	}

	const protocols = [
		{ id: 'settingsLimitVless', value: 'vless', label: m.settingsLimitVlessLabel() },
		{ id: 'settingsLimitVmess', value: 'vmess', label: m.settingsLimitVmessLabel() },
		{
			id: 'settingsLimitShadowsocks',
			value: 'shadowsocks',
			label: m.settingsLimitShadowsocksLabel()
		},
		{ id: 'settingsLimitTrojan', value: 'trojan', label: m.settingsLimitTrojanLabel() },
		{ id: 'settingsLimitWireguard', value: 'wireguard', label: m.settingsLimitWireguardLabel() },
		{ id: 'settingsLimitReality', value: 'reality', label: m.settingsLimitRealityLabel() }
	];
</script>

<header>
	<h1>{m.title('fa-ir')}</h1>
	<h2>{@html m.subTitle('fa-ir')}</h2>
</header>

<form class="form-group" action={basePath} method="GET">
	<p class="instructions">{m.instruction('fa-ir')}</p>
	<Textarea bind:value={sub} placeholder={m.placeholder('fa-ir')} />
	<p class="footnote">{m.footnote('fa-ir')}</p>

	{#if limitValue.length !== 0 && protocols.length !== limitValue.split(',').length}
		<input type="hidden" id="limitValue" name="limit" value={limitValue} />
	{/if}

	<SettingsLimit {updateLimit} {protocols} />

	<p class={statusClass}>{status}</p>
	<div class="button-container">
		<Button className="clear-btn" onClick={clearTextarea}>🧽 {m.clearButton('fa-ir')}</Button>
		<Button className="copy-btn" onClick={copyToClipboard}>🔗 {m.copyButton('fa-ir')}</Button>
		<Button type="submit" className="submit-btn">↗️ {m.submitButton('fa-ir')}</Button>
	</div>
</form>

<footer>
	Source: <a href="https://github.com/mer30hamid/v2ray-sub2json-worker" target="_blank"
		>GitHub Repository</a
	>
</footer>
