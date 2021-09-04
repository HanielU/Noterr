<script>
	import { getContext } from "svelte";
	import Sortable from "sortablejs";
	import { loremIpsum as lorem } from "lorem-ipsum";
	import { Note } from "../../utils";
	import { activeCategory, categories, expanded } from "../../store";
	import NotePreview from "./NotePreview.svelte";

	// was needed to toggle controls menu
	// let menuVisible = false;

	/**
	 * Was Responsible for toggling the delete button
	 */
	/* function toggleMenu(e) {
		!(
			e.target.classList.contains("controls") ||
			e.target.classList.contains("menu")
		)
			? (menuVisible = false)
			: (menuVisible = !menuVisible);
	} */

	let winHeight = 0;
	let topOffset = 0;

	// neccessary to calculate the height of preview-collection height
	// in order for overflow auto to work
	$: previewStyles = `
		height: ${winHeight - topOffset}px;
	`;

	function getOffsetTop(node) {
		topOffset = node.offsetTop;
	}

	// Context Getters
	const saveCategories = getContext("saveCategories");
	const activateCategory = getContext("activateCategory");
	const activate = getContext("activateNote");

	function addNote() {
		let newNote = new Note(null, lorem({ count: 2 }));
		newNote.setTag($activeCategory);

		$categories.forEach((category) => {
			if (category.name === $activeCategory) {
				category.notesCount += 1;
				category.notes = [...category.notes, newNote];
				saveCategories();
			}
		});

		activate(newNote);
	}

	/**
	 * When this function is run, the active category is deleted and
	 * the next category is activated
	 */
	function deleteCategory() {
		$categories.forEach((category, index) => {
			if (category.name === $activeCategory) {
				let currentCategory = category;
				$categories = $categories.filter(
					(category) => category.id !== currentCategory.id
				);

				// needs to wait for $categories store array to update
				setTimeout(() => {
					$categories[index]
						? activateCategory($categories[index])
						: $categories[index - 1]
						? activateCategory($categories[index - 1])
						: activateCategory({ name: "Add A Category" });
				}, 10);

				saveCategories();
			}
		});
	}

	/**
	 * To be used with svelte actions for sorting
	 */
	function toggleSwap(node) {
		new Sortable(node, {
			animation: 150,
			ghostClass: "blue-background-class",
		});

		/* sortable.on("sortable:start", () => console.log("sortable:start"));
		sortable.on("sortable:sort", () => console.log("sortable:sort"));
		sortable.on("sortable:sorted", () => console.log("sortable:sorted"));
		sortable.on("sortable:stop", () => console.log("sortable:stop")); */
	}
	// $: console.log($categories);
</script>

<!-- For development -->
<svelte:head>
	<link
		rel="stylesheet"
		href="uicons-regular-rounded/css/uicons-regular-rounded.css"
	/>
</svelte:head>

<!-- For Codepen -->
<!-- <svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/HanielU/Noterr/public/uicons-regular-rounded/css/uicons-regular-rounded.css"
	/>
</svelte:head> -->

<svelte:window bind:innerHeight={winHeight} />
<!-- <svelte:window bind:innerHeight={winHeight} on:click={toggleMenu} /> -->
{#if $expanded.fullExpansion === false}
	<section class="notes">
		<div class="notes-header">
			<h3>{$activeCategory}</h3>
			<div class="menu" on:click={deleteCategory} title="Delete Category">
				<i class="fi-rr-trash" />
			</div>
		</div>

		<div class="notes-content">
			<div class="add-note">
				<button on:click={addNote} title="Add a note">
					<span>
						<img src="uicons-regular-rounded/svg/fi-rr-plus-small.svg" alt="" />
					</span>
					<p>ADD NOTE</p>
				</button>
			</div>

			<div class="preview-collection" style={previewStyles} use:getOffsetTop>
				<!-- use:toggleSwap -->
				<NotePreview />
			</div>
		</div>
	</section>
{/if}

<!-- <svelte:window bind:innerHeight={winHeight} on:click={toggleMenu} /> -->
<style lang="scss">
	.notes {
		height: 100%;
		width: 100%;
		background: var(--notes-bg);
		color: #535968;
		max-width: 350px;
		flex: 1;

		&-header {
			padding: 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;

			i {
				cursor: pointer;
				color: #535968;

				&:hover {
					color: red;
				}
			}
		}

		&-content {
			width: 100%;
		}
	}

	.add-note {
		width: 100%;
		padding: 0 30px 30px;
		border-bottom: 1px solid var(--notes-bg-darker);

		button {
			width: 100%;
			background: var(--main-blue);
			padding: 15px 30px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: var(--sub-font);
			letter-spacing: 2px;
			border-radius: var(--little-radius);
			cursor: pointer;

			span {
				margin: 0 10px 0 0;
				height: var(--mid);

				img {
					height: 100%;
				}
			}

			p {
				font-weight: var(--bold);
			}
		}
	}

	.preview-collection {
		overflow-y: auto;
		padding-bottom: 20px;
		font-family: var(--sub-font);

		// Used to set firefox's scrollbar
		scrollbar-color: var(--notes-bg-darkest) #ffffff00 !important;
		scrollbar-width: thin;

		// Used to set scroll bar
		&::-webkit-scrollbar {
			width: 0.23rem;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--notes-bg-darkest);
			border-radius: 21px;
		}
		&::-webkit-scrollbar-track {
			background: #ffffff00;
		}
	}
</style>
