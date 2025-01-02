<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Store สำหรับแสดงสถานะการดาวน์โหลด
    let downloadStatus = writable('');
  
    // ฟังก์ชันสำหรับดาวน์โหลดไฟล์
    const downloadFile = async (researchId: string) => {
      try {
        // ดึงไฟล์จาก API
        const response = await fetch(`/api/research/${researchId}`, {
          method: 'GET',
        });
  
        // ตรวจสอบว่าการตอบสนองสำเร็จหรือไม่
        if (!response.ok) {
          throw new Error('ไม่สามารถดาวน์โหลดไฟล์ได้');
        }
  
        // ดึงข้อมูลจาก response
        const blob = await response.blob();
  
        // สร้าง URL สำหรับดาวน์โหลด
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = researchId; // ตั้งชื่อไฟล์ตาม researchId (หรือชื่อที่คุณต้องการ)
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        // อัปเดตสถานะการดาวน์โหลด
        downloadStatus.set('ดาวน์โหลดสำเร็จ!');
      } catch (error: unknown) {
        // ตรวจสอบว่าถ้า error เป็น instance ของ Error
        if (error instanceof Error) {
          downloadStatus.set(`เกิดข้อผิดพลาด: ${error.message}`);
        } else {
          // ถ้าไม่สามารถระบุประเภทได้
          downloadStatus.set('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        }
      }
    };
  </script>
  
  <style>
    .download-status {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  </style>
  
  <main>
    <h1>ขั้นตอนที่ 3: ดาวน์โหลดไฟล์</h1>
  
    <!-- ปุ่มดาวน์โหลดไฟล์ -->
    <button on:click={() => downloadFile('123')}>ดาวน์โหลดไฟล์</button>
  
    <!-- แสดงสถานะการดาวน์โหลด -->
    <div class="download-status">
      {$downloadStatus}
    </div>
  </main>
  