import type { RequestHandler } from './$types';
import { parse } from 'cookie'; // ใช้สำหรับอ่านค่า cookie
import db from '$lib/db'; // ตรวจสอบว่าคุณมีไฟล์ db.ts สำหรับการเชื่อมต่อฐานข้อมูล
import type { RowDataPacket } from 'mysql2';

export const GET: RequestHandler = async ({ request }) => {
    try {
        // ดึง cookie จาก request headers
        const cookies = request.headers.get('cookie') || '';
        const parsedCookies = parse(cookies);
        const sessionId = parsedCookies.session; // อ่านค่า session จาก cookie

        if (!sessionId) {
            return new Response(JSON.stringify({ message: 'User not logged in' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // คำสั่ง SQL เพื่อดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT IDcard, firstname, lastname, email, phone FROM users WHERE ID = ?',
            [sessionId]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = rows[0];

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in GET /api/getUser:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
