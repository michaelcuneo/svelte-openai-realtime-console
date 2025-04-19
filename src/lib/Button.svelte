<script lang="ts">
	let {
		children,
		onclick
	}: {
		children: any;
		onclick: any;
	} = $props();
</script>

<button {onclick}>
	{@render children?.()}
</button>

<style>
	button {
		display: flex;
		padding: 1rem;
		gap: 0.25rem;
		align-items: center;
		border-radius: 9999px;
		color: #ffffff;
		background-color: #1f2937;
	}
	button:hover {
		opacity: 0.9;
	}
</style>
