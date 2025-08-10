import { getAllBlogs, paginateBlogs } from '../utils/index.js';

export async function load({ url }) {
  try {
    // Get page number from URL params
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // For now, we'll just get WordPress posts since we don't have local content setup yet
    const allBlogs = await getAllBlogs([]);
    
    // Apply pagination to all blogs
    const paginatedResult = paginateBlogs(allBlogs, page, 8);
    
    return {
      blogs: allBlogs,
      paginatedBlogs: paginatedResult.blogs,
      pagination: paginatedResult.pagination,
      featuredBlogs: allBlogs.slice(0, 3),
      recentBlogs: allBlogs.slice(0, 6)
    };
  } catch (error) {
    console.error('Error loading blogs:', error);
    return {
      blogs: [],
      paginatedBlogs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalPosts: 0,
        postsPerPage: 8,
        hasNextPage: false,
        hasPrevPage: false,
        startIndex: 0,
        endIndex: 0
      },
      featuredBlogs: [],
      recentBlogs: []
    };
  }
}