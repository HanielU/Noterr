<script>
	import { getContext } from "svelte";
	import moment from "moment";
	import { activeCategory, categories, expanded } from "../store";

	// saves the categories list to local storage
	const saveCategories = getContext("saveCategories");

	/**
	 * Gets Current time in the format: `Month Day Year, Hour Minute Secconds am/pm`
	 */
	const time = () => moment().format("MMMM Do YYYY, h:mm:ss a");

	/**
	 * When this function is run, it sets the note given as a parameter to
	 * become the `active` note which can be edited
	 */
	const activate = getContext("activateNote");

	/**
	 * represents $categories = $categories,
	 * which makes the categories List reactive
	 */
	const makeReactive = getContext("categoriesReact");

	/**
	 * Used to get the word count
	 */
	const getWordCount = getContext("wordCount");

	const expand = () => ($expanded.fullExpansion = !$expanded.fullExpansion);

	function updateTitle(note) {
		note.title = note.title;
		note.lastUpdate = time();
		makeReactive();
		saveCategories();
	}

	function updateContent(note) {
		note.content = note.content;
		note.words = getWordCount(note.content);
		note.lastUpdate = time();
		makeReactive();
		saveCategories();
	}

	function deleteNote(category, currentNote) {
		category.notesCount -= 1;
		category.notes = category.notes.filter(
			(note) => note.id !== currentNote.id
		);
		makeReactive();
		category.notes.map((note) => activate(note));
		saveCategories();
		$expanded.fullExpansion = false;
	}
</script>

<!-- 
	Logic: For each category in categories, if the category's name is equal to that 
  of that of the current(active Category) then for each of the notes in that category,
  if the note's activeNote property is equal to the id of the current note, then display the note
-->
<!-- For each category in categories if category's name is equal to the active category -->
{#each $categories.filter((category) => category.name === $activeCategory) as category (category.id)}
	<!-- For each note in the category if the category's activeNote corresponds to the current note's id -->
	{#each category.notes.filter((note) => category.activeNote === note.id) as note (note.id)}
		<!-- Show activeNote's details -->
		<section class="note">
			<div class="note-header">
				<input
					type="text"
					placeholder="Untitled"
					bind:value={note.title}
					on:input={updateTitle(note)}
				/>

				<div class="expand" on:click={expand} title="Expand This Note">
					<i class="fi-rr-expand" />
				</div>

				<div
					class="trash"
					on:click={deleteNote(category, note)}
					title="Delete This Note"
				>
					<i class="fi-rr-trash" />
				</div>
			</div>

			<textarea
				bind:value={note.content}
				placeholder="Enter A Note"
				spellcheck="false"
				on:input={updateContent(note)}
			/>

			<footer>
				<p>Words: {note.words}</p>
				<p>Last Updated: {note.lastUpdate}</p>
			</footer>
		</section>
	{/each}
{/each}

<!-- For each category in categories if category's name is equal to the active category -->
<style lang="scss">
	.note {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex: 2;

		&-header {
			padding: 30px 30px 20px;
			border-bottom: 1px solid var(--notes-bg-darker);
			display: flex;
			justify-content: space-between;
			align-items: center;

			input {
				font-size: var(--mid);
				color: #535968;
				font-family: var(--sub-font);
				font-weight: var(--bold);
				text-transform: capitalize;

				&::placeholder {
					font-weight: var(--regular);
					opacity: 0.6;
				}
			}

			.trash,
			.expand {
				padding-right: 10px;
				cursor: pointer;

				&:hover i {
					color: red;
				}
				i {
					color: #535968;
				}
			}

			.expand:hover i {
				color: var(--main-blue);
			}
		}
		textarea {
			font-family: var(--sub-font);
			font-size: var(--smaller);
			color: #535968;
			width: 100%;
			border: none;
			outline: none;
			resize: none;
			width: 100%;
			height: 100%;
			padding: 30px;
			line-height: 1.5;
			flex: 1;
			border-bottom: 1px solid var(--notes-bg-darker);

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

		footer {
			padding: 20px 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #535968;

			p {
				font-size: calc(var(--smallest) + 1px);
				font-family: var(--sub-font);
			}
		}
	}
</style>
