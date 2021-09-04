<script>
	import { username, expanded } from "../../store";
	import Categories from "./CategoriesList.svelte";
	import AddCategory from "../modals/AddCategory.svelte";
	let winHeight = 0;
	let currentAction = { value: "adding category", bool: false }; // checks if new category is being added
	const toggleCategoryAdd = () => (currentAction.bool = !currentAction.bool);

	// used as to check what action is being performed by a modal
	function handleDispatchData(e) {
		let dispacthData = e.detail;
		if (dispacthData.a === currentAction.value) {
			currentAction.bool = dispacthData.v;
		} else {
			return;
		}
	}
</script>

<!-- {@debug addingCategory} -->

<!-- 
	@component
	House Categories and navigation	
 -->

<svelte:window bind:innerHeight={winHeight} />

{#if $expanded.fullExpansion === false}
	<nav>
		<div class="user">
			<h3 class="user-name">{$username}</h3>
		</div>

		<section class="categories">
			<div class="categories-header">
				<h1>CATEGORIES</h1>
				<span title="Create a Category" on:click={toggleCategoryAdd}
					><img src="uicons-regular-rounded/svg/fi-rr-plus.svg" alt="" /></span
				>
			</div>

			<AddCategory {currentAction} on:submit={handleDispatchData} />
			<Categories {winHeight} />
		</section>
	</nav>
{/if}

<style lang="scss">
	nav {
		height: 100%;
		width: 100%;
		background: var(--main-blue);
		color: #c5d1f0;
	}

	.user {
		width: 100%;
		padding: 30px 30px 20px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;

		h3 {
			font-size: var(--smaller);
			font-weight: var(--medium);
		}
	}

	.categories {
		user-select: none;

		&-header {
			padding: 5px 30px;
			min-height: 60px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #e8effd;
			margin-bottom: 20px;
			letter-spacing: 2px;

			h1 {
				font-weight: var(--bold);
				font-size: var(--smaller);
			}

			span {
				height: 16px;
				width: 16px;
				cursor: pointer;

				img {
					height: 100%;
				}
			}
		}
	}
</style>
