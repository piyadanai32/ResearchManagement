import type { RequestEvent } from '@sveltejs/kit';
import db from '$lib/db';
import { parse } from 'cookie';
import type { RowDataPacket } from 'mysql2';

export async function GET({ request }: RequestEvent) {
    try {
        // ดึงข้อมูลคุกกี้ session
        const cookies = parse(request.headers.get('cookie') || '');
        const sessionId = cookies.session;

        // หากไม่มีคุกกี้ session ให้ตอบกลับเป็น unauthorized
        if (!sessionId) {
            return new Response(
                JSON.stringify({ message: 'User not logged in' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ session ID
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT ID, firstname, lastname, email, role FROM users WHERE ID = ?',
            [sessionId]
        );

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = rows[0];

        return new Response(
            JSON.stringify({
                message: 'User data retrieved successfully',
                user: {
                    ID: user.ID,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error in GET handler:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
