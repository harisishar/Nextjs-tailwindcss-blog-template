// Redirect /blogs to home page or could show all blogs
import { redirect } from '@sveltejs/kit';

export function load() {
  throw redirect(302, '/categories/all');
}