<script>
	import { onMount } from "svelte";
	import { categories } from "../categories";
	import Quill from "quill";
	export let activeCategory;

	let winHeight = 0;
	let contentTopOffset = 0;
	let content, toolbar;

	$: console.log($categories[0].notes[0].content.length);

	onMount(() => {
		let toolbarOptions = ["bold", "italic", "underline", "strike"];
		let options = {
			modules: {
				toolbar: toolbarOptions,
			},
			theme: "snow",
		};

		contentTopOffset = content.offsetTop;
		let quill = new Quill(".note", options);
	});

	$: contentStyles = `
		height: ${winHeight - contentTopOffset}px;
	`;

	function updateTitle(note) {
		note.title = note.title;
		$categories = $categories;
	}

	function updateContent(note) {
		note.content = note.content;
		$categories = $categories;
	}
</script>

<svelte:window bind:innerHeight={winHeight} />

<!-- 
	Logic: For each category in categories, if the category's name is equal to that 
  of that of the current(active Category) then for each of the notes in that category,
  if the note's activeNote property is equal to the id of the current note, then display the note
-->
<!-- For each category in categories if category's name is equal to the active category -->
{#each $categories.filter((category) => category.name === activeCategory) as category (category.id)}
	<!-- For each note in the category if the category's activeNote corresponds to the current note's id -->
	{#each category.notes.filter((note) => category.activeNote === note.id) as note (note.id)}
		<!-- Show activeNote's details -->
		<section class="note" bind:this={content}>
			<div id="editor" />
			<div class="note" style={contentStyles} />
		</section>
	{/each}
{/each}

<style lang="scss">
	.note {
		width: 100%;
		// height: 100%;
		display: flex;
		flex-direction: column;
		overflow: scroll;

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
