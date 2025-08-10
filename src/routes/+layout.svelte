<script>
  import '../app.css';
</script>

<svelte:head>
  <title>SvelteKit Blog with WordPress</title>
  <meta name="description" content="A modern blog built with SvelteKit, Tailwind CSS, and WordPress GraphQL" />
</svelte:head>

<div class="min-h-screen bg-light text-dark">
  <header class="bg-light border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-2xl font-bold">
          Blog
        </a>
        
        <div class="flex items-center space-x-4">
          <a href="/" class="hover:text-accent transition-colors">Home</a>
          <a href="/categories" class="hover:text-accent transition-colors">Categories</a>
          <a href="/about" class="hover:text-accent transition-colors">About</a>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="bg-light border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <p class="text-gray-600">
          © 2024 SvelteKit Blog. Built with SvelteKit, Tailwind CSS, and WordPress GraphQL.
        </p>
      </div>
    </div>
  </footer>
</div>