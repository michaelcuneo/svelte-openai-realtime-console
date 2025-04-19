<script lang="ts">
	import { CloudLightningIcon, CloudOffIcon, MessageSquareIcon } from 'svelte-feather-icons';
	import Button from './Button.svelte';
	import { writable } from 'svelte/store';

	const isActivating = writable(false);
	const message = writable('');

	function handleStartSession() {
		if ($isActivating) return;

		isActivating.set(true);
		startSession();
	}

	function handleSendClientEvent() {
		sendTextMessage($message);
		message.set('');
	}

	let {
		startSession,
		stopSession,
		sendTextMessage,
		isSessionActive = $bindable(false)
	}: {
		startSession: () => void;
		stopSession: () => void;
		sendTextMessage: (message: string) => void;
		isSessionActive: boolean;
	} = $props();
</script>

<div class="session-controls">
	{#if isSessionActive}
		<div class="session-controls-active">
			<input
				onkeydown={(e) => {
					if (e.key === 'Enter' && $message.trim()) {
						handleSendClientEvent();
					}
				}}
				type="text"
				placeholder="send a text message..."
				class="input"
				bind:value={$message}
			/>
			<Button
				onclick={() => {
					if ($message.trim()) {
						handleSendClientEvent();
					}
				}}
			>
				<MessageSquareIcon size="12" />
				send text
			</Button>
			<Button onclick={stopSession}>
				<CloudOffIcon size="12" />
				disconnect
			</Button>
		</div>
	{:else}
		<div class="session-controls-inactive">
			<Button onclick={handleStartSession}>
				<CloudLightningIcon size="12" />
				{$isActivating ? 'starting session...' : 'start session'}
			</Button>
		</div>
	{/if}
</div>

<style>
	.session-controls {
		display: flex;
		gap: 1rem;
		border-radius: 0.375rem;
		border-top-width: 2px;
		border-color: #e5e7eb;
		height: 100%;
	}
	.session-controls-active {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.session-controls-inactive {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.input {
		padding: 1rem;
		flex: 1 1 0%;
		border-radius: 9999px;
		border-width: 1px;
		border-color: #e5e7eb;
	}
</style>
