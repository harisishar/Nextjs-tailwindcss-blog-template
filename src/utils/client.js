// Client-safe utility functions

// Create slug from string
export const slug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, ''); // trim - from end of text
};

// Format date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Sort function for blogs
export const sortBlogs = (blogs) => {
  return blogs
    .slice()
    .sort((a, b) => {
      const dateA = typeof a.publishedAt === 'string' ? new Date(a.publishedAt) : a.publishedAt;
      const dateB = typeof b.publishedAt === 'string' ? new Date(b.publishedAt) : b.publishedAt;
      
      return dateB - dateA;
    });
};

// Pagination utility function
export const paginateBlogs = (blogs, page = 1, postsPerPage = 8) => {
  const totalPosts = blogs.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  return {
    blogs: blogs.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalPosts)
    }
  };
};