import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	try {
		// ทำลาย session หรือคุกกี้ session
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			'session=; Max-Age=0; Path=/; HttpOnly; Secure'
		);

		return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
			status: 200,
			headers,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ message: 'Logout failed' }),
			{ status: 500 }
		);
	}
}