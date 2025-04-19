<script lang="ts">
	import Event from './Event.svelte';

	let { events = $bindable([]) }: { events: Array<{ type: string }> } = $props();

	let eventsToDisplay: any[] = [];
	let deltaEvents: { [key: string]: { type: string } } = {};

	$effect(() => {
		events.forEach((event) => {
			if (event.type.endsWith('delta')) {
				if (deltaEvents[event.type]) {
					return;
				} else {
					deltaEvents[event.type] = event;
				}
			}

			eventsToDisplay.push(event);
		});
	});
</script>

<div class="events">
	{#if events.length === 0}
		<div class="awaiting">Awaiting events...</div>
	{:else}
		{#each events as event}
			<Event {event} />
		{/each}
	{/if}
</div>

<style>
	.events {
		display: flex;
		overflow-x: auto;
		flex-direction: column;
		gap: 0.5rem;
	}
	.awaiting {
		color: #6b7280;
	}
</style>
