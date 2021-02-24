<script>
	export let namePresent = false;
	export let username = "";

	function handleSubmit() {
		if (!username.trim()) return;
		localStorage.setItem("username", username);
		location.reload();
	}
</script>

{#if namePresent === false}
	<div class="modal">
		<form on:submit|preventDefault={handleSubmit}>
			<input
				placeholder="Enter Your Username"
				type="text"
				bind:value={username}
			/>
			<button>Let's Go!</button>
		</form>
	</div>
{/if}

<style lang="scss">
	.modal {
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;

		&::before {
			content: "";
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: var(--main-blue);
			z-index: -1;
			filter: brightness(80%) opacity(80%);
		}

		form {
			width: 50%;
			max-width: 500px;
			height: 300px;
			background: #fff;
			padding: 15px;
			border-radius: var(--basic-radius);

			input {
				color: #535968;
				border: 2px solid #535968;
				padding: 10px;
				font-size: 20px;
				margin-bottom: 10px;
				border-radius: 10px;
				text-align: center;
			}

			button {
				color: #fff;
				padding: 10px;
				font-size: 19px;
				background: var(--main-blue);
				font-weight: var(--medium);
				border-radius: 10px;
				cursor: pointer;
			}
		}
	}
</style>
