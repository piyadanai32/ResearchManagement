<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { userRole } from '$lib/stores/userRole'; 
	import { goto } from '$app/navigation';

	// โหลด role จาก API
	onMount(async () => {
		try {
			const res = await fetch('/api/user');
			if (res.ok) {
				const data = await res.json();
				userRole.set(data.user.role); // เก็บข้อมูล role ใน store
			} else {
				console.error('Error fetching user role');
			}
		} catch (error) {
			console.error('Failed to fetch role:', error);
		}
	});

	// ฟังก์ชันออกจากระบบ
	async function logout() {
		try {
			const res = await fetch('/api/logout', {
				method: 'POST',
			});
			if (res.ok) {
				userRole.set(''); // รีเซ็ต role เป็นว่าง
				goto('/'); // เปลี่ยนเส้นทางไปยัง Home
			} else {
				console.error('Failed to logout');
			}
		} catch (error) {
			console.error('Error during logout:', error);
		}
	}
</script>

<header>
	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<!-- เมนูสำหรับ admin -->
			{#if $userRole === 'admin'}
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">About</a>
				</li>
				<li aria-current={$page.url.pathname === '/min' ? 'page' : undefined}>
					<a href="/min">Min</a>
				</li>
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Login</a>
				</li>
				<li aria-current={$page.url.pathname === '/step/step1' ? 'page' : undefined}>
					<a href="/step/step1">Form</a>
				</li>

			<!-- เมนูสำหรับ researcher -->
			{:else if $userRole === 'researcher'}
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/step/step1' ? 'page' : undefined}>
					<a href="/step/step1">Form</a>
				</li>

			<!-- เมนูสำหรับ reviewer -->
			{:else if $userRole === 'reviewer'}
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/min' ? 'page' : undefined}>
					<a href="/min">Min</a>
				</li>

			<!-- เมนูสำหรับ judge -->
			{:else if $userRole === 'judge'}
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Login</a>
				</li>

			<!-- เมนูสำหรับ user ที่ยังไม่ session -->
			{:else}
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/step/step1' ? 'page' : undefined}>
					<a href="/step/step1">Form</a>
				</li>
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Login</a>
				</li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<!-- ปุ่ม Logout -->
	{#if $userRole}
		<button on:click={logout} class="logout-btn">Logout</button>
	{/if}
</header>

<style>
	/* header {
		display: flex;
		justify-content: space-between;
	} */

	/* .corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	} */

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
	.logout-btn {
		margin-left: 1rem;
		padding: 0.5rem 1rem;
		border: none;
		background-color: var(--color-theme-1);
		color: white;
		cursor: pointer;
		font-size: 0.9rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.logout-btn:hover {
		background-color: darken(var(--color-theme-1), 10%);
	}
</style>
