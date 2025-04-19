<script lang="ts">
	import { ArrowUpIcon, ArrowDownIcon } from 'svelte-feather-icons';

	let isClient = $state(false);
	let isExpanded = $state(false);

	$effect(() => {
		isClient = event.event_id && !event.event_id.startsWith('event_');
	});

	let {
		event = {}
	}: {
		event?: { [key: string]: any };
	} = $props();
</script>

<div class="event">
	<button
		class="dropdown"
		onclick={() => (isExpanded = !isExpanded)}
		aria-expanded={isExpanded}
		aria-label="Toggle event details"
	>
		{#if isClient}
			<ArrowDownIcon class="text-blue-400" />
		{:else}
			<ArrowUpIcon class="text-green-400" />
		{/if}
		<div class="footnote">
			{isClient ? 'client:' : 'server:'}
			&nbsp;{event.type} | {event.timestamp}
		</div>
	</button>
	<div class="expanded" style={isExpanded ? 'display: block;' : 'display: none;'}>
		<pre>{JSON.stringify(event, null, 2)}</pre>
	</div>
</div>

<style>
	.event {
		display: flex;
		padding: 0.5rem;
		flex-direction: column;
		gap: 0.5rem;
		border-radius: 0.375rem;
		background-color: #f9fafb;
	}
	.dropdown {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
	}
	.expanded {
		overflow-x: auto;
		padding: 0.5rem;
		border-radius: 0.375rem;
		color: #6b7280;
		background-color: #e5e7eb;
	}
	.footnote {
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: #6b7280;
	}
	pre {
		font-size: 0.75rem;
		line-height: 1rem;
	}
</style>
