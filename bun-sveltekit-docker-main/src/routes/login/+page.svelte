<script>
    import { goto } from '$app/navigation'; // นำเข้า goto สำหรับการเปลี่ยนเส้นทาง

    let IDcard = '';
    let phone = ''; 

    const handleLogin = async () => {
        console.log(`Logging in with IDcard: ${IDcard}, Phone: ${phone}`);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ IDcard, phone })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login Successful:', data);
                alert(`Welcome ${data.user.firstname} ${data.user.lastname}`);
                
                // เปลี่ยนเส้นทางไปยังหน้าอื่น 
                goto('/'); 

                // รีเฟรชหน้า
                window.location.reload();
            } else {
                const error = await response.json();
                console.error('Login Failed:', error.message);
                alert(error.message);
            }
        } catch (err) {
            console.error('Error while logging in:', err);
            alert('Something went wrong. Please try again later.');
        }
    };
</script>

<svelte:head>
    <title>Login</title>
    <meta name="description" content="Login to access your account" />
</svelte:head>

<div class="login-container">
    <h1>Login</h1>
    <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
            <label for="phone">Phone:</label>
            <input
                type="text"
                id="phone"
                bind:value={phone}
                placeholder="Enter your phone number"
                required
            />
        </div>
        <div class="form-group">
            <label for="IDcard">National ID Card:</label>
            <input
                type="text"
                id="IDcard"
                bind:value={IDcard}
                placeholder="Enter your National ID Card"
                required
            />
        </div>
        <button type="submit" class="submit-button">Login</button>
    </form>
</div>

<style>
    .login-container {
        max-width: 400px;
        width: 100%;
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
        width: 100%;
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
</style>
