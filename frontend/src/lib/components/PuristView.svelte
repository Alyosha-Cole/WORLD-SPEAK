<script>
    // Props
    export let message = "";
    export let language = "spanish";
    
    // State
    let showTransliteration = false;
    
    // Toggle transliteration display
    function toggleTransliteration() {
      showTransliteration = !showTransliteration;
    }
    
    // Get placeholder transliteration based on language
    function getTransliteration() {
      if (language === "russian") {
        return "This would be the romanized version of the Russian text to help with pronunciation.";
      } else {
        return "This would be a pronunciation guide for the language.";
      }
    }
  </script>
  
  <div class="purist-view">
    <!-- Original message -->
    <div class="message-content">
      {message}
    </div>
    
    <!-- Transliteration toggle (mainly useful for non-Latin scripts) -->
    {#if language === "russian"}
      <div class="mt-2 flex justify-end">
        <button
          on:click={toggleTransliteration}
          class="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          {showTransliteration ? 'Hide Pronunciation' : 'Show Pronunciation'}
        </button>
      </div>
      
      {#if showTransliteration}
        <div class="transliteration mt-2 p-2 bg-purple-50 rounded border border-purple-100 text-gray-700 text-sm italic">
          {getTransliteration()}
        </div>
      {/if}
    {/if}
  </div>