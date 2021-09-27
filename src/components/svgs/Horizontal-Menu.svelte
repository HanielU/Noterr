<script>
	export let color = "white";
</script>

<!-- 
	make sure to complete div wrapper
 -->

<div class="wrapper" on:click|self>
	<svg
		id="Outline"
		fill={color}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		><title>184 menu dots</title><circle cx="2" cy="12" r="2" /><circle
			cx="12"
			cy="12"
			r="2"
		/><circle cx="22" cy="12" r="2" /></svg
	>
</div>

<style>
	.wrapper {
		height: 16px;
		width: 16px;
		cursor: pointer;
		position: relative;
		user-select: none;
	}

	svg {
		pointer-events: none;
	}
</style>
