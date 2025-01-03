import path from 'path';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import db from '$lib/db';
import { getSessionData, hasUploadPermission } from '$lib/userUtils';
import type { RequestHandler } from '@sveltejs/kit';
import type { OkPacket, FieldPacket } from 'mysql2';
import { Readable } from 'stream';

const uploadDir = path.join(process.cwd(), 'uploads');

export const POST: RequestHandler = async ({ request }) => {
  try {
    // ตรวจสอบ Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ message: 'Content-Type must be multipart/form-data' }),
        { status: 400 }
      );
    }

    // ตรวจสอบการเข้าสู่ระบบ
    const sessionData = getSessionData(request);
    if (!sessionData) {
      return new Response(JSON.stringify({ message: 'User not logged in' }), { status: 401 });
    }

    // ตรวจสอบสิทธิ์
    const hasPermission = await hasUploadPermission(sessionData.userID);
    if (!hasPermission) {
      return new Response(JSON.stringify({ message: 'You do not have permission to upload files' }), { status: 403 });
    }

    // อ่านข้อมูล multipart/form-data
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const nodeStream = Readable.from(buffer);
    (nodeStream as any).headers = Object.fromEntries(request.headers);

    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => {
        return `${Date.now()}-${part.originalFilename}`; // เก็บชื่อไฟล์เดิม
      }
    });

    const parseForm = new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(nodeStream as any, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { fields, files } = await parseForm;

    // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่
    if (!files.file_data) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    const file = files.file_data[0];
    const filePath = file.filepath;
    const originalName = file.originalFilename || 'uploaded_file.pdf';

    // อ่านข้อมูลไฟล์
    const fileData = await fs.readFile(filePath);
    const title = fields.title?.[0] || originalName;
    const userId = sessionData.userID;

    // บันทึกข้อมูลในฐานข้อมูล
    const [result]: [OkPacket, FieldPacket[]] = await db.query(
      'INSERT INTO research (title, file_data, user_id, file_name) VALUES (?, ?, ?, ?)',
      [title, fileData, userId, originalName]
    );

    // ลบไฟล์ชั่วคราว
    await fs.unlink(filePath);

    return new Response(
      JSON.stringify({ message: 'File uploaded successfully', researchId: result.insertId }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        { status: 500 }
      );
    }
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const [rows]: [any[], any] = await db.query(
      'SELECT id, title, file_name FROM research'
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};