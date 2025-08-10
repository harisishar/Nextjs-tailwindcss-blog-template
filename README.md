# SvelteKit Blog with WordPress GraphQL

A modern blog template built with SvelteKit, Tailwind CSS, and WordPress GraphQL integration.

## Features

- 🚀 **SvelteKit** - Fast, modern web framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📝 **WordPress GraphQL** - Headless CMS integration
- 🌙 **Dark Mode** - Built-in theme switching
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Server-side rendering and caching
- 🏷️ **Categories & Tags** - Organized content structure
- 🔍 **SEO Optimized** - Meta tags and structured data

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sveltekit-blog-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your WordPress GraphQL endpoint:
   ```
   WORDPRESS_GRAPHQL_ENDPOINT=https://your-wordpress-site.com/graphql
   ENABLE_WORDPRESS_POSTS=true
   MAX_WORDPRESS_POSTS=50
   SITE_URL=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── lib/
│   ├── wordpress.js     # WordPress GraphQL client
│   ├── cache.js         # Caching utilities
│   └── config.js        # Configuration settings
├── routes/
│   ├── +layout.svelte   # Main layout component
│   ├── +page.svelte     # Home page
│   ├── about/           # About page
│   ├── blogs/
│   │   └── [slug]/      # Dynamic blog post pages
│   └── categories/
│       └── [slug]/      # Dynamic category pages
├── utils/
│   └── index.js         # Utility functions
├── app.css              # Global styles
└── app.html             # HTML template
```

## WordPress Setup

To use this blog template, you'll need a WordPress site with GraphQL support:

1. **Install WPGraphQL plugin** on your WordPress site
2. **Enable GraphQL endpoint** (usually at `/graphql`)
3. **Configure your endpoint** in the `.env` file
4. **Optional:** Install additional GraphQL plugins for extended functionality

### Required WordPress GraphQL Schema

The template expects the following GraphQL fields to be available:

```graphql
query GetPosts {
  posts {
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
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte checks

### Customization

#### Styling
- Modify `tailwind.config.js` to customize Tailwind CSS configuration
- Update `src/app.css` for global styles
- Colors and theme settings can be found in the Tailwind config

#### Content
- WordPress content is automatically fetched via GraphQL
- Categories and tags are dynamically generated
- Local content can be added by extending the utilities in `src/utils/`

#### Caching
- Built-in memory caching for WordPress content
- Cache durations can be configured in `src/lib/cache.js`
- Shorter cache durations in development mode

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred hosting platform**
   - Vercel
   - Netlify
   - Node.js server
   - Static hosting (with adapter-static)

3. **Update environment variables** for production

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WORDPRESS_GRAPHQL_ENDPOINT` | WordPress GraphQL API endpoint | `https://idw.design/graphql` |
| `ENABLE_WORDPRESS_POSTS` | Enable/disable WordPress integration | `true` |
| `MAX_WORDPRESS_POSTS` | Maximum posts to fetch | `50` |
| `SITE_URL` | Your site URL | `http://localhost:5173` |

### Site Metadata

Update `src/lib/config.js` to customize your site information:

```javascript
export const siteMetadata = {
  title: 'Your Blog Title',
  author: 'Your Name',
  description: 'Your blog description',
  siteUrl: 'https://yourblog.com',
  // ... other settings
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- WordPress integration via [GraphQL](https://www.wpgraphql.com/)
- Based on the Next.js blog template structure