'use server';

import { cookies } from 'next/headers';

export async function createCookie(name, token) {
  const oneDay = 24 * 60 * 60(await cookies()).set(name, token, { maxAge: oneDay });
}

export async function deleteCookie(name) {
  (await cookies()).delete(name);
}
