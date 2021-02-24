<script>
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { loremIpsum as lorem } from "lorem-ipsum";
	import { Note, Category } from "../classes";
	import { activeCategory, categories } from "../store";

	export let addingCategory, winHeight;
	let editedCategoryName = "";
	let newCategoryName = "";
	let topOffset = 0;

	// initializes category "activator"
	const activateCategory = getContext("activateCategory");

	// saves the categories list to local storage
	const saveCategories = getContext("saveCategories");

	/**
	 * represents $categories = $categories,
	 * which makes the categories List reactive
	 */
	const makeReactive = getContext("categoriesReact");

	// neccessary to calculate the height of preview-collection height
	// in order for overflow auto to work
	$: catListStyles = `
		height: ${winHeight - topOffset}px;
	`;

	function getOffsetTop(node) {
		topOffset = node.offsetTop;
	}

	function inView(node) {
		if (node.classList.contains("adding")) {
			node.scrollIntoView();
		}
	}

	// adding a new category
	function addCategory(e) {
		if (
			addingCategory &&
			newCategoryName.trim() !== "" &&
			e.key === "Enter"
		) {
			newCategoryName = newCategoryName.trim(); // removes whitespace
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

			$categories = [...$categories, newCategory]; // updates categories list
			saveCategories();
			newCategoryName = ""; // resets value
			addingCategory = false; // resets value

			activateCategory(newCategory);
		}
	}

	// handles editing of category name
	function allowEdit(category) {
		category.contenteditable = true;
		editedCategoryName = category.name;
		makeReactive();
		saveCategories();
	}

	// saves editted category name
	function saveEdit(e, category) {
		if (e.key === "Enter") {
			// avoids two categories with the same name
			let samename = 0;
			$categories.forEach((category) => {
				if (category.name === editedCategoryName) {
					samename += 1;
					editedCategoryName = [editedCategoryName, samename];
					editedCategoryName = editedCategoryName.join("");
				}
			});
			category.name = editedCategoryName;
			category.contenteditable = false;

			// Updates the note tag
			category.notes.forEach((note) => {
				note.tag = category.name;
			});

			makeReactive();
			saveCategories();
			activateCategory(category);
		}
	}

	// Stops edit on focus out
	function stopEdit(category) {
		category.contenteditable = false;
		makeReactive();
		saveCategories();
	}
</script>

<ul class="categories-list" use:getOffsetTop style={catListStyles}>
	{#each $categories as category (category.id)}
		<div in:fade animate:flip={{ duration: 250 }}>
			<li
				class:active={$activeCategory === category.name}
				class:editing={category.contenteditable === true}
				on:click={activateCategory(category)}
				on:dblclick={allowEdit(category)}
			>
				{#if category.contenteditable}
					<input
						type="text"
						bind:value={editedCategoryName}
						on:keypress={(e) => saveEdit(e, category)}
					/>
				{:else}<h3 class="category">
						{category.name}
					</h3>
				{/if}
				<span
					class="notes-count"
					title={`${category.notesCount} ${
						category.notesCount === 1 ? "note" : "notes"
					}`}
				>
					{category.notesCount}
				</span>
			</li>

			<!-- quids edit mode when user clicks elsewhere -->
			{#if category.contenteditable}
				<div class="editing-freeze" on:click={stopEdit(category)} />
			{/if}
		</div>
	{:else}
		<h3 class="empty-msg">Add A Category</h3>
	{/each}

	<!-- Used to add new Category -->
	{#if addingCategory}
		<input
			class="adding"
			type="text"
			placeholder="Enter Category name"
			use:inView
			bind:value={newCategoryName}
			on:keypress={addCategory}
		/>
	{/if}
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
			transition: all 250ms ease-in;

			&.editing {
				position: relative;
				z-index: 2;
			}

			&.active {
				color: #e8effd;
				background: #306df5;
			}

			h3 {
				font-size: var(--small);
				font-weight: var(--regular);
			}

			input {
				padding: 0;
				border-top: none;
				border-bottom: none;

				&::selection {
					color: #000;
					background: white;
				}
			}
		}

		input {
			border-top: 1px solid #e8effd;
			border-bottom: 1px solid #e8effd;
			padding: 15px 30px;
			background: inherit;
			font-size: var(--small);
			font-weight: var(--regular);
			transition: 450ms ease;
			font-family: var(--sub-font);

			&::placeholder {
				font-size: var(--smaller);
				font-weight: var(--regular);
				color: #c5d1f0;
			}
		}
	}

	.notes-count {
		padding: 3px 10px;
		border-radius: 25px;
		background: #2a61dc;
	}

	.editing-freeze {
		position: absolute;
		height: 100vh;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 1;
	}
</style>
