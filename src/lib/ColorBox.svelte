<script lang="ts">
	let { color }: { color: string } = $props();
</script>

<div class="color-box" style="backgroundColor: {color}">
	<p>
		{color}
	</p>
</div>

<style>
	.color-box {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.375rem;
		border-width: 1px;
		border-color: #e5e7eb;
		width: 100%;
		height: 4rem;
	}
	p {
		padding: 0.5rem;
		border-radius: 0.375rem;
		border-width: 1px;
		border-color: #000000;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 700;
		color: #000000;
	}
</style>
