import { getAllBlogs, slug, paginateBlogs } from '../../../utils/index.js';

export async function load({ params, url }) {
  try {
    // Get page number from URL params
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // Get all blogs (WordPress + any future local blogs)
    const allBlogs = await getAllBlogs([]);
    
    // Filter blogs based on the category slug
    const categoryBlogs = allBlogs.filter(blog => {
      if (params.slug === 'all') {
        return true; // Show all blogs if 'all' category is selected
      }
      
      // Check if blog has tags that match the category slug
      return blog.tags?.some(tag => slug(tag) === params.slug) ||
             blog.categories?.some(category => slug(category) === params.slug);
    });

    // Apply pagination to filtered blogs
    const paginatedResult = paginateBlogs(categoryBlogs, page, 8);

    // Get all unique categories from all blogs
    const allCategories = ['all']; // Start with 'all' category
    
    allBlogs.forEach(blog => {
      // Add tags as categories
      blog.tags?.forEach(tag => {
        const slugified = slug(tag);
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified);
        }
      });
      
      // Add categories
      blog.categories?.forEach(category => {
        const slugified = slug(category);
        if (!allCategories.includes(slugified)) {
          allCategories.push(slugified);
        }
      });
    });

    // Sort categories alphabetically
    allCategories.sort();

    return {
      blogs: paginatedResult.blogs,
      pagination: paginatedResult.pagination,
      categories: allCategories,
      currentCategory: params.slug,
      categoryTitle: params.slug === 'all' ? 'All Articles' : params.slug.replace('-', ' ')
    };
  } catch (error) {
    console.error('Error loading category page:', error);
    return {
      blogs: [],
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
      categories: ['all'],
      currentCategory: params.slug,
      categoryTitle: params.slug
    };
  }
}