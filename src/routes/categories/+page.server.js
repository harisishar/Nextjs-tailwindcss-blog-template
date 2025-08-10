// Redirect /categories to /categories/all
import { redirect } from '@sveltejs/kit';

export function load() {
  throw redirect(302, '/categories/all');
}