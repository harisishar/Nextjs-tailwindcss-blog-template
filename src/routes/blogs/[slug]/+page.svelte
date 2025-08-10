<script>
  import { formatDate, slug } from '../../../utils/client.js';
  import { 
    generateSEOTitle, 
    generateMetaDescription, 
    generateOpenGraphData, 
    generateTwitterCardData,
    generateStructuredData,
    generateCanonicalUrl
  } from '../../../utils/seo.js';
  import { page } from '$app/stores';
  
  export let data;
  
  $: ({ blog, isWordPress } = data);
  
  // Generate optimized SEO data
  $: seoTitle = generateSEOTitle(blog.title);
  $: metaDescription = generateMetaDescription(blog.description || blog.content);
  $: ogData = generateOpenGraphData(blog);
  $: twitterData = generateTwitterCardData(blog);
  $: structuredData = generateStructuredData(blog);
  $: canonicalUrl = generateCanonicalUrl($page.url.pathname);
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href={canonicalUrl} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={ogData.type} />
  <meta property="og:url" content={ogData.url} />
  <meta property="og:title" content={ogData.title} />
  <meta property="og:description" content={ogData.description} />
  <meta property="og:image" content={ogData.image} />
  <meta property="og:site_name" content={ogData.site_name} />
  {#if ogData['article:author']}
    <meta property="article:author" content={ogData['article:author']} />
  {/if}
  {#if ogData['article:published_time']}
    <meta property="article:published_time" content={ogData['article:published_time']} />
  {/if}
  {#if ogData['article:tag'] && Array.isArray(ogData['article:tag'])}
    {#each ogData['article:tag'] as tag}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}
  
  <!-- Twitter -->
  <meta name="twitter:card" content={twitterData.card} />
  <meta name="twitter:title" content={twitterData.title} />
  <meta name="twitter:description" content={twitterData.description} />
  <meta name="twitter:image" content={twitterData.image} />
  {#if twitterData.creator}
    <meta name="twitter:creator" content={twitterData.creator} />
  {/if}
  
  <!-- Structured Data -->
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Hero Section -->
  <div class="relative mb-8 h-96 rounded-xl overflow-hidden">
    {#if blog.image?.src}
      <img 
        src={blog.image.src} 
        alt={blog.image.alt || blog.title}
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-dark/60 dark:bg-dark/40"></div>
    {/if}
    
    <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8">
      {#if blog.tags?.length > 0}
        <a 
          href={`/categories/${slug(blog.tags[0])}`}
          class="inline-block px-4 py-2 bg-accent text-white text-sm rounded-full mb-4 hover:bg-accent/90 transition-colors"
        >
          {blog.tags[0]}
        </a>
      {/if}
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
        {blog.title}
      </h1>
    </div>
  </div>

  <!-- Article Meta -->
  <div class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
    <div class="flex flex-wrap items-center justify-between gap-4 text-gray-600 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <span class="font-semibold text-dark dark:text-light">{blog.author}</span>
        <span>•</span>
        <time datetime={blog.publishedAt}>
          {formatDate(blog.publishedAt)}
        </time>
        {#if blog.readingTime?.text}
          <span>•</span>
          <span>{blog.readingTime.text}</span>
        {/if}
      </div>
      
      {#if blog.tags?.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each blog.tags as tag}
            <a 
              href={`/categories/${slug(tag)}`}
              class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-accent hover:text-white transition-colors"
            >
              #{tag}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Article Content -->
  <div class="prose prose-lg dark:prose-invert max-w-none">
    {#if isWordPress}
      {@html blog.content}
    {:else}
      <!-- For future local markdown content -->
      <div class="whitespace-pre-wrap">{blog.content}</div>
    {/if}
  </div>

  <!-- Categories -->
  {#if blog.categories?.length > 0}
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold mb-4 text-dark dark:text-light">Categories</h3>
      <div class="flex flex-wrap gap-2">
        {#each blog.categories as category}
          <a 
            href={`/categories/${slug(category)}`}
            class="px-4 py-2 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg transition-colors"
          >
            {category}
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Navigation -->
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center">
      <a 
        href="/"
        class="flex items-center text-accent hover:text-accent/80 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Home
      </a>
      
      <a 
        href="/blogs"
        class="flex items-center text-accent hover:text-accent/80 transition-colors"
      >
        All Articles
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </a>
    </div>
  </div>
</article>