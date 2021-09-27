<script>
	// <--	IMPORTS	-->
	import { username, expanded, currentAction } from "../../store";
	import Categories from "./CategoriesList.svelte";
	import ManageModal from "../modals/ManageModal.svelte";
	import HorizontalMenu from "../svgs/Horizontal-Menu.svelte";
	import { getContext } from "svelte";

	// <--	VAR DECLARATIONS	-->
	let winHeight = 0;
	let action = { value: "adding category", bool: false }; // checks if new category is being added

	let manageModalVisible = false;
	let operations = [
		{
			name: "Create Category",
			operFunc: toggleCategoryAdd,
			title: "Create a Category",
		},
		{ name: "Rename User", operFunc: editUserName, title: "Change User Name" },
		{
			name: "Clear Data",
			operFunc: deleteData,
			title: "Clear all Noterr data",
		},
	];

	let styles = `
		--bg: var(--notes-bg);
		--padding: 15px 20px;
		--color: black;
		--top: 190%;
		--right: 10px;
		--width: max-content;
	`;
	let props = { styles, operations };

	// <--	CONTEXT GETTERS	-->
	const monitorAction = getContext("monitorAction");

	// <--	REACTIVE STATEMENTS	-->
	$: monitorAction(action);

	// <--	FUNCTIONS	-->
	function toggleCategoryAdd() {
		action.bool = !$currentAction.requesting.bool;
		manageModalVisible = false;
	}

	const toggleManage = () => (manageModalVisible = !manageModalVisible);

	function handleDispatchData(e) {
		manageModalVisible = e.detail;
	}

	function deleteData() {
		let sure = confirm("Erase all Noterr Data? This action can not be undone");
		if (!sure) return;
		localStorage.clear();
		window.location.reload();
	}

	function editUserName() {
		$username.editing = true;
		manageModalVisible = false;
	}
</script>

<!-- {@debug addingCategory} -->

<!-- 
	@component
	House Categories and navigation	
 -->

<svelte:window bind:innerHeight={winHeight} />

<!-- {#if currentAction.bool === true}
	<AddOrEditCategory {currentAction} on:submit={handleDispatchData} />
{/if} -->

{#if $expanded.fullExpansion === false}
	<nav>
		<div class="user">
			<h3 class="user-name">{$username.value}</h3>
			<div class="manage-app controls">
				<HorizontalMenu on:click={toggleManage} />

				{#if manageModalVisible}
					<ManageModal
						{manageModalVisible}
						{...props}
						on:close={handleDispatchData}
					/>
				{/if}
			</div>
		</div>

		<section class="categories">
			<div class="categories-header">
				<h1>CATEGORIES</h1>
				<span title="Create a Category" on:click={toggleCategoryAdd}
					><img src="uicons-regular-rounded/svg/fi-rr-plus.svg" alt="" /></span
				>
			</div>

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
		position: relative;
	}

	.user {
		width: 100%;
		padding: 30px 30px 20px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;

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
