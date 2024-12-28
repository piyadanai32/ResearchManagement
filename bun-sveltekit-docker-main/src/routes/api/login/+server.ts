import type { RequestEvent } from '@sveltejs/kit';
import db from '$lib/db'; // นำเข้าการเชื่อมต่อฐานข้อมูล
import type { RowDataPacket } from 'mysql2'; // ใช้สำหรับจัดการผลลัพธ์ฐานข้อมูล

export async function POST({ request }: RequestEvent) {
    try {
        // อ่านข้อมูลจาก request body
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
            'SELECT ID, firstname, lastname, email FROM users WHERE IDcard = ? AND phone = ?',
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

        // ส่งข้อมูลผู้ใช้กลับไป
        return new Response(
            JSON.stringify({
                message: 'Login successful',
                user: {
                    ID: user.ID,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                }
            }),
            {
                status: 200,
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
