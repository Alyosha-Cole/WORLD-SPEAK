<script>
    import "../app.css";
  </script>
  
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-slate-800">WorldSpeak</h1>
        <nav>
          <ul class="flex space-x-6">
            <li><a href="/" class="text-slate-700 hover:text-primary">Home</a></li>
            <li><a href="/about" class="text-slate-700 hover:text-primary">About</a></li>
            <li><a href="/contact" class="text-slate-700 hover:text-primary">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  
    <main class="flex-grow">
      <slot />
    </main>
  
    <footer class="bg-slate-100 text-slate-600 py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 WorldSpeak</p>
      </div>
    </footer>
  </div>