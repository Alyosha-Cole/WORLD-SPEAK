<script>
    import CountryMap from '$lib/components/CountryMap.svelte';
    import { 
      allCountries, 
      getMajorLanguages, 
      filterCountriesByLanguage 
    } from '$lib/countries/index.js';
    import { onMount } from 'svelte';
    import LanguageNavigation from '$lib/components/LanguageNavigation.svelte';
    
    // Handle country selection
    function handleCountrySelect(event) {
      selectedCountry = event.detail;
      showCountryInfo = true;
    }
  
    // Daily study goal
    const goalMinutes = 30;
    let studyMinutes = 0;
    let selectedCountry = null;
    let showCountryInfo = false;
  
    // Get only major languages we want to display
    const availableLanguages = getMajorLanguages();
    let currentLanguage = "Spanish"; // Default to Spanish
    
    // Language display names for UI
    const languageDisplayNames = {
      "Spanish": "Spanish",
      // Add other language display names as needed
    };
    
    // Filtered map data based on selected language
    $: filteredMapData = filterCountriesByLanguage(currentLanguage);
    
    // Handle language change
    function handleLanguageChange(event) {
      currentLanguage = event.detail.language;
      // Reset selected country when language changes
      selectedCountry = null;
      showCountryInfo = false;
    }
  
    // Language options (sample data)
    const languages = [
      { id: 1, name: "Spanish", level: "Beginner", speakers: "543 million" },
      { id: 2, name: "French", level: "Intermediate", speakers: "267 million" },
      { id: 3, name: "Mandarin", level: "Advanced", speakers: "1.1 billion" }
    ];
  
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
  
    function closeCountryInfo() {
      showCountryInfo = false;
    }
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
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {#each languages as language}
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border-l-4 border-[#65C3BA]">
            <div class="p-6">
              <h3 class="text-xl font-bold text-[#007685]">{language.name}</h3>
              <div class="flex items-center mt-2">
                <span class="px-2 py-1 bg-[#65C3BA] text-white text-xs font-medium rounded">
                  {language.level}
                </span>
                <span class="ml-2 text-sm text-slate-500">{language.speakers} speakers</span>
              </div>
              <p class="mt-4 text-slate-600">Learn {language.name} through immersive conversations and cultural stories.</p>
              <button class="mt-6 w-full bg-[#FF8A65] hover:bg-[#FF7043] text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Start Learning
              </button>
            </div>
          </div>
        {/each}
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
            
            {#if showCountryInfo && selectedCountry}
              <div class="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs border-l-4 border-[#FF8A65]">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-bold text-[#007685]">{selectedCountry.properties.name}</h3>
                  <button on:click={closeCountryInfo} class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p class="text-sm text-slate-600 mb-3">Explore {languageDisplayNames[currentLanguage] || currentLanguage} language and culture in {selectedCountry.properties.name}.</p>
                <a href={`/country/${selectedCountry.properties.code}/people`} class="block w-full bg-[#FF8A65] hover:bg-[#FF7043] text-white text-sm font-medium py-2 px-4 rounded transition duration-200 text-center">
                  Meet the People
                </a>
              </div>
            {/if}
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