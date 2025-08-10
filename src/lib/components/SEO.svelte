<script>
  import { page } from '$app/stores';
  import { 
    generateSEOTitle, 
    generateCanonicalUrl,
    generateOpenGraphData,
    generateTwitterCardData,
    generateStructuredData
  } from '../../utils/seo.js';

  // Props
  export let title = '';
  export let description = '';
  export let type = 'website'; // 'website' or 'article'
  export let image = '';
  export let article = null; // Article data for blog posts
  export let noindex = false; // SEO robots directive
  export let keywords = '';
  
  // Generate SEO data
  $: seoTitle = generateSEOTitle(title);
  $: canonicalUrl = generateCanonicalUrl($page.url.pathname + $page.url.search);
  
  // Generate article-specific data if provided
  $: ogData = article ? generateOpenGraphData(article) : {
    title: seoTitle,
    description,
    type,
    url: canonicalUrl,
    image: image || 'https://your-site.com/og-default.jpg',
    site_name: 'SvelteKit Blog'
  };
  
  $: twitterData = article ? generateTwitterCardData(article) : {
    card: image ? 'summary_large_image' : 'summary',
    title: seoTitle,
    description,
    image: image || 'https://your-site.com/og-default.jpg'
  };
  
  $: structuredData = article ? generateStructuredData(article) : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SvelteKit Blog',
    url: 'https://your-site.com',
    description: 'A SvelteKit blog with WordPress integration'
  };
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}
  
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}
  
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