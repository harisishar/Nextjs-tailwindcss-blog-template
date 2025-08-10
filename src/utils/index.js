import { getAllWordPressPosts } from '$lib/wordpress.js';
import { sortBlogs, paginateBlogs, slug, formatDate } from './client.js';

// Re-export client-safe utilities
export { sortBlogs, paginateBlogs, slug, formatDate };

// Get all blogs (local + WordPress) - SERVER SIDE ONLY
export const getAllBlogs = async (localBlogs = []) => {
  try {
    const wordpressPosts = await getAllWordPressPosts();
    const allBlogs = [...localBlogs, ...wordpressPosts];
    return sortBlogs(allBlogs);
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return sortBlogs(localBlogs);
  }
};