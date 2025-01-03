<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  interface ResearchFile {
    id: number;
    title: string;
    fileName: string;
  }

  const files = writable<ResearchFile[]>([]);
  const fetchStatus = writable('');

  // ดึงข้อมูลไฟล์ทั้งหมดจากฐานข้อมูล
  const fetchFiles = async () => {
    fetchStatus.set('กำลังโหลด...');
    try {
      const response = await fetch('/api/research');
      if (response.ok) {
        const data: ResearchFile[] = await response.json();
        files.set(data);
        fetchStatus.set('');
      } else {
        const errorData = await response.json();
        fetchStatus.set(`ข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      fetchStatus.set('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  };

  // เรียกฟังก์ชัน fetchFiles เมื่อคอมโพเนนต์ถูกโหลด
  onMount(() => {
    fetchFiles();
  });
</script>

<main>
  <h1>ไฟล์การวิจัยทั้งหมด</h1>
  <p>{$fetchStatus}</p>
  
  {#if $files.length > 0}
    <ul>
      {#each $files as file}
        <li>
          <strong>{file.title}</strong> ({file.fileName})
          <a href={`/api/research/download/${file.id}`} download={file.fileName}>
            ดาวน์โหลด
          </a>
        </li>
      {/each}
    </ul>
  {:else if $fetchStatus === ''}
    <p>ไม่มีไฟล์ในฐานข้อมูล</p>
  {/if}
</main>
