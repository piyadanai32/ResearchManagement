<script>
    import Header from '../lib/components/Header.svelte';
    import './styles.css';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    export let user = writable(null);

    // ดึงข้อมูลผู้ใช้เมื่อเริ่มต้น
    onMount(async () => {
        try {
            const res = await fetch('/api/user', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                user.set(data.user);
            } else {
                user.set(null); // กำหนดค่าเริ่มต้นหากผู้ใช้ไม่ได้ล็อกอิน
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            user.set(null);
        }
    });
</script>

<div class="app">
    <Header />
    <main>
        <slot />
    </main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
