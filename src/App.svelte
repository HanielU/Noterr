<script>
	import NameModal from "./components/modals/NameModal.svelte";
	import AddOrEditCategory from "./components/modals/AddOrEditCategory.svelte";
	import DeleteData from "./components/DeleteData.svelte";
	import Sidebar from "./components/sidebar/Sidebar.svelte";
	import NotePreview from "./components/notesbar/Notes.svelte";
	import Note from "./components/Note.svelte";
	import { onMount, setContext } from "svelte";
	import {
		categories,
		activeCategory,
		expanded,
		username,
		currentAction,
	} from "./store";
	// import Note2 from "./components/NoteRichTxtEditor.svelte";
	let width = 0;

	// $: (() => console.log($expanded.partExpansion))();

	$: $expanded.partExpansion = width > 1050 ? false : true;
	$: namePresent = $username.value ? true : false;

	onMount(resetCurrentAction);

	const activateCategory = (category) =>
		($activeCategory = { name: category.name, id: category.id });

	/** @param {string} content @returns {number} from 0 to content.split(" ").length */
	const getWordCount = (content) =>
		content.trim() === "" ? 0 : content.split(" ").length;

	/** @param {Array} newArr */
	const saveCategories = (newArr) =>
		($categories = !newArr ? $categories : newArr);

	function activateNote(note) {
		let activeNoteID = note.id;
		$categories.forEach((category) => {
			category.notes.forEach((note) => {
				if (note.id === activeNoteID) {
					category.activeNote = note.id;
					saveCategories();
				}
			});
		});
	}

	function monitorAction(action) {
		if (action.bool) {
			$currentAction.requesting = action;
			return;
		}
		resetCurrentAction();
	}

	function resetCurrentAction() {
		$currentAction.requesting = { value: null, bool: null };
		$currentAction.done = { value: null, bool: null };
	}

	setContext("saveCategories", saveCategories);
	setContext("wordCount", getWordCount);
	setContext("activateCategory", activateCategory);
	setContext("activateNote", activateNote);
	setContext("monitorAction", monitorAction);
	setContext("resetCurrentAction", resetCurrentAction);

	/**
	 * @function saveCategories - saves the categories list to local storage
	 * @function getWordCount - Returns the number of words in a string `content`
	 * @function categoriesReact - Makes "categories" list reactive
	 * @function activateCategories - makes `category` the active category
	 * @function activateNote - makes `note` the active note
	 */
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
<!-- {@debug $categories} -->

<NameModal />
<AddOrEditCategory />

<!-- <svelte:window bind:innerWidth={width} on:click={toggleMenu} /> -->

<DeleteData />
{#if namePresent}
	<div class="wrapper" class:flex={$expanded.fullExpansion}>
		<Sidebar />

		<NotePreview />

		<Note />
	</div>
{/if}

<!-- 
	This is a note making app that stores all your note categories and
	notes in local storage, allowing data to persist even upon reload

	Design Credit: https://dribbble.com/shots/10907311-Notes-App-Category-Screen

	Functionality:
		- Create a Category
		- Update a Category Name (You can do this by double-clicking on the category name in the sidebar)
		- Delete Categories
		- Create Notes
		- Update Notes
		- Delete Notes
	
	The code for this project is at -> https://github.com/HanielU/Noterr
-->
<style>
	.wrapper {
		height: 100%;
		width: 100%;
		display: grid;
		overflow: hidden;
		grid-template-columns: minmax(200px, 0.4fr) minmax(250px, 0.5fr) 1.1fr;
		justify-items: center;
	}
	.flex {
		display: flex;
	}
</style>
