import type { RequestEvent } from '@sveltejs/kit';
import db from '$lib/db';
import type { RowDataPacket } from 'mysql2';
import { serialize } from 'cookie'; // ใช้ฟังก์ชัน serialize ในการตั้งคุกกี้

export async function POST({ request, cookies }: RequestEvent) {
    try {
        // อ่านข้อมูลจาก body ของคำขอ
        const { IDcard, phone } = await request.json();

        // ตรวจสอบข้อมูลเบื้องต้น
        if (!IDcard || !phone) {
            return new Response(
                JSON.stringify({ message: 'IDcard and phone are required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT ID, firstname, lastname, email, role FROM users WHERE IDcard = ? AND phone = ?',
            [IDcard, phone]
        );

        // ตรวจสอบว่าพบผู้ใช้หรือไม่
        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ message: 'Invalid IDcard or phone' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const user = rows[0];

        // สร้างคุกกี้ session ที่มี ID ของผู้ใช้
        const sessionCookie = serialize('session', user.ID.toString(), {
            httpOnly: true,  // ทำให้คุกกี้ไม่สามารถเข้าถึงได้จาก JavaScript
            secure: process.env.NODE_ENV === 'production',  // ใช้เฉพาะใน HTTPS ในกรณีที่เป็น production
            path: '/', // คุกกี้สามารถใช้ได้กับโดเมนทั้งหมด
            maxAge: 60 * 60 * 24 * 7 // อายุคุกกี้ 1 สัปดาห์
        });

        // ส่งการตอบกลับพร้อมกับการตั้งคุกกี้ session
        return new Response(
            JSON.stringify({
                message: 'Login successful',
                user: {
                    ID: user.ID,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role
                }
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': sessionCookie // ตั้งคุกกี้ session
                }
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
