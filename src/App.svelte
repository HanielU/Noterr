<script>
	import NameModal from "./components/modals/NameModal.svelte";
	import DeleteData from "./components/DeleteData.svelte";
	import Sidebar from "./components/sidebar/Sidebar.svelte";
	import NotePreview from "./components/notesbar/Notes.svelte";
	import Note from "./components/Note.svelte";
	import { setContext } from "svelte";
	import { categories, activeCategory, expanded, username } from "./store";
	// import Note2 from "./components/NoteRichTxtEditor.svelte";
	let width = 0;

	// $: (() => console.log($expanded.partExpansion))();

	$: $expanded.partExpansion = width > 1050 ? false : true;

	$: namePresent = $username ? true : false;

	const activateCategory = (category) => ($activeCategory = category.name);

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

	setContext("saveCategories", saveCategories);
	setContext("wordCount", getWordCount);
	setContext("activateCategory", activateCategory);
	setContext("activateNote", activateNote);

	/**
	 * @function saveCategories - saves the categories list to local storage
	 * @function getWordCount - Returns the number of words in a string `content`
	 * @function categoriesReact - Makes "categories" list reactive
	 * @function activateCategories - makes `category` the active category
	 * @function activateNote - makes `note` the active note
	 */
</script>

<!-- {@debug $categories} -->

<NameModal {namePresent} />

<svelte:window bind:innerWidth={width} />

{#if namePresent}
	<DeleteData />
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
		grid-template-columns: 0.4fr 0.5fr 1.1fr;
	}
	.flex {
		display: flex;
	}
</style>
