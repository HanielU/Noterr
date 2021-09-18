<script>
	function deleteData() {
		localStorage.clear();
		window.location.reload();
	}
</script>

<button class="erase" title="Erase all Data" on:click={deleteData}>
	Erase
</button>

<style lang="scss">
	.erase {
		position: fixed;
		z-index: 999;
		cursor: pointer;
		width: fit-content;
		padding: 20px;
		top: 90%;
		right: 88%;
		background: rgba(0, 0, 0, 0.372);
		border-radius: 20px;
		color: white;
		&:hover {
			color: rgba(163, 158, 158, 0.781);
		}
	}
</style>
