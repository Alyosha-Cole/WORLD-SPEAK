<script>
    import "../app.css";
  </script>
  
  <div class="min-h-screen flex flex-col">
  <!-- Navigation Bar -->
  <nav class="bg-purple-600 text-white">
    <div class="container mx-auto px-4 py-2 flex justify-between items-center">
      <a href="/" class="font-bold text-xl">Crosstalk Language Tutor</a>
      <div class="space-x-4">
        <a href="/" class="hover:text-gray-200">Home</a>
        <a href="/stories" class="hover:text-gray-200">Stories</a>
      </div>
    </div>
  </nav>
  <!-- Study Progress Bar -->
<div class="bg-white shadow p-4 flex items-center">
    <p class="text-sm font-medium text-gray-700 mr-4">Daily Goal</p>
    <div class="flex-grow bg-gray-200 rounded-full h-4 relative">
      <div 
        id="progressBar"
        class="bg-purple-600 h-4 rounded-full transition-all duration-300" 
        style="width: 0%"
      ></div>
    </div>
    <p id="progressText" class="ml-3 text-sm text-gray-700">0/30 min</p>
  </div>

    <main class="flex-grow">
      <slot />
    </main>
  
    <footer class="bg-slate-100 text-slate-600 py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 WorldSpeak</p>
      </div>
    </footer>
  </div>