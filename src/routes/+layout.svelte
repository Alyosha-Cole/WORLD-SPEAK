<script>
    import "../app.css";
  </script>
  
  <div class="min-h-screen flex flex-col bg-[#F9F7F3]">
    <!-- Navigation Bar - Ocean Theme -->
    <nav class="bg-[#007685] text-white shadow-md">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" class="font-bold text-2xl flex items-center">
          <span class="text-white">Crosstalk</span>
          <span class="ml-2 text-[#65C3BA]">Language Tutor</span>
        </a>
        <div class="space-x-6">
          <a href="/" class="hover:text-[#65C3BA] text-white font-medium transition duration-200">Home</a>
          <a href="/stories" class="hover:text-[#65C3BA] text-white font-medium transition duration-200">Stories</a>
          <a href="#" class="bg-[#FF8A65] text-white px-4 py-2 rounded-full font-medium hover:bg-[#FF7043] transition duration-200">My Profile</a>
        </div>
      </div>
    </nav>
    
    <!-- Study Progress Bar -->
    <div class="bg-white shadow-sm p-5 flex items-center">
      <div class="flex items-center mr-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#007685] mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm font-semibold text-slate-700">Daily Goal</p>
      </div>
      <div class="flex-grow bg-gray-100 rounded-full h-5 relative overflow-hidden">
        <div 
          id="progressBar"
          class="bg-[#65C3BA] h-5 rounded-full transition-all duration-500 ease-in-out" 
          style="width: 0%"
        ></div>
      </div>
      <p id="progressText" class="ml-4 text-sm font-medium text-slate-700 min-w-[80px] text-right">0/30 min</p>
    </div>
  
    <main class="flex-grow">
      <slot />
    </main>
  
    <footer class="bg-[#007685] text-white py-6 mt-auto">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="font-medium">&copy; 2025 WorldSpeak</p>
            <p class="text-sm text-[#65C3BA] mt-1">Learn languages through immersion</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-white hover:text-[#FF8A65] transition">About</a>
            <a href="#" class="text-white hover:text-[#FF8A65] transition">Contact</a>
            <a href="#" class="text-white hover:text-[#FF8A65] transition">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>