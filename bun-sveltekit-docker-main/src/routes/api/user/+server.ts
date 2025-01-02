import { getSessionData, getUserById } from '$lib/userUtils';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ request }: RequestEvent) {
  try {
    const sessionData = getSessionData(request);

    if (!sessionData) {
      return new Response(JSON.stringify({ message: 'User not logged in' }), { status: 401 });
    }

    const user = await getUserById(sessionData.userID);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
