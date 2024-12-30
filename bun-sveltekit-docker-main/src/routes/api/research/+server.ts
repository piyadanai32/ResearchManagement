import type { RequestEvent } from '@sveltejs/kit';
import db from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function POST({ request, cookies }: RequestEvent) {
    try {
        // อ่านข้อมูลจาก body ของคำขอ
        const { title, file_name, file_path, user_id, status } = await request.json();

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!title || !file_name || !file_path || !user_id) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: title, file_name, file_path, user_id' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // อ่านคุกกี้ session
        const cookiesHeader = cookies.get('session');
        if (!cookiesHeader) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized: Missing session cookie' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // ดึง user_id จาก session คุกกี้
        const sessionUserId = parseInt(cookiesHeader, 10);

        // ตรวจสอบว่า user_id ใน session กับที่ส่งมาจาก body ตรงกัน
        if (sessionUserId !== user_id) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized: User ID mismatch' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // ตรวจสอบ role ของผู้ใช้จากฐานข้อมูล
        const [rows] = await db.query<RowDataPacket[]>('SELECT role FROM users WHERE id = ?', [user_id]);
        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const userRole = rows[0].role;
        if (userRole !== 'admin' && userRole !== 'researcher') {
            return new Response(
                JSON.stringify({ message: 'Unauthorized: User role must be admin or researcher' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // อ่านประเภทไฟล์จากนามสกุล
        const fileExtension = file_name.split('.').pop()?.toUpperCase();

        const validFileTypes = ['PDF', 'DOCX', 'PPTX', 'TXT'];
        if (!fileExtension || !validFileTypes.includes(fileExtension)) {
            return new Response(
                JSON.stringify({ message: 'Invalid file type' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // ตรวจสอบค่า status
        const validStatuses = ['submitted', 'approved', 'rejected', 'in_review'];
        if (status && !validStatuses.includes(status)) {
            return new Response(
                JSON.stringify({ message: 'Invalid status value' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // เพิ่มข้อมูลในฐานข้อมูล
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO research (title, file_name, file_path, file_type, user_id, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, file_name, file_path, fileExtension, user_id, status || 'submitted']
        );

        // ตรวจสอบผลลัพธ์การเพิ่มข้อมูล
        if (result.affectedRows === 0) {
            return new Response(
                JSON.stringify({ message: 'Failed to create research' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // ส่งการตอบกลับสำเร็จ
        return new Response(
            JSON.stringify({
                message: 'Research created successfully',
                research: {
                    id: result.insertId,
                    title,
                    file_name,
                    file_path,
                    file_type: fileExtension,
                    user_id,
                    status: status || 'submitted'
                }
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
