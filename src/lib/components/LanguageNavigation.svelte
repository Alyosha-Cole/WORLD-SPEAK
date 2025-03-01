<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let currentLanguage;
    export let availableLanguages = [];
    export let languageDisplayNames = {}; // Map language codes to display names
    
    // State
    let languageIndex = availableLanguages.findIndex(lang => lang === currentLanguage);
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Navigate to previous language
    function previousLanguage() {
      if (languageIndex > 0) {
        languageIndex--;
        currentLanguage = availableLanguages[languageIndex];
        dispatch('change', { language: currentLanguage });
      }
    }
    
    // Navigate to next language
    function nextLanguage() {
      if (languageIndex < availableLanguages.length - 1) {
        languageIndex++;
        currentLanguage = availableLanguages[languageIndex];
        dispatch('change', { language: currentLanguage });
      }
    }
  </script>
  
  <div class="language-navigation flex items-center justify-between py-4 px-2">
    <button 
      on:click={previousLanguage} 
      class="flex items-center justify-center p-2 rounded-full hover:bg-[#E5F2F5] text-[#007685] disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={languageIndex === 0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <div class="text-center text-[#007685] font-semibold text-lg">
      {languageDisplayNames[currentLanguage] || currentLanguage}
    </div>
    
    <button 
      on:click={nextLanguage} 
      class="flex items-center justify-center p-2 rounded-full hover:bg-[#E5F2F5] text-[#007685] disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={languageIndex === availableLanguages.length - 1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
  
  <style>
    .language-navigation {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
  </style>