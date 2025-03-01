<script>
  import { page } from '$app/stores';
</script>

<div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
  <h1 class="text-8xl font-bold text-primary mb-4">{$page.status}</h1>
  <p class="text-2xl font-semibold mb-6">{$page.error?.message || 'Page not found'}</p>
  <p class="text-slate-600 mb-8 max-w-md">
    We couldn't find the page you're looking for. The page might have been removed, renamed,
    or is temporarily unavailable.
  </p>
  <a 
    href="/" 
    class="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition"
  >
    Return to Homepage
  </a>
</div>