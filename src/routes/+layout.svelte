<script>
  import "../app.css";
</script>

<svelte:head>
  <title>IDW Journal - The Best Interior Design in MalaysiaS</title>
  <meta
    name="description"
    content="Interior Design World Journal is a platform for interior designers to share their work and ideas."
  />
</svelte:head>

<div class="min-h-screen bg-light text-dark">
  <header class="bg-light border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-2xl font-bold"> IDW </a>

        <div class="flex items-center space-x-4">
          <a
            href="https://idw.design/get-consultation/"
            class="hover:text-accent transition-colors bg-accent text-light px-4 py-2 rounded-md"
            >Get Consultation</a
          >
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
          {new Date().getFullYear()} @ IDW. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</div>
