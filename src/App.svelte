<script>
	import NameModal from "./components/NameModal.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import NotePreview from "./components/Notes.svelte";
	import Note from "./components/Note.svelte";
	import { setContext } from "svelte";
	import { categories, activeCategory, expanded, username } from "./store";
	// import Note2 from "./components/NoteRichTxtEditor.svelte";
	let width = 0;

	// $: (() => console.log($expanded.partExpansion))();

	$: $expanded.partExpansion = width > 1050 ? false : true;

	$: namePresent = $username ? true : false;

	/**
	 * Makes the parameter (category) to the active category
	 */
	function activateCategory(category) {
		$activeCategory = category.name;
		localStorage.setItem("activeCategory", $activeCategory);
	}

	/**
	 * When this function is run, it sets the note given as a parameter to
	 * become the active note which can be edited
	 */
	function activateNote(note) {
		let activeNoteID = note.id;
		$categories.forEach((category) => {
			category.notes.forEach((note) => {
				if (note.id === activeNoteID) {
					category.activeNote = note.id;
					$categories = $categories;
					saveCategories();
				}
			});
		});
	}

	function categoriesReact() {
		$categories = $categories;
	}

	function getWordCount(content) {
		return content.trim() === "" ? 0 : content.split(" ").length;
	}

	function saveCategories() {
		localStorage.setItem("categories", JSON.stringify($categories));
	}

	setContext("saveCategories", saveCategories);
	setContext("wordCount", getWordCount);
	setContext("categoriesReact", categoriesReact);
	setContext("activateCategory", activateCategory);
	setContext("activateNote", activateNote);
</script>

<NameModal {namePresent} />

<svelte:window bind:innerWidth={width} />

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
		grid-template-columns: 0.4fr 0.5fr 1.1fr;
	}
	.flex {
		display: flex;
	}
</style>
