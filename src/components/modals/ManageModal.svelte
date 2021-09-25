<script>
	import { fade } from "svelte/transition";

	export let styles = ``;
	export let operations = [{}, {}];
</script>

<ul
	class="modal"
	style={styles}
	in:fade={{ duration: 250 }}
	out:fade={{ duration: 100 }}
>
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
		background: var(--bg);
		border-radius: 8px;
		overflow: hidden;

		li {
			padding: var(--padding);
			cursor: pointer;
			font-family: var(--sub-font);
			font-size: var(--smallest);
			color: #535968;

			&:hover {
				background: var(--notes-bg-darker);
			}
		}
	}
</style>
