<!-- House Categories and navigation -->
<script>
	import { username, expanded, categories } from "../store";
	import Categories from "./SidebarCategory.svelte";
	let addingCategory = false; // checks if new category is being added
	let winHeight = 0;
</script>

<svelte:window bind:innerHeight={winHeight} />

{#if $expanded.fullExpansion === false && $expanded.partExpansion === false && $categories.length > 0}
	<nav>
		<div class="user">
			<h3 class="user-name">{$username}</h3>
		</div>

		<section class="categories">
			<div class="categories-header">
				<h1>CATEGORIES</h1>
				<span
					title="Create a Category"
					on:click={() => (addingCategory = !addingCategory)}
					><img
						src="uicons-regular-rounded/svg/fi-rr-plus.svg"
						alt=""
					/></span
				>
			</div>

			<Categories {addingCategory} {winHeight} />
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
