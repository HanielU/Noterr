<script>
	// <--	IMPORTS	-->
	import { getContext } from "svelte";
	import Sortable from "sortablejs";
	import { loremIpsum as lorem } from "lorem-ipsum";
	import { Note } from "../../utils";
	import {
		activeCategory,
		categories,
		expanded,
		currentAction,
	} from "../../store";
	import NotePreview from "./NotePreview.svelte";
	import ManageModal from "../modals/ManageModal.svelte";
	import HorizontalMenu from "../svgs/Horizontal-Menu.svelte";

	// <--	VAR DECLARATIONS	-->
	let winHeight = 0;
	let topOffset = 0;
	let action = { value: "editing category", bool: false }; // checks if new category is being added
	let manageModalVisible = false;
	let operations = [
		{
			name: "Add a note",
			operFunc: addNote,
			title: "Add a note",
		},
		{
			name: "Rename Category",
			operFunc: allowEdit,
			title: "Change Current Category Name",
		},
		{
			name: "Delete Category",
			operFunc: deleteCategory,
			title: "Delete Current Category",
		},
	];

	let styles = `
		--bg: var(--notes-bg);
		--padding: 15px 20px;
		--color: black;
		--top: 190%;
		--right: 10px;
		--width: max-content;
		--box-shadow: 1px 2px 5px 0px #a7a7a7;
	`;
	let props = { styles, operations };

	function getOffsetTop(node) {
		topOffset = node.offsetTop;
	}

	// <--	CONTEXT GETTERS	-->
	const saveCategories = getContext("saveCategories");
	const activateCategory = getContext("activateCategory");
	const activate = getContext("activateNote");
	const monitorAction = getContext("monitorAction");
	const resetCurrentAction = getContext("resetCurrentAction");

	// <--	REACTIVE STATEMENTS	-->
	$: monitorAction(action);
	$: editNotify($currentAction);

	// neccessary to calculate the height of preview-collection height
	// in order for overflow auto to work
	$: previewStyles = `
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

	const toggleManage = () => (manageModalVisible = !manageModalVisible);

	function handleDispatchData(e) {
		manageModalVisible = e.detail;
	}

	function addNote() {
		let newNote = new Note(null, lorem({ count: 2 }));
		newNote.tag = $activeCategory.name;

		$categories.forEach((category) => {
			if (category.id === $activeCategory.id) {
				category.notesCount += 1;
				category.notes = [...category.notes, newNote];
				saveCategories();
			}
		});

		activate(newNote);
		manageModalVisible = false;
	}

	function allowEdit() {
		$categories.forEach((category) => {
			if (category.id === $activeCategory.id) {
				category.contenteditable = true;
				action.bool = !$currentAction.requesting.bool;
				saveCategories();
				manageModalVisible = false;
			}
		});
	}

	/**
	 * When this function is run, the active category is deleted and
	 * the next category is activated
	 */
	function deleteCategory() {
		manageModalVisible = false;
		let sure = confirm("Delete this category? This action cannot be undone");
		if (!sure) return;
		$categories.forEach((category, index) => {
			if (category.id === $activeCategory.id) {
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
						: activateCategory({ name: "Add A Category", id: "none" });
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

<svelte:window bind:innerHeight={winHeight} />
{#if $expanded.fullExpansion === false}
	<section class="notes">
		<div class="notes-header">
			<h3>{$activeCategory.name}</h3>
			<div class="manage-app controls" on:click|self={toggleManage}>
				<HorizontalMenu color="#535968" on:click={toggleManage} />

				{#if manageModalVisible}
					<ManageModal
						{manageModalVisible}
						{...props}
						on:close={handleDispatchData}
					/>
				{/if}
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
		flex: 1;

		&-header {
			padding: 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;

			// i {
			// 	cursor: pointer;
			// 	color: #535968;

			// 	&:hover {
			// 		color: red;
			// 	}
			// }
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
