<script>
	import { fade } from "svelte/transition";

	export let styles = ``;
	export let operations = [{}, {}];
</script>

<ul class="modal" style={styles} transition:fade={{ duration: 250 }}>
	{#each operations as operation}
		<li on:click={operation.function} title={operation.title}>
			{operation.name}
		</li>
	{/each}
</ul>

<style lang="scss">
	.modal {
		position: absolute;
		height: var(--height);
		width: var(--width);
		top: var(--top);
		left: var(--left);
		right: var(--right);
		color: var(--color);

		li {
			background: var(--bg);
			padding: var(--padding);
			cursor: pointer;

			&:hover {
				background: var(--notes-bg-darker);
			}
		}
	}
</style>
