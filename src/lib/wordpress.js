import { GraphQLClient } from 'graphql-request';
import { getCachedData, cacheKeys } from './cache.js';
import { env } from '$env/dynamic/private';

// Server-side environment variables
const WORDPRESS_GRAPHQL_ENDPOINT = env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://idw.design/graphql';
const ENABLE_WORDPRESS = env.ENABLE_WORDPRESS_POSTS !== 'false';
const MAX_POSTS = parseInt(env.MAX_WORDPRESS_POSTS) || 50;

const client = new GraphQLClient(WORDPRESS_GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// GraphQL query to fetch posts
const GET_POSTS_QUERY = `
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          content
          excerpt
          date
          modified
          slug
          uri
          status
          author {
            node {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          tags {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// GraphQL query to fetch a single post
const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      excerpt
      date
      modified
      slug
      uri
      status
      author {
        node {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
      tags {
        edges {
          node {
            name
            slug
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch featured posts (fallback to latest posts since metaQuery is not available)
const GET_FEATURED_POSTS_QUERY = `
  query GetFeaturedPosts($first: Int = 4) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      edges {
        node {
          id
          title
          content
          excerpt
          date
          modified
          slug
          uri
          status
          author {
            node {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          tags {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

// Transform WordPress post to match current blog structure
const transformWordPressPost = (post) => {
  return {
    id: post.id,
    title: post.title,
    description: post.excerpt?.replace(/<[^>]*>/g, '') || '', // Strip HTML from excerpt
    publishedAt: new Date(post.date),
    updatedAt: new Date(post.modified),
    url: `/blogs/${post.slug}`,
    slug: post.slug,
    uri: post.uri,
    content: post.content,
    author: post.author?.node?.name || 'Unknown Author',
    image: {
      src: post.featuredImage?.node?.sourceUrl || '/default-blog-image.jpg',
      alt: post.featuredImage?.node?.altText || post.title,
    },
    tags: post.tags?.edges?.map(edge => edge.node.name) || [],
    categories: post.categories?.edges?.map(edge => edge.node.name) || [],
    isPublished: post.status === 'publish',
    readingTime: {
      // Approximate reading time based on content length
      text: `${Math.ceil((post.content?.replace(/<[^>]*>/g, '').length || 0) / 200)} min read`,
      minutes: Math.ceil((post.content?.replace(/<[^>]*>/g, '').length || 0) / 200),
      time: Math.ceil((post.content?.replace(/<[^>]*>/g, '').length || 0) / 200) * 60 * 1000,
      words: (post.content?.replace(/<[^>]*>/g, '').split(' ').length || 0)
    }
  };
};

// Fetch all posts
export async function fetchPosts(first = 10, after = null) {
  try {
    const variables = { first };
    if (after) {
      variables.after = after;
    }
    
    const data = await client.request(GET_POSTS_QUERY, variables);
    
    return {
      posts: data.posts.edges.map(edge => transformWordPressPost(edge.node)),
      pageInfo: data.posts.pageInfo
    };
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return { posts: [], pageInfo: null };
  }
}

// Fetch all posts (for compatibility with existing code)
export async function getAllWordPressPosts() {
  if (!ENABLE_WORDPRESS) {
    return [];
  }
  
  return getCachedData(
    cacheKeys.allPosts(),
    async () => {
      const { posts } = await fetchPosts(MAX_POSTS);
      return posts;
    },
    30 * 60 // 30 minutes cache
  ) || [];
}

// Fetch post by slug
export async function fetchPostBySlug(slug) {
  if (!ENABLE_WORDPRESS) {
    return null;
  }
  
  return getCachedData(
    cacheKeys.postBySlug(slug),
    async () => {
      const data = await client.request(GET_POST_BY_SLUG_QUERY, { slug });
      
      if (!data.postBy) {
        return null;
      }
      
      return transformWordPressPost(data.postBy);
    },
    15 * 60 // 15 minutes cache for individual posts
  );
}

// Fetch featured posts
export async function fetchFeaturedPosts(count = 4) {
  if (!ENABLE_WORDPRESS) {
    return [];
  }
  
  return getCachedData(
    cacheKeys.featuredPosts(count),
    async () => {
      try {
        const data = await client.request(GET_FEATURED_POSTS_QUERY, { first: count });
        
        return data.posts.edges.map(edge => transformWordPressPost(edge.node));
      } catch (error) {
        console.error('Error fetching featured WordPress posts:', error);
        // Fallback to regular posts if featured query fails
        const { posts } = await fetchPosts(count);
        return posts;
      }
    },
    60 * 60 // 1 hour cache for featured posts
  ) || [];
}

// Fetch categories
export async function fetchCategories() {
  const GET_CATEGORIES_QUERY = `
    query GetCategories {
      categories {
        edges {
          node {
            id
            name
            slug
            count
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(GET_CATEGORIES_QUERY);
    return data.categories.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching WordPress categories:', error);
    return [];
  }
}

// Fetch posts by category
export async function fetchPostsByCategory(categorySlug, first = 10) {
  const GET_POSTS_BY_CATEGORY_QUERY = `
    query GetPostsByCategory($categorySlug: String!, $first: Int = 10) {
      posts(first: $first, where: { categoryName: $categorySlug, status: PUBLISH }) {
        edges {
          node {
            id
            title
            content
            excerpt
            date
            modified
            slug
            uri
            status
            author {
              node {
                name
                slug
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              edges {
                node {
                  name
                  slug
                }
              }
            }
            tags {
              edges {
                node {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(GET_POSTS_BY_CATEGORY_QUERY, { categorySlug, first });
    return data.posts.edges.map(edge => transformWordPressPost(edge.node));
  } catch (error) {
    console.error('Error fetching WordPress posts by category:', error);
    return [];
  }
}