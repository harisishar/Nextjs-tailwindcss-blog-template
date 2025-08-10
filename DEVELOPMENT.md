# Development Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd sveltekit-blog-template
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update your WordPress GraphQL endpoint in `.env`:
   ```
   WORDPRESS_GRAPHQL_ENDPOINT=https://your-wordpress-site.com/graphql
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173 (or the port shown in terminal)

## Architecture

### WordPress Integration
- **GraphQL Client**: `src/lib/wordpress.js`
- **Caching System**: `src/lib/cache.js` (30-60 minute TTL)
- **Configuration**: `src/lib/config.js`

### Routing Structure
```
/                     # Home page with featured/recent posts
/blogs/[slug]        # Individual blog post pages
/categories/[slug]   # Category pages with filtered posts
/categories/all      # All posts (default category view)
/about              # About page
```

### Data Flow
1. WordPress posts are fetched via GraphQL
2. Data is cached in memory with TTL
3. Posts are transformed to match blog structure
4. Combined with any local content (extensible)

## WordPress Requirements

### Required Plugins
- **WPGraphQL** (minimum requirement)
- **WPGraphQL for Advanced Custom Fields** (optional, for custom fields)

### GraphQL Schema
The app expects these fields to be available:
```graphql
query GetPosts {
  posts {
    edges {
      node {
        id, title, content, excerpt, date, modified, slug, uri, status
        author { node { name, slug } }
        featuredImage { node { sourceUrl, altText } }
        categories { edges { node { name, slug } } }
        tags { edges { node { name, slug } } }
      }
    }
  }
}
```

## Customization

### Styling
- **Tailwind Config**: `tailwind.config.js`
- **Global Styles**: `src/app.css`
- **Theme Colors**: Defined in Tailwind config under `theme.extend.colors`

### Content Structure
Posts are transformed to this structure:
```javascript
{
  id, title, description, publishedAt, updatedAt, url, slug,
  content, author, image: { src, alt }, tags: [], categories: [],
  isPublished, readingTime: { text, minutes, time, words }
}
```

### Caching
- **Development**: Max 5 minutes TTL
- **Production**: 30-60 minutes TTL
- **Stale Data**: Falls back to 24-hour-old data if fetch fails

## Component Structure

### Layout
- `+layout.svelte`: Main layout with navigation and dark mode
- `+page.svelte`: Home page with hero, featured, and recent sections

### Blog Components
- `blogs/[slug]/+page.svelte`: Individual post display
- `categories/[slug]/+page.svelte`: Category listing with filtering

### Utilities
- `src/utils/index.js`: Helper functions for sorting, formatting, etc.

## Development Tips

### Adding Local Content
1. Create content files (markdown, etc.)
2. Update `src/utils/index.js` to include local content in `getAllBlogs()`
3. Modify transformation functions as needed

### Adding New Routes
1. Create route directory in `src/routes/`
2. Add `+page.js` for data loading
3. Add `+page.svelte` for the component

### Environment Variables
- `WORDPRESS_GRAPHQL_ENDPOINT`: Your WordPress GraphQL URL
- `ENABLE_WORDPRESS_POSTS`: true/false to enable WordPress integration
- `MAX_WORDPRESS_POSTS`: Maximum posts to fetch (default: 50)
- `SITE_URL`: Your site URL for metadata

## Performance Considerations

### Caching Strategy
- In-memory caching with TTL
- Stale-while-revalidate pattern
- Environment-specific cache durations

### Build Optimization
- Only generates static params for local content
- WordPress content handled via SSR/ISR
- Optimized images with lazy loading

## Deployment

### Vercel
```bash
npm run build
# Deploy build output
```

### Node.js
```bash
npm run build
npm run preview
# Or use adapter-node and deploy the build
```

### Static Hosting
Use `@sveltejs/adapter-static` for static site generation.

## Troubleshooting

### Common Issues

1. **GraphQL Errors**
   - Check WordPress GraphQL endpoint accessibility
   - Verify WPGraphQL plugin is active
   - Check console for detailed error messages

2. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports in app.css

3. **Build Errors**
   - Check environment variables
   - Verify WordPress endpoint is accessible during build
   - Review console output for specific errors

### Debug Mode
Set `NODE_ENV=development` for:
- Shorter cache durations
- More detailed error logging
- Hot module reloading