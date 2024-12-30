<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    // เก็บข้อมูลผู้ใช้ใน store
    const userData = writable({
        IDcard: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    });

    // โหลดข้อมูลเมื่อ component mount
    onMount(async () => {
        try {
            const response = await fetch('/api/getUser', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                userData.set(data.user); // ตั้งค่าข้อมูลใน store
            } else {
                console.error('Failed to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    });

    // ข้อมูลที่ bind กับ input
    let formData = {
        IDcard: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    };

    // subscribe ข้อมูลจาก store
    userData.subscribe((data) => {
        formData = { ...data };
    });

    // ฟังก์ชันสำหรับ submit ข้อมูล
    const submitForm = async () => {
        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('User information updated successfully.');
            } else {
                alert('Failed to update user information.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
</script>

<svelte:head>
    <title>Information</title>
    <meta name="description" content="Information" />
</svelte:head>

<div class="step1-container">
    <div>
        <h1>Researcher Information</h1>
        <form on:submit|preventDefault={submitForm}>
            <div class="form-group">
                <label for="IDcard">National ID Card (เลขบัตรประชาชน) :</label>
                <input type="text" id="IDcard" name="IDcard" bind:value={formData.IDcard} required />
            </div>
            <div class="form-group">
                <label for="firstname">First name (ชื่อ) :</label>
                <input type="text" id="firstname" name="firstname" bind:value={formData.firstname} required />
            </div>
            <div class="form-group">
                <label for="lastname">Last name (นามสกุล) :</label>
                <input type="text" id="lastname" name="lastname" bind:value={formData.lastname} required />
            </div>
            <div class="form-group">
                <label for="email">Email (อีเมล) :</label>
                <input type="email" id="email" name="email" bind:value={formData.email} required />
            </div>
            <div class="form-group">
                <label for="phone">Phone (เบอร์โทรศัพท์) :</label>
                <input type="tel" id="phone" name="phone" bind:value={formData.phone} required />
            </div>
            <div class="formbutton">
                <button type="submit" class="submit-button">Confirm</button>
            </div>
        </form>
    </div>
</div>

<style>
    .step1-container {
        max-width: 450px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
    }
    h1 {
        text-align: center;
        margin-bottom: 20px;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    input {
        width: 100%;
        padding: 8px;
        font-size: 16px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .submit-button {
        
        width: 50%;
        padding: 10px;
        font-size: 16px;
        color: #fff;
        background-color: #007BFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .submit-button:hover {
        background-color: #0056b3;
    }
    .formbutton {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>