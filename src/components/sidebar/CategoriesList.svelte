<script>
	// <--	IMPORTS	-->
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { activeCategory, categories, currentAction } from "../../store";

	// <--	VAR DECLARATIONS	-->
	export let winHeight;
	let topOffset = 0;
	let action = { value: "editing category", bool: false }; // checks if new category is being added

	// <--	CONTEXT GETTERS	-->
	const activateCategory = getContext("activateCategory");
	const saveCategories = getContext("saveCategories");
	const monitorAction = getContext("monitorAction");
	const resetCurrentAction = getContext("resetCurrentAction");

	// <--	REACTIVE STATEMENTS	-->
	$: monitorAction(action);
	$: editNotify($currentAction);

	// neccessary to calculate the height of preview-collection height
	// in order for overflow auto to work
	$: catListStyles = `
		height: ${winHeight - topOffset}px;
	`;

	// <--	FUNCTIONS	-->
	// notifies this component if the action performed by the addoreditcategory modal is editing
	function editNotify(currentAction) {
		if (currentAction.done.value === action.value) {
			$categories.forEach((category) => {
				if (category.contenteditable === true) {
					category.contenteditable = false;
					saveCategories();
				}
			});
			resetCurrentAction();
		}
	}

	function getOffsetTop(node) {
		topOffset = node.offsetTop;
	}

	function inView(node) {
		if (node.classList.contains("adding")) {
			node.scrollIntoView();
		}
	}

	// handles editing of category name
	function allowEdit(category) {
		category.contenteditable = true;
		action.bool = !$currentAction.requesting.bool;
		saveCategories();
	}
</script>

<ul class="categories-list" use:getOffsetTop style={catListStyles}>
	{#each $categories as category (category.id)}
		<div in:fade animate:flip={{ duration: 250 }}>
			<li
				class:active={$activeCategory.id === category.id}
				class:editing={category.contenteditable === true}
				on:click={() => activateCategory(category)}
				on:dblclick={() => allowEdit(category)}
			>
				<h3 class="category">
					{category.name}
				</h3>
				<span
					class="notes-count"
					title={`${category.notesCount} ${
						category.notesCount === 1 ? "note" : "notes"
					}`}
				>
					{category.notesCount}
				</span>
			</li>
		</div>
	{:else}
		<h3 class="empty-msg">Add A Category</h3>
	{/each}
</ul>

<style lang="scss">
	.categories-list {
		list-style: none;
		overflow-y: auto;
		padding-bottom: 20px;

		// Used to set firefox's scrollbar
		scrollbar-color: var(--notes-bg-darkest) #ffffff00 !important;
		scrollbar-width: thin;

		// Used to set scroll bar
		&::-webkit-scrollbar {
			width: 0.23rem;
		}
		&::-webkit-scrollbar-thumb {
			background: #2a61dc;
			border-radius: 21px;
		}
		&::-webkit-scrollbar-track {
			background: #ffffff00;
		}

		.empty-msg {
			padding: 15px 30px;
		}

		li {
			cursor: pointer;
			padding: 15px 30px;
			font-family: var(--sub-font);
			display: flex;
			justify-content: space-between;
			align-items: center;
			transition: all 150ms ease;

			&.active {
				color: #e8effd;
				background: #306df5;
			}

			h3 {
				font-size: var(--small);
				font-weight: var(--regular);
			}
		}
	}

	.notes-count {
		padding: 3px 10px;
		border-radius: 25px;
		background: #2a61dc;
	}
</style>
