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