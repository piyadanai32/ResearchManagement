import { serialize } from 'cookie';
import db from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';
import type { RowDataPacket } from 'mysql2';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { IDcard, phone } = await request.json();

    if (!IDcard || !phone) {
      return new Response(JSON.stringify({ message: 'IDcard and phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT ID, firstname, lastname, email, role, IDcard, phone FROM users WHERE IDcard = ? AND phone = ?',
      [IDcard, phone]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid IDcard or phone' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = rows[0];

    const sessionCookie = serialize('session', JSON.stringify({
      userID: user.ID,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({ message: 'Login successful', user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
