import { fetchPostBySlug } from '../../../lib/wordpress.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const blog = await fetchPostBySlug(params.slug);
    
    if (!blog) {
      throw error(404, 'Blog post not found');
    }
    
    return {
      blog,
      isWordPress: true
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(404, 'Blog post not found');
  }
}