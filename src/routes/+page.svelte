<script>
    import CountryMap from '$lib/components/CountryMap.svelte';
    import { allCountries } from '$lib/countries/index.js';
    import { onMount } from 'svelte';
    
    // Handle country selection
    function handleCountrySelect(event) {
      console.log('Country selected:', event.detail.country);
    }
  
    // Daily study goal
    const goalMinutes = 30;
    let studyMinutes = 0;
  
    onMount(() => {
      // Get saved study minutes from localStorage
      studyMinutes = localStorage.getItem("studyMinutes")
        ? parseInt(localStorage.getItem("studyMinutes"))
        : 0;
      updateProgressBar();
    });
  
    function updateProgressBar() {
      const percentage = Math.min((studyMinutes / goalMinutes) * 100, 100);
      return `width: ${percentage}%`;
    }
  </script>
  
  <svelte:head>
    <title>WorldSpeak - Interactive Language Map</title>
  </svelte:head>
  
  <!-- Navigation Bar -->
  <nav class="bg-purple-600 text-white">
    <div class="container mx-auto px-4 py-2 flex justify-between items-center">
      <a href="/" class="font-bold text-xl">Crosstalk Language Tutor</a>
      <div class="space-x-4">
        <a href="/" class="hover:text-gray-200">Home</a>
        <a href="/crosstalk" class="hover:text-gray-200">CrossTalk</a>
        <a href="/stories" class="hover:text-gray-200">Stories</a>
        <a href="/drills" class="hover:text-gray-200">Drills</a>
      </div>
    </div>
  </nav>
  
  <!-- Study Progress Bar -->
  <div class="bg-white shadow p-4 flex items-center">
    <p class="text-sm font-medium text-gray-700 mr-4">Daily Goal</p>
    <div class="flex-grow bg-gray-200 rounded-full h-4 relative">
      <div 
        class="bg-purple-600 h-4 rounded-full transition-all duration-300" 
        style={updateProgressBar()}
      ></div>
    </div>
    <p class="ml-3 text-sm text-gray-700">{studyMinutes}/{goalMinutes} min</p>
  </div>
  
  <section class="py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold text-slate-900 mb-4">Interactive Map</h1>
  
      <div class="max-w-3xl mx-auto">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <p class="mb-4 text-center text-sm text-slate-600">Click on a country to see its people</p>
          <CountryMap 
            mapData={allCountries} 
            width={800} 
            height={600}
            on:select={handleCountrySelect}
            class="w-full h-auto"
          />
        </div>
      </div>
    </div>
  </section>