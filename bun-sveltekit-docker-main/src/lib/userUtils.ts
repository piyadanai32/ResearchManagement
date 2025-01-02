import { parse } from 'cookie';
import db from '$lib/db';
import type { RowDataPacket } from 'mysql2';

// ฟังก์ชันในการดึงข้อมูล session จากคุกกี้
export function getSessionData(request: Request) {
  const cookies = parse(request.headers.get('cookie') || '');
  const sessionId = cookies.session;
  return sessionId ? JSON.parse(sessionId) : null;
}

// ฟังก์ชันในการดึงข้อมูลผู้ใช้จากฐานข้อมูล
export async function getUserById(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT ID, firstname, lastname, email, phone, role FROM users WHERE ID = ?',
    [userId]
  );
  return rows[0];
}

// ฟังก์ชันในการตรวจสอบสิทธิ์ของผู้ใช้
export async function hasUploadPermission(userId: number): Promise<boolean> {
  const user = await getUserById(userId);
  if (user && (user.role === 'researcher' || user.role === 'admin')) {
    return true;
  }
  return false;
}
