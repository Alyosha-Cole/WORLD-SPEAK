<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let language = "spanish";
    export let analysisMode = false;
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Toggle analysis mode
    function toggleAnalysis() {
      dispatch('toggleAnalysis');
    }
    
    // Dictionary feature (placeholder)
    function openDictionary() {
      dispatch('openDictionary');
    }
    
    // Grammar reference (placeholder)
    function openGrammar() {
      dispatch('openGrammar');
    }
    
    // Language options
    const languageDisplayNames = {
      "spanish": "Spanish",
      "russian": "Russian",
      "english": "English",
      // Add more languages as needed
    };
  </script>
  
  <div class="language-learning-toolbar p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
    <div class="flex space-x-2 text-sm">
      <span class="font-medium text-gray-600">Learning:</span>
      <span class="text-primary font-semibold">{languageDisplayNames[language] || language}</span>
    </div>
    
    <div class="flex space-x-2">
      <button 
        class="px-3 py-1 rounded-md text-xs font-medium transition-colors {analysisMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
        on:click={toggleAnalysis}
      >
        {analysisMode ? 'Exit Analysis' : 'Analysis Mode'}
      </button>
      
      <button 
        class="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        on:click={openDictionary}
      >
        Dictionary
      </button>
      
      <button 
        class="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        on:click={openGrammar}
      >
        Grammar
      </button>
    </div>
  </div>