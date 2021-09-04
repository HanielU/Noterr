<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { loremIpsum as lorem } from "lorem-ipsum";
	import { Note, Category } from "../../utils";
	import { categories } from "../../store";

	// represent what is happening when the modal is activated
	export let currentAction = { value: null, bool: null };
	// actions represent what can be done with this modal component
	let actions = ["adding category", "editing category"];
	let newCategoryName = "";

	const dispatch = createEventDispatcher();

	//Context Getters
	const activateCategory = getContext("activateCategory");
	const saveCategories = getContext("saveCategories");

	function addCategory() {
		if (currentAction.bool && newCategoryName.trim() === "") return;
		// removes whitespace
		newCategoryName = newCategoryName.trim();

		// avoids two categories with the same name
		let samename = 0;
		$categories.forEach((category) => {
			if (category.name === newCategoryName) {
				samename += 1;
				newCategoryName = [newCategoryName, samename];
				newCategoryName = newCategoryName.join("");
			}
		});

		let newNote = new Note(null, lorem({ count: 2 }), "Never");
		newNote.setTag(newCategoryName);

		let newCategory = new Category(
			newCategoryName,
			false,
			[newNote],
			newNote.id
		);
		// updates categories list
		saveCategories([...$categories, newCategory]);
		newCategoryName = ""; // resets value
		// resets value
		currentAction = { value: "adding category", bool: false };
		activateCategory(newCategory);
		console.log("added!");
	}

	function saveEdit() {
		console.log("edited!");
	}

	// debugging lol kekw
	$: console.log(currentAction);

	function handleSubmit() {
		let data;
		// spreading out the values from the
		let { value, bool } = currentAction;
		let [act1, act2] = actions;
		if (value === act1 && bool === true) {
			addCategory();
			// a represents currentAction
			data = { v: currentAction.bool, a: act1 };
		} else if (value === act2 && bool === true) {
			saveEdit();
			data = { v: currentAction.bool, a: act2 };
		}
		dispatch("submit", data);
	}
</script>

<!-- {@debug newCategoryName} -->

{#if currentAction.bool === true}
	<div class="modal">
		<form on:submit|preventDefault={handleSubmit}>
			<input type="text" bind:value={newCategoryName} />
			<button>Submit</button>
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
			padding: 15px;
			border-radius: var(--basic-radius);

			input {
				color: #535968;
				border: 2px solid #535968;
				padding: 10px;
				font-size: 20px;
				margin-bottom: 10px;
				border-radius: 10px;
				text-align: center;
			}

			button {
				color: #fff;
				padding: 10px;
				font-size: 19px;
				background: var(--main-blue);
				font-weight: var(--medium);
				border-radius: 10px;
				cursor: pointer;
			}
		}
	}
</style>
