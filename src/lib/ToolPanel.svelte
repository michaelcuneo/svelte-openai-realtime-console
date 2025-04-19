<script lang="ts">
	import { colorSessionUpdate } from './functions/colorFunction';
	import ToolOutput from './ToolOutput.svelte';

	let {
		isSessionActive = $bindable(false),
		sendClientEvent,
		events = $bindable([])
	}: {
		isSessionActive: boolean;
		sendClientEvent: (message: any) => void;
		events: Array<{
			type: string;
			response?: { output?: Array<{ type: string; function_name?: string }> };
		}>;
	} = $props();

	let functionAdded: any = $state(false);
	let functionCallOutput: any = $state(null);

	$effect(() => {
		if (!events || events.length === 0) return;

		const firstEvent = events[events.length - 1];
		if (!functionAdded && firstEvent.type === 'session.created') {
			sendClientEvent(colorSessionUpdate);
			functionAdded.set(true);
		}

		const mostRecentEvent = events[0];

		if (mostRecentEvent.type === 'response.done' && mostRecentEvent?.response?.output) {
			mostRecentEvent.response.output.forEach((output: any) => {
				if (output.type === 'function_call' && output.function_name === 'color_palette') {
					functionCallOutput = output;
					setTimeout(() => {
						sendClientEvent({
							type: 'response.create',
							response: {
								instructions: `
                ask for feedback about the color palette - don't repeat 
                the colors, just ask if they like the colors.
              `
							}
						});
					}, 1000);
				}
			});
		}
	});

	$effect(() => {
		if (!isSessionActive) {
			functionAdded = false;
			functionCallOutput = null;
		}
	});
</script>

<section class="tool-panel">
	<div class="tool-panel-header">
		<h2 class="head">Color Palette Tool</h2>
		{#if isSessionActive}
			{#if functionCallOutput}
				<ToolOutput {functionCallOutput} />
			{:else}
				<p>Ask for advice on a color palette...</p>
			{/if}
		{:else}
			<p>Start the session to use this tool...</p>
		{/if}
	</div>
</section>

<style>
	.tool-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		height: 100%;
	}
	.tool-panel-header {
		padding: 1rem;
		border-radius: 0.375rem;
		height: 100%;
		background-color: #f9fafb;
	}
	.head {
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 700;
	}
</style>
