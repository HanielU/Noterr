<script>
	// <--	IMPORTS	-->
	import { getContext, onMount } from "svelte";
	import { loremIpsum as lorem } from "lorem-ipsum";
	import { Note, Category } from "../../utils";
	import { categories, currentAction } from "../../store";

	// <--	VAR DECLARATIONS	-->
	// actions represent what can be done with this modal component
	let actions = ["adding category", "editing category"];
	let newCategoryName = "";
	let editing = false;

	const resetEditing = () => (editing = false);
	onMount(resetEditing);

	// <--	CONTEXT GETTERS	-->
	const activateCategory = getContext("activateCategory");
	const saveCategories = getContext("saveCategories");

	// <--	REACTIVE STATEMENTS	-->
	// watching categories for changes
	$: findEditing($categories);

	// <--	FUNCTIONS	-->
	/**
	 * @param {string} actionValue
	 * The current action being performed: adding category | editing category
	 */
	function reset(actionValue) {
		newCategoryName = ""; // resets value
		$currentAction.requesting = { value: actionValue, bool: false }; // resets value
	}

	/**
	 * @param {string} newCategoryName @returns {string} changed category name (to avoid name confusion)
	 */
	function changeName(newCategoryName) {
		let tempstring = newCategoryName;
		let samenameCounter = 0;
		$categories.forEach((category) => {
			if (category.name === newCategoryName) {
				samenameCounter += 1;
				newCategoryName = `${tempstring} - ${samenameCounter}`;
			}
		});
		return newCategoryName;
	}

	function addCategory() {
		if ($currentAction.requesting.bool && newCategoryName.trim() === "") return;
		// removes whitespace
		newCategoryName = newCategoryName.trim();

		newCategoryName = changeName(newCategoryName);

		let newNote = new Note(null, lorem({ count: 2 }), "Never");
		newNote.tag = newCategoryName;

		let newCategory = new Category(
			newCategoryName,
			false,
			[newNote],
			newNote.id
		);
		// updates categories list
		saveCategories([...$categories, newCategory]);
		activateCategory(newCategory);
		reset(actions[0]);
	}

	function saveEdit() {
		if ($currentAction.requesting.bool && newCategoryName.trim() === "") return;
		// removes whitespace
		newCategoryName = newCategoryName.trim();
		newCategoryName = changeName(newCategoryName);

		$categories.forEach((category) => {
			if (category.contenteditable === true) {
				category.name = newCategoryName;
				category.notes.forEach((note) => (note.tag = category.name));
				category.contenteditable = false;
				activateCategory(category);
				saveCategories();
			}
		});
		reset(actions[1]);
	}

	// notifies currentAction store of modal action that has been performed
	function echoDone(act, bool) {
		$currentAction.done = {
			value: act,
			bool: bool,
		};
	}

	function handleSubmit() {
		// spreading out the values from the
		let { value, bool } = $currentAction.requesting;
		let [act1, act2] = actions;
		if (value === act1 && bool === true) {
			addCategory();
			echoDone(act1, $currentAction.requesting.bool);
		} else if (value === act2 && bool === true) {
			saveEdit();
			echoDone(act2, $currentAction.requesting.bool);
		}
	}

	function cancel() {
		// spreading out the values from the
		let { value, bool } = $currentAction.requesting;
		let [act1, act2] = actions;
		if (value === act1 && bool === true) {
			newCategoryName = "";
			$currentAction.requesting = { value: null, bool: null };
		} else if (value === act2 && bool === true) {
			newCategoryName = "";
			$currentAction.requesting = { value: null, bool: null };
			$currentAction.done = { value: act2, bool: null };
		}
	}

	/** @param {Array} categories
	 * Monitors changes in the list of categories to check what category name is currently being edited
	 */
	function findEditing(categories) {
		categories.forEach((category) => {
			if (category.contenteditable === true) {
				newCategoryName = category.name;
				editing = true;
			} else {
				editing = false;
			}
		});
	}
</script>

<!-- {@debug newCategoryName} -->

{#if $currentAction.requesting.bool === true || editing === true}
	<div class="modal" on:click|self={cancel}>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="title">
				<h3>New Catgory Name</h3>
			</div>
			<input type="text" bind:value={newCategoryName} />
			<div class="btn-wrapper">
				<button
					>{$currentAction.requesting.value === actions[0]
						? "Create"
						: "Edit"}</button
				>
				<button on:click={cancel}> Cancel </button>
			</div>
		</form>
	</div>
{/if}

<style lang="scss">
	.modal {
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;

		&::before {
			content: "";
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: var(--main-blue);
			z-index: -1;
			filter: brightness(80%) opacity(80%);
		}

		form {
			width: 50%;
			max-width: 500px;
			height: 300px;
			background: #fff;
			padding: 20px 50px;
			border-radius: var(--basic-radius);

			.title {
				width: 100%;
				padding: 10px;
				text-align: center;

				h3 {
					font-size: var(--small);
					font-family: var(--sub-font);
					color: #535968;
				}
			}

			input {
				color: #535968;
				border: 2px solid #535968;
				padding: 10px;
				font-size: 20px;
				margin-bottom: 10px;
				border-radius: 10px;
				text-align: center;
			}

			.btn-wrapper {
				display: flex;
				justify-content: space-between;
				flex-direction: row-reverse;
			}

			button {
				color: #fff;
				padding: 10px;
				font-size: 19px;
				background: var(--main-blue);
				font-weight: var(--medium);
				border-radius: 10px;
				cursor: pointer;
				width: Clamp(100px, 45%, 230px);

				&:last-child {
					background: rgb(255, 67, 67);
				}
			}
		}
	}
</style>
