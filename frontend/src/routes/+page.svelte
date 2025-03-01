<script>
    import CountryMap from '$lib/components/CountryMap.svelte';
    import { 
      allCountries, 
      getMajorLanguages, 
      filterCountriesByLanguage 
    } from '$lib/countries/index.js';
    import { onMount } from 'svelte';
    import LanguageNavigation from '$lib/components/LanguageNavigation.svelte';
    
    // Handle country selection - navigate directly to people page
    function handleCountrySelect(event) {
      const country = event.detail;
      window.location.href = `/country/${country.properties.code}/people`;
    }
  
    // Daily study goal
    const goalMinutes = 30;
    let studyMinutes = 0;
    // No longer need these variables since we're navigating directly
    // instead of showing a popup
  
    // Get only major languages we want to display
    const availableLanguages = getMajorLanguages();
    let currentLanguage = "Spanish"; // Default to Spanish
    
    // Language display names for UI
    const languageDisplayNames = {
      "Spanish": "Spanish",
      "Russian": "Russian",
      // Add other language display names as needed
    };
    
    // Filtered map data based on selected language
    $: filteredMapData = filterCountriesByLanguage(currentLanguage);
    
    // Handle language change
    function handleLanguageChange(event) {
      currentLanguage = event.detail.language;
      // No need to reset popup state anymore
    }
  
    onMount(() => {
      // Get saved study minutes from localStorage
      studyMinutes = localStorage.getItem("studyMinutes")
        ? parseInt(localStorage.getItem("studyMinutes"))
        : 0;
      
      // Update progress bar
      const percentage = Math.min((studyMinutes / goalMinutes) * 100, 100);
      const progressBar = document.getElementById("progressBar");
      const progressText = document.getElementById("progressText");
      
      if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${studyMinutes}/${goalMinutes} min`;
      }
    });
  
    // No longer needed as we're not showing a popup
  </script>
  
  <svelte:head>
    <title>WorldSpeak - Interactive Language Map</title>
  </svelte:head>
  
  <div class="bg-gradient-to-b from-[#E5F2F5] to-[#F9F7F3] py-10">
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center mb-10">
        <h1 class="text-4xl font-bold text-[#007685] mb-4">Discover Languages Around the World</h1>
        <p class="text-lg text-slate-600">Explore different cultures and learn new languages with our interactive map</p>
      </div>
  
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-[#007685]">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-[#007685]">Interactive World Map</h2>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-[#E5F2F5] text-[#007685] rounded-full text-sm font-medium hover:bg-[#D5E8ED] transition">
                Filter
              </button>
              <button class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition">
                Reset
              </button>
            </div>
          </div>
          
          <!-- Language Navigation Component -->
          <LanguageNavigation 
            currentLanguage={currentLanguage}
            availableLanguages={availableLanguages}
            languageDisplayNames={languageDisplayNames}
            on:change={handleLanguageChange}
          />
          
          <p class="my-4 text-center text-slate-600">
            Showing countries where <span class="font-semibold text-[#007685]">{languageDisplayNames[currentLanguage] || currentLanguage}</span> is spoken. 
            Click on a country to explore its culture.
          </p>
          
          <div class="relative">
            <CountryMap 
              mapData={filteredMapData} 
              width={800} 
              height={600}
              on:select={handleCountrySelect}
              class="w-full h-auto"
            />
            
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <section class="py-16 bg-[#F9F7F3]">
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-[#007685] mb-4">Ready to start your language journey?</h2>
        <p class="text-lg text-slate-600 mb-8">Join thousands of learners mastering new languages through immersive learning</p>
        <button class="bg-[#FF8A65] hover:bg-[#FF7043] text-white font-medium py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-300">
          Get Started Today
        </button>
      </div>
    </div>
  </section>