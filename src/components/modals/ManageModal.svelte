<script>
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

	export let manageModalVisible;
	export let styles = ``;
	export let operations = [{}, {}];

	const dispatch = createEventDispatcher();
	const closeMenu = () => {
		manageModalVisible = false;
		dispatch("close", manageModalVisible);
	};
</script>

<div
	class="freeze-bg"
	class:active={manageModalVisible}
	on:click={closeMenu}
	title="close modal"
/>

<ul
	class="modal"
	style={styles}
	in:fade={{ duration: 250 }}
	out:fade={{ duration: 50 }}
>
	{#each operations as operation}
		<li on:click={operation.operFunc} title={operation.title}>
			{operation.name}
		</li>
	{/each}
</ul>

<style lang="scss">
	.freeze-bg {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100%;
		z-index: 1;
		cursor: default;

		&.active {
			display: block;
		}
	}

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
		z-index: 2;
		box-shadow: var(--box-shadow);

		li {
			padding: var(--padding);
			cursor: pointer;
			font-family: var(--sub-font);
			font-size: var(--smallest);
			color: #535968;
			// text-align: center;

			&:hover {
				background: var(--notes-bg-darker);
			}
		}
	}
</style>
