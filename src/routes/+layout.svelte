<script lang="ts">
	import 'reset.css';
	import 'sanitize.css';
	import './styles.css';

	let { children }: { children?: () => any } = $props();
</script>

<div class="app">
	{@render children?.()}
</div>
