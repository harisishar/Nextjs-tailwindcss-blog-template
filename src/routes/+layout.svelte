<script>
  import '../app.css';
  import { onMount } from 'svelte';
  
  let darkMode = false;

  onMount(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    darkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    // Apply theme class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<svelte:head>
  <title>SvelteKit Blog with WordPress</title>
  <meta name="description" content="A modern blog built with SvelteKit, Tailwind CSS, and WordPress GraphQL" />
</svelte:head>

<div class="min-h-screen bg-light dark:bg-dark text-dark dark:text-light transition-colors duration-300">
  <header class="bg-light dark:bg-dark border-b border-gray-200 dark:border-gray-800">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-2xl font-bold">
          Blog
        </a>
        
        <div class="flex items-center space-x-4">
          <a href="/" class="hover:text-accent transition-colors">Home</a>
          <a href="/categories" class="hover:text-accent transition-colors">Categories</a>
          <a href="/about" class="hover:text-accent transition-colors">About</a>
          
          <button 
            on:click={toggleDarkMode}
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {#if darkMode}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
            {:else}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="bg-light dark:bg-dark border-t border-gray-200 dark:border-gray-800 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400">
          © 2024 SvelteKit Blog. Built with SvelteKit, Tailwind CSS, and WordPress GraphQL.
        </p>
      </div>
    </div>
  </footer>
</div>