import fs from 'fs';  // ใช้ 'fs' เพื่อเข้าถึงฟังก์ชัน 'createReadStream'
import path from 'path';
import db from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const { researchId } = params;

  try {
    // ค้นหาไฟล์จากฐานข้อมูลตาม researchId
    const [rows]: [any[], any] = await db.query(
      'SELECT file_data, file_name FROM research WHERE id = ?',
      [researchId]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: 'File not found' }), { status: 404 });
    }

    const fileData = rows[0].file_data;
    const fileName = rows[0].file_name;

    // สร้างไฟล์ชั่วคราว
    const tempFilePath = path.join(process.cwd(), 'uploads', fileName);
    await fs.promises.writeFile(tempFilePath, fileData);  // ใช้ fs.promises.writeFile เพื่อบันทึกไฟล์

    // แปลง ReadStream เป็น ReadableStream
    const fileStream = fs.createReadStream(tempFilePath);
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => {
          controller.enqueue(chunk);  // นำข้อมูลที่ได้รับจาก ReadStream ใส่ใน ReadableStream
        });

        fileStream.on('end', () => {
          controller.close();  // ปิด stream เมื่อไฟล์หมด
        });

        fileStream.on('error', (err) => {
          controller.error(err);  // ส่งต่อข้อผิดพลาด
        });
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error: unknown) {
    // จัดการประเภท 'unknown' ของ error
    if (error instanceof Error) {
      console.error(error.message);
      return new Response(
        JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        { status: 500 }
      );
    }
    // กรณีข้อผิดพลาดที่ไม่รู้จัก
    console.error('Unknown error occurred');
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
};
