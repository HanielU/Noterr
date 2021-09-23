<script>
	import { getContext } from "svelte";
	import { fade, slide } from "svelte/transition";
	import { activeCategory, categories } from "../../store";

	const activate = getContext("activateNote");

	function inView(node) {
		if (node.classList.contains("active")) {
			node.scrollIntoView();
		}
	}
</script>

<!-- 
	Logic: For each category in categories, if the category's name is equal to that 
	of that of the current(active Category) then show the notes in that category
-->
<!-- For each category in categories if category's name is equal to the active category -->
{#each $categories.filter((category) => category.id === $activeCategory.id) as category (category.id)}
	<!-- Then show that category's notes -->
	{#each category.notes as note}
		<article
			class="preview"
			class:active={category.activeNote === note.id}
			in:slide={{ duration: 250 }}
			use:inView
		>
			<span class="preview-tag">
				{note.tag}
			</span>
			<h4 class="note-title" on:click={activate(note)}>
				{note.title
					? note.title.length < 50
						? note.title
						: `${note.title.slice(0, 50)}...`
					: "Untitled"}
			</h4>
			<p class="note-content">
				{note.content
					? note.content.length < 110
						? note.content
						: `${note.content.slice(0, 110)}...`
					: "Empty..."}
			</p>
		</article>
	{:else}
		<p class="empty-notes" in:fade>Add some notes</p>
	{/each}
{/each}

<!-- For each category in categories if category's name is equal to the active category -->
<style lang="scss">
	.preview {
		padding: 20px 30px;
		border-bottom: 1px solid var(--notes-bg-darker);
		transition: all 250ms ease-in;
		word-wrap: break-word;

		&.active {
			background: var(--notes-bg-darker);
		}

		&-tag {
			font-size: 12px;
			opacity: 0.8;
		}
	}

	.note-title {
		font-size: var(--small);
		cursor: pointer;
		padding: 5px 0;
		text-transform: capitalize;
		// max-width: 34ch;

		&:hover {
			text-decoration: underline;
		}
	}

	.note-content {
		font-size: var(--smallest);
		opacity: 0.8;
		// max-width: 34ch;
	}

	p.empty-notes {
		padding: 30px;
		font-weight: var(--regular);
		opacity: 0.6;
	}
</style>
