<script>
  import { formatDate } from "../utils/client.js";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";
  import { generateSEOTitle, generateCanonicalUrl } from "../utils/seo.js";

  export let data;

  $: ({ blogs, paginatedBlogs, pagination, featuredBlogs, recentBlogs } = data);
  $: showPaginatedSection =
    $page.url.searchParams.has("page") || blogs.length > 6;

  // SEO data
  $: pageTitle = $page.url.searchParams.has("page")
    ? `Blog - Page ${$page.url.searchParams.get("page")}`
    : "Home";
  $: seoTitle = generateSEOTitle(pageTitle);
  $: canonicalUrl = generateCanonicalUrl($page.url.pathname + $page.url.search);
  $: metaDescription = showPaginatedSection
    ? `Browse all our blog articles - Page ${$page.url.searchParams.get("page") || "1"}`
    : "Welcome to our SvelteKit blog featuring WordPress content integration. Discover insightful articles, tutorials, and stories.";
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="SvelteKit Blog" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={metaDescription} />
</svelte:head>

<!-- Hero Section - Only show on homepage -->
{#if !$page.url.searchParams.has('page')}
<section class="bg-gradient-to-br from-accent/10 to-accentDark/10 py-12 sm:py-16 md:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-dark">IDW Journal</h1>
    <p class="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4"></p>
    <a
      href="#featured"
      class="inline-block bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
    >
      Explore Articles
    </a>
  </div>
</section>
{/if}

<!-- Recent Posts Section - Only show on homepage (page 1 or no page param) -->
{#if recentBlogs.length > 0 && !$page.url.searchParams.has('page')}
  <section class="py-8 sm:py-12 md:py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-dark">Recent Articles</h2>
        <a
          href="/?page=1"
          class="text-accent hover:text-accent/80 font-semibold transition-colors text-sm sm:text-base"
        >
          View All →
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {#each recentBlogs as blog}
          <article
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {#if blog.image?.src}
              <div class="aspect-video overflow-hidden">
                <img
                  src={blog.image.src}
                  alt={blog.image.alt || blog.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            {/if}

            <div class="p-4 sm:p-6">
              {#if blog.tags?.length > 0}
                <div class="flex flex-wrap gap-2 mb-3">
                  {#each blog.tags.slice(0, 2) as tag}
                    <span
                      class="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs sm:text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}

              <h3 class="text-lg sm:text-xl font-semibold mb-3 text-dark line-clamp-2">
                <a href={blog.url} class="hover:text-accent transition-colors">
                  {blog.title}
                </a>
              </h3>

              <p class="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                {blog.description}
              </p>

              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0"
              >
                <span class="font-medium">{blog.author}</span>
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Paginated Articles Section -->
{#if showPaginatedSection && paginatedBlogs.length > 0}
  <section class="py-8 sm:py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-dark">
        All Articles
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {#each paginatedBlogs as blog}
          <article
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {#if blog.image?.src}
              <div class="aspect-video overflow-hidden">
                <a href={blog.url}>
                  <img
                    src={blog.image.src}
                    alt={blog.image.alt || blog.title}
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </a>
              </div>
            {/if}

            <div class="p-4 sm:p-6">
              {#if blog.tags?.length > 0}
                <div class="flex flex-wrap gap-1 sm:gap-2 mb-3">
                  {#each blog.tags.slice(0, 2) as tag}
                    <span
                      class="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}

              <h3 class="text-base sm:text-lg font-semibold mb-2 text-dark line-clamp-2">
                <a href={blog.url} class="hover:text-accent transition-colors">
                  {blog.title}
                </a>
              </h3>

              <p class="text-gray-600 mb-3 text-xs sm:text-sm line-clamp-2">
                {blog.description}
              </p>

              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 gap-1 sm:gap-0"
              >
                <span class="font-medium">{blog.author}</span>
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            </div>
          </article>
        {/each}
      </div>

      <!-- Pagination -->
      <Pagination {pagination} />
    </div>
  </section>
{/if}

{#if blogs.length === 0}
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl font-bold text-dark mb-4">No articles found</h2>
      <p class="text-gray-600">
        Please check your WordPress configuration or try again later.
      </p>
    </div>
  </section>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
