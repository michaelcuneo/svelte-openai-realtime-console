<script lang="ts">
	import ColorBox from './ColorBox.svelte';

	let {
		functionCallOutput
	}: {
		functionCallOutput: {
			arguments: string;
			functionName: string;
			type: string;
		};
	} = $props();

	let { theme, colors } = JSON.parse(functionCallOutput.arguments);
</script>

<div class="tool-panel">
	<p>Theme: {theme}</p>
	{#each colors as color}
		<ColorBox {color} />
	{/each}
	<pre class="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
    {JSON.stringify(functionCallOutput, null, 2)}
  </pre>
</div>

<style>
	.tool-panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	pre {
		overflow-x: auto;
		padding: 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		line-height: 1rem;
		background-color: #f3f4f6;
	}
</style>
