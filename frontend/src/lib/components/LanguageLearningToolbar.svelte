<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let language = "spanish";
    export let analysisMode = false;
    export let learningMode = "default";
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Toggle analysis mode
    function toggleAnalysis() {
      dispatch('toggleAnalysis');
    }
    
    // Change learning mode
    function changeLearningMode(mode) {
      if (mode === learningMode) return;
      dispatch('changeLearningMode', { mode });
    }
    
    // Language options
    const languageDisplayNames = {
      "spanish": "Spanish",
      "russian": "Russian",
      "english": "English",
      // Add more languages as needed
    };
    
    // Learning modes
    const learningModes = [
      { id: "default", name: "Default", available: true },
      { id: "linguist", name: "Linguist", available: true },
      { id: "purist", name: "Purist", available: false },
      { id: "translator", name: "Translator", available: false },
    ];
  </script>
  
  <div class="language-learning-toolbar bg-gray-50 border-t border-gray-200">
    <!-- Language info bar + mode selection -->
    <div class="flex items-center justify-between p-2 border-b border-gray-100">
      <!-- Left side: language info -->
      <div class="flex space-x-2 text-sm">
        <span class="font-medium text-gray-600">Learning:</span>
        <span class="text-primary font-semibold">
          {languageDisplayNames[language] || language}
        </span>
      </div>
      
      <!-- Right side: mode selection -->
      <div class="flex overflow-x-auto space-x-2">
        {#each learningModes as mode}
          <button 
            class="px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                   {learningMode === mode.id 
                     ? 'border-[#007685] text-[#007685]' 
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                   {!mode.available ? 'opacity-60' : ''}"
            on:click={() => mode.available && changeLearningMode(mode.id)}
          >
            {mode.name}
            {#if !mode.available}
              <span class="ml-1 text-xs bg-gray-200 px-1 rounded">Soon</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Mode-specific tools (for “Linguist” mode) -->
    {#if learningMode === "linguist"}
      <div class="flex items-center justify-end p-2 bg-blue-50">
        <button 
          class="px-3 py-1 rounded-md text-xs font-medium transition-colors
                 {analysisMode ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}"
          on:click={toggleAnalysis}
        >
          {analysisMode ? 'Exit Analysis' : 'Word Analysis'}
        </button>
      </div>
    {/if}
  </div>
  
  <style>
    /* Hide scrollbar but allow scrolling horizontally if needed */
    .overflow-x-auto {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;     /* Firefox */
    }
    
    .overflow-x-auto::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  </style>
  