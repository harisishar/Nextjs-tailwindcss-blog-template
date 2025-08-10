<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  export let pagination;
  
  $: currentPath = $page.url.pathname;
  
  const goToPage = (pageNum) => {
    const url = new URL($page.url);
    if (pageNum === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', pageNum.toString());
    }
    goto(url.toString());
  };
  
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
</script>

{#if pagination.totalPages > 1}
  <div class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 rounded-lg mt-6 sm:mt-8 gap-4 sm:gap-0">
    <!-- Mobile-first pagination info -->
    <div class="flex items-center justify-center sm:hidden w-full order-1">
      <p class="text-sm text-gray-700 text-center">
        Page <span class="font-medium">{pagination.currentPage}</span> of <span class="font-medium">{pagination.totalPages}</span>
      </p>
    </div>
    
    <div class="flex flex-1 justify-between sm:hidden w-full order-2">
      <!-- Mobile pagination -->
      {#if pagination.hasPrevPage}
        <button
          on:click={() => goToPage(pagination.currentPage - 1)}
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          ← Previous
        </button>
      {:else}
        <div class="w-20"></div>
      {/if}
      
      {#if pagination.hasNextPage}
        <button
          on:click={() => goToPage(pagination.currentPage + 1)}
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Next →
        </button>
      {:else}
        <div class="w-20"></div>
      {/if}
    </div>
    
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{pagination.startIndex}</span>
          to
          <span class="font-medium">{pagination.endIndex}</span>
          of
          <span class="font-medium">{pagination.totalPosts}</span>
          results
        </p>
      </div>
      
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous button -->
          {#if pagination.hasPrevPage}
            <button
              on:click={() => goToPage(pagination.currentPage - 1)}
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors hover:text-gray-600"
              aria-label="Previous page"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
          {:else}
            <div class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </div>
          {/if}
          
          <!-- Page numbers -->
          {#each getPageNumbers() as pageNum}
            {#if pageNum === '...'}
              <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                ...
              </span>
            {:else if pageNum === pagination.currentPage}
              <span class="relative z-10 inline-flex items-center bg-accent px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {pageNum}
              </span>
            {:else}
              <button
                on:click={() => goToPage(pageNum)}
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors"
                aria-label="Go to page {pageNum}"
              >
                {pageNum}
              </button>
            {/if}
          {/each}
          
          <!-- Next button -->
          {#if pagination.hasNextPage}
            <button
              on:click={() => goToPage(pagination.currentPage + 1)}
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors hover:text-gray-600"
              aria-label="Next page"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          {:else}
            <div class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </div>
          {/if}
        </nav>
      </div>
    </div>
  </div>
{/if}