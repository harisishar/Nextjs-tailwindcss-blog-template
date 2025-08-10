/**
 * SEO utility functions for the SvelteKit blog
 */
import { siteMetadata, seoConfig } from '../lib/config.js';

/**
 * Generates an SEO-friendly slug from a string
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncates text to a specific length with ellipsis
 */
export function truncateText(text, maxLength = 160) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3).trim() + '...';
}

/**
 * Generates optimized meta description from content
 */
export function generateMetaDescription(content, maxLength = 160) {
  if (!content) return '';
  
  // Strip HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  const normalizedContent = cleanContent.replace(/\s+/g, ' ').trim();
  
  return truncateText(normalizedContent, maxLength);
}

/**
 * Generates SEO-optimized title with site name
 */
export function generateSEOTitle(pageTitle, siteName = siteMetadata.headerTitle) {
  if (!pageTitle) return siteName;
  
  // Truncate title to prevent it being too long
  const maxTitleLength = 60 - siteName.length - 3; // Account for " - " separator
  const truncatedTitle = truncateText(pageTitle, maxTitleLength);
  
  return `${truncatedTitle}${seoConfig.titleSeparator}${siteName}`;
}

/**
 * Generates Open Graph data for social sharing
 */
export function generateOpenGraphData(post, siteUrl = siteMetadata.siteUrl) {
  const ogData = {
    title: post.title,
    description: generateMetaDescription(post.description || post.content, 160),
    type: 'article',
    url: `${siteUrl}${post.url || `/blogs/${generateSlug(post.title)}`}`,
    image: post.image?.src || `${siteUrl}${seoConfig.defaultImage}`,
    site_name: siteMetadata.headerTitle
  };

  if (post.author) {
    ogData['article:author'] = post.author;
  }
  
  if (post.publishedAt) {
    ogData['article:published_time'] = new Date(post.publishedAt).toISOString();
  }
  
  if (post.tags && post.tags.length > 0) {
    ogData['article:tag'] = post.tags;
  }

  return ogData;
}

/**
 * Generates Twitter Card data
 */
export function generateTwitterCardData(post, siteUrl = siteMetadata.siteUrl) {
  return {
    card: 'summary_large_image',
    title: post.title,
    description: generateMetaDescription(post.description || post.content, 160),
    image: post.image?.src || `${siteUrl}${seoConfig.defaultImage}`,
    creator: post.author ? `@${post.author.replace(/\s+/g, '').toLowerCase()}` : seoConfig.twitterHandle
  };
}

/**
 * Generates structured data (JSON-LD) for blog posts
 */
export function generateStructuredData(post, siteUrl = siteMetadata.siteUrl) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: generateMetaDescription(post.description || post.content, 160),
    url: `${siteUrl}${post.url || `/blogs/${generateSlug(post.title)}`}`,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: post.modifiedAt ? new Date(post.modifiedAt).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || siteMetadata.author
    },
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.headerTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${siteMetadata.siteLogo}`
      }
    }
  };

  if (post.image?.src) {
    structuredData.image = {
      '@type': 'ImageObject',
      url: post.image.src,
      alt: post.image.alt || post.title
    };
  }

  if (post.tags && post.tags.length > 0) {
    structuredData.keywords = post.tags.join(', ');
  }

  if (post.readingTime?.minutes) {
    structuredData.timeRequired = `PT${post.readingTime.minutes}M`;
  }

  return structuredData;
}

/**
 * Generates canonical URL
 */
export function generateCanonicalUrl(path, siteUrl = siteMetadata.siteUrl) {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Validates and optimizes heading structure
 */
export function optimizeHeadingStructure(headings) {
  const optimized = [];
  let currentLevel = 1;
  
  headings.forEach(heading => {
    // Ensure proper heading hierarchy (no skipping levels)
    if (heading.level > currentLevel + 1) {
      heading.level = currentLevel + 1;
    }
    
    currentLevel = heading.level;
    optimized.push({
      ...heading,
      id: generateSlug(heading.text),
      text: heading.text.trim()
    });
  });
  
  return optimized;
}