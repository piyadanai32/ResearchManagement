<script>

</script>

<svelte:head>
    <title>Information</title>
    <meta name="description" content="Information" />
</svelte:head>

<div class="step1-container">
    <div>
        <h1>Research Information</h1>
        <form action="">
            <div class="form-group">
                <label for="title">Title (ชื่อวิจัย) :</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div class="form-group">
                <label for="file">File:</label>
                <input type="file" id="file" name="file" required>
            </div>
        </form>
    </div>
    <div class="formbutton">
        <button type="submit" class="submit-button">Confirm</button>
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