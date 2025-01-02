<script lang="ts">
    import { writable } from 'svelte/store';
  
    let uploadStatus = writable('');
    let fileTitle = writable('');
    let fileData: File | null = null;
  
    const uploadFile = async () => {
      if (!fileData) {
        uploadStatus.set('กรุณาเลือกไฟล์');
        return;
      }
  
      const formData = new FormData();
      formData.append('title', $fileTitle);
      formData.append('file_data', fileData);
  
      try {
        const response = await fetch('/api/research', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          uploadStatus.set(`ไฟล์อัปโหลดสำเร็จ! ID การวิจัย: ${data.researchId}`);
        } else {
          uploadStatus.set(`ข้อผิดพลาด: ${data.message}`);
        }
      } catch (error) {
        uploadStatus.set('เกิดข้อผิดพลาดในการอัปโหลด');
      }
    };
  
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files) {
        fileData = target.files[0];
      }
    };
  </script>
  
  <main>
    <h1>อัปโหลดไฟล์ PDF</h1>
    <input type="file" accept=".pdf" on:change={handleFileChange} />
    <input type="text" placeholder="ชื่อไฟล์" bind:value={$fileTitle} />
    <button on:click={uploadFile}>อัปโหลด</button>
    <div>{$uploadStatus}</div>
  </main>
  