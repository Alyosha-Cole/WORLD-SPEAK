<script>
    // Props
    export let message = "";
    export let language = "spanish";
    
    // State
    let isTranslating = false;
    let translatedText = "";
    
    // Translate the message (placeholder for actual translation API)
    async function translateMessage() {
      if (translatedText) {
        // If already translated, toggle back to original
        translatedText = "";
        return;
      }
      
      isTranslating = true;
      
      try {
        // This would be replaced with an actual API call
        // For now, we'll just simulate a translation with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Placeholder translated text (would come from translation API)
        if (language === "spanish") {
          translatedText = "This is a placeholder for the translated Spanish text. In a real implementation, this would be an actual translation from an API.";
        } else if (language === "russian") {
          translatedText = "This is a placeholder for the translated Russian text. In a real implementation, this would be an actual translation from an API.";
        } else {
          translatedText = "This is a placeholder for the translated text. In a real implementation, this would be an actual translation from an API.";
        }
      } catch (error) {
        console.error("Translation error:", error);
        translatedText = "Error translating text. Please try again.";
      } finally {
        isTranslating = false;
      }
    }
  </script>
  
  <div class="translation-view">
    <!-- Original text -->
    <div class="original-text">
      {message}
    </div>
    
    <!-- Translation controls -->
    <div class="flex justify-end mt-2">
      <button
        on:click={translateMessage}
        class="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors flex items-center"
        disabled={isTranslating}
      >
        {#if isTranslating}
          <span class="loading-spinner mr-1"></span>
          Translating...
        {:else if translatedText}
          Show Original
        {:else}
          Translate
        {/if}
      </button>
    </div>
    
    <!-- Translated text (if available) -->
    {#if translatedText}
      <div class="translated-text mt-2 p-2 bg-blue-50 rounded border border-blue-100 text-gray-700">
        {translatedText}
      </div>
    {/if}
  </div>
  
  <style>
    .loading-spinner {
      display: inline-block;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>