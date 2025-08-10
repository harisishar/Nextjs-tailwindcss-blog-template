import { dev } from '$app/environment';

// WordPress configuration (server-side only)
// These will be injected by the server-side modules that need them
export const WORDPRESS_GRAPHQL_ENDPOINT = 'https://idw.design/graphql';
export const ENABLE_WORDPRESS = true;
export const MAX_POSTS = 50;

// Site configuration (can be used client-side)
export const siteMetadata = {
  title: 'SvelteKit Blog With Tailwind CSS and WordPress',
  author: 'CodeBucks',
  headerTitle: 'SvelteKit Blog',
  description: 'A blog created with SvelteKit, Tailwind.css and WordPress GraphQL.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: dev ? 'http://localhost:5176' : 'https://yoursite.com', 
  siteLogo: '/logo.png',
  socialBanner: '/social-banner.png', // add social banner in the public folder
  email: 'codebucks27@gmail.com', 
  github: 'https://github.com/codebucks27',
  twitter: 'https://twitter.com/code_bucks',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com/codebucks',
  linkedin: 'https://www.linkedin.com/in/codebucks/',
  dribbble: 'https://www.dribbble.com',
  locale: 'en-US',
};