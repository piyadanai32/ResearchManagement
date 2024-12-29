<script>
    import { goto } from '$app/navigation'; // ใช้สำหรับการเปลี่ยนหน้า

    const navigateToLogin = () => {
        goto('/login');
    };
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="home-container">
    <h1>Welcome to the Home Page</h1>
    <p>Please login to continue.</p>
    <button on:click={navigateToLogin} class="login-button">Go to Login</button>
</div>

<style>
    .home-container {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        padding: 20px;
    }
    .login-button {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007BFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .login-button:hover {
        background-color: #0056b3;
    }
</style>
