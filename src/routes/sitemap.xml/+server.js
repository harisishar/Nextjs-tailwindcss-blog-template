import { client } from '../../utils/client.js';
import { siteMetadata } from '../../lib/config.js';

const SITE_URL = siteMetadata.siteUrl;

export async function GET() {
  try {
    // Fetch all blog posts
    const query = `
      query GetAllPosts {
        posts(first: 1000, where: { status: PUBLISH }) {
          edges {
            node {
              slug
              modified
              date
            }
          }
        }
        categories(first: 100) {
          edges {
            node {
              slug
              modified: date
            }
          }
        }
        tags(first: 100) {
          edges {
            node {
              slug
              modified: date
            }
          }
        }
      }
    `;

    const data = await client.request(query);
    const posts = data.posts?.edges || [];
    const categories = data.categories?.edges || [];
    const tags = data.tags?.edges || [];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About page -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog listing page -->
  <url>
    <loc>${SITE_URL}/blogs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Categories listing page -->
  <url>
    <loc>${SITE_URL}/categories</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Blog posts -->
  ${posts.map(({ node: post }) => `
  <url>
    <loc>${SITE_URL}/blogs/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Categories -->
  ${categories.map(({ node: category }) => `
  <url>
    <loc>${SITE_URL}/categories/${category.slug}</loc>
    <lastmod>${new Date(category.modified).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Tags (optional, uncomment if you want tag pages) -->
  <!--
  ${tags.map(({ node: tag }) => `
  <url>
    <loc>${SITE_URL}/tags/${tag.slug}</loc>
    <lastmod>${new Date(tag.modified).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
  -->
</urlset>`;

    return new Response(sitemap.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap if there's an error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blogs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(basicSitemap.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}