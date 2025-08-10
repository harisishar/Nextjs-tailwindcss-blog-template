<script>
  import { formatDate, slug } from '../../../utils/client.js';
  import Pagination from '$lib/components/Pagination.svelte';
  
  export let data;
  
  $: ({ blogs, pagination, categories, currentCategory, categoryTitle } = data);
</script>

<svelte:head>
  <title>{categoryTitle} - Blog Categories</title>
  <meta name="description" content={`Explore ${categoryTitle.toLowerCase()} articles and tutorials`} />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Header -->
  <div class="mb-12">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-dark dark:text-light">
      #{currentCategory}
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-400">
      {#if currentCategory === 'all'}
        Discover all our articles and expand your knowledge!
      {:else}
        Explore {categoryTitle.replace('-', ' ')} articles and expand your knowledge!
      {/if}
    </p>
  </div>

  <!-- Categories Navigation -->
  <div class="mb-12">
    <div class="flex flex-wrap gap-3">
      {#each categories as category}
        <a 
          href={`/categories/${category}`}
          class={`px-4 py-2 rounded-lg transition-colors font-medium ${
            category === currentCategory
              ? 'bg-accent text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-accent hover:text-white'
          }`}
        >
          {category === 'all' ? 'All' : category.replace('-', ' ')}
        </a>
      {/each}
    </div>
  </div>

  <!-- Articles Grid -->
  {#if blogs.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each blogs as blog}
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          {#if blog.image?.src}
            <div class="aspect-video overflow-hidden">
              <a href={blog.url}>
                <img 
                  src={blog.image.src} 
                  alt={blog.image.alt || blog.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
          {/if}
          
          <div class="p-6">
            {#if blog.tags?.length > 0}
              <div class="flex flex-wrap gap-2 mb-3">
                {#each blog.tags.slice(0, 3) as tag}
                  <a 
                    href={`/categories/${slug(tag)}`}
                    class={`px-3 py-1 text-sm rounded-full transition-colors ${
                      slug(tag) === currentCategory 
                        ? 'bg-accent text-white'
                        : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'
                    }`}
                  >
                    {tag}
                  </a>
                {/each}
              </div>
            {/if}
            
            <h2 class="text-xl font-semibold mb-3 text-dark dark:text-light">
              <a href={blog.url} class="hover:text-accent transition-colors line-clamp-2">
                {blog.title}
              </a>
            </h2>
            
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {blog.description}
            </p>
            
            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
              <span class="font-medium">{blog.author}</span>
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            
            {#if blog.readingTime?.text}
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-500">
                📖 {blog.readingTime.text}
              </div>
            {/if}

            <!-- Categories for this post -->
            {#if blog.categories?.length > 0}
              <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div class="flex flex-wrap gap-2">
                  {#each blog.categories.slice(0, 2) as category}
                    <a 
                      href={`/categories/${slug(category)}`}
                      class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-accent hover:text-white transition-colors"
                    >
                      {category}
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <div class="text-6xl mb-4">📝</div>
      <h2 class="text-2xl font-bold text-dark dark:text-light mb-4">
        No articles found in this category
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Try exploring other categories or check back later for new content.
      </p>
      <a 
        href="/categories/all"
        class="inline-block bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors"
      >
        View All Articles
      </a>
    </div>
  {/if}
  
  <!-- Pagination -->
  <Pagination {pagination} />
</div>

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