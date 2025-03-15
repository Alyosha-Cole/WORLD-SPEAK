<script>
    import { fade, fly } from 'svelte/transition';
    import { X, ChevronDown, ChevronUp, Globe } from 'lucide-svelte';
    
    // Props
    export let word = null; // The selected word
    export let posInfo = null; // Part of speech info
    export let language = "spanish"; // Current language
    export let visible = false; // Visibility control
    
    // State
    let showNativeExplanation = false; // Toggle for explanation language
    let isLoading = true; // Loading state
    let wordDetails = null; // Details fetched from backend
    let error = null; // Error message if fetch fails
    let imageUrl = null; // URL for the word image
    
    // Sections expanded state
    let expandedSections = {
      examples: true,
      explanation: true
    };
    
    // Toggle section expansion
    function toggleSection(section) {
      expandedSections[section] = !expandedSections[section];
    }
    
    // Toggle explanation language
    function toggleExplanationLanguage() {
      showNativeExplanation = !showNativeExplanation;
    }
    
    // Close the sidebar
    function closeSidebar() {
      visible = false;
    }
    
    // Watch for word changes to load new details
    $: if (word && visible) {
      loadWordDetails(word, language);
    }
    
    // Load word details from backend or dictionary API
    async function loadWordDetails(wordText, lang) {
      isLoading = true;
      error = null;
      
      try {
        // Call the backend API to get word details
        const response = await fetch('http://localhost:5000/api/wordDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            word: wordText,
            language: lang,
            pos: posInfo?.pos || null
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Parse the response
        wordDetails = await response.json();
        
        // Set placeholder image URL
        // In a real implementation, you would use an image search API like Unsplash or Google Images
        imageUrl = `/api/placeholder/300/200?text=${encodeURIComponent(wordText)}`;
        
      } catch (error) {
        console.error("Error fetching word details:", error);
        error = "Failed to load word details. Please try again.";
        
        // Create fallback data to prevent UI errors
        wordDetails = {
          word: wordText,
          pos: posInfo ? posInfo.pos : 'NOUN',
          translation: "Translation unavailable",
          examples: ["Example sentence unavailable."],
          explanation: {
            target: "Explicación no disponible.",
            native: "Explanation not available."
          }
        };
      } finally {
        isLoading = false;
      }
    }
    
    // Get display name for the part of speech
    function getPosDisplayName(pos) {
      const posNames = {
        'NOUN': 'Noun',
        'VERB': 'Verb',
        'ADJ': 'Adjective',
        'ADV': 'Adverb',
        'ADP': 'Preposition',
        'PROPN': 'Proper Noun',
        'PRON': 'Pronoun',
        'DET': 'Determiner',
        'CONJ': 'Conjunction',
        'CCONJ': 'Coordinating Conjunction',
        'SCONJ': 'Subordinating Conjunction',
        'NUM': 'Number',
        'PART': 'Particle',
        'INTJ': 'Interjection',
        'PUNCT': 'Punctuation',
        'X': 'Other',
        'SYM': 'Symbol'
      };
      
      return posNames[pos] || pos;
    }
    
    // Format based on language
    function getLanguageDisplay(lang) {
      const langNames = {
        'spanish': 'Spanish',
        'russian': 'Russian',
        'english': 'English'
      };
      
      return langNames[lang] || lang;
    }
  </script>
  
  <!-- Overlay for mobile devices -->
  {#if visible}
    <div 
      class="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden" 
      on:click={closeSidebar}
      transition:fade={{ duration: 200 }}
    ></div>
  {/if}
  
  <!-- Sidebar -->
  <div 
    class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out {visible ? 'translate-x-0' : 'translate-x-full'}"
    class:hidden={!visible}
  >
    <!-- Loading state -->
    {#if isLoading}
      <div class="flex flex-col items-center justify-center h-full p-6">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Loading word details...</p>
      </div>
    <!-- Error state -->
    {:else if error}
      <div class="flex flex-col items-center justify-center h-full p-6 text-center">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <p class="text-red-600">{error}</p>
        <button 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          on:click={closeSidebar}
        >
          Close
        </button>
      </div>
    <!-- Content state -->
    {:else if wordDetails}
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-[#007685] text-white">
          <div>
            <h2 class="text-xl font-bold">{wordDetails.word}</h2>
            <div class="text-sm opacity-90">
              {getPosDisplayName(wordDetails.pos)}
              {#if wordDetails.translation}
                <span class="mx-1">•</span>
                <span class="italic">{wordDetails.translation}</span>
              {/if}
            </div>
          </div>
          <button 
            class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            on:click={closeSidebar}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex-grow overflow-y-auto p-4 space-y-6">
          <!-- Image section -->
          {#if imageUrl}
            <div class="image-section">
              <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Image</h3>
              <div class="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={wordDetails.word} 
                  class="w-full object-cover h-48"
                />
              </div>
            </div>
          {/if}
          
          <!-- Examples section -->
          <div class="examples-section">
            <div 
              class="flex items-center justify-between cursor-pointer"
              on:click={() => toggleSection('examples')}
            >
              <h3 class="text-sm font-medium text-gray-500 uppercase">Example Sentences</h3>
              <button class="p-1 text-gray-500">
                {#if expandedSections.examples}
                  <ChevronUp size={18} />
                {:else}
                  <ChevronDown size={18} />
                {/if}
              </button>
            </div>
            
            {#if expandedSections.examples && wordDetails.examples && wordDetails.examples.length > 0}
              <div class="mt-2 space-y-2">
                {#each wordDetails.examples as example, i}
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="text-sm text-gray-800">{example}</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- Explanation section -->
          <div class="explanation-section">
            <div class="flex items-center justify-between">
              <div 
                class="flex items-center cursor-pointer"
                on:click={() => toggleSection('explanation')}
              >
                <h3 class="text-sm font-medium text-gray-500 uppercase">Explanation</h3>
                <button class="p-1 text-gray-500 ml-1">
                  {#if expandedSections.explanation}
                    <ChevronUp size={18} />
                  {:else}
                    <ChevronDown size={18} />
                  {/if}
                </button>
              </div>
              
              <button 
                class="flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                on:click={toggleExplanationLanguage}
                title={showNativeExplanation ? `Show in ${getLanguageDisplay(language)}` : "Show in English"}
              >
                <Globe size={14} class="mr-1" />
                {showNativeExplanation ? getLanguageDisplay(language) : "English"}
              </button>
            </div>
            
            {#if expandedSections.explanation && wordDetails.explanation}
              <div class="mt-2">
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-gray-800">
                    {showNativeExplanation 
                      ? wordDetails.explanation.target 
                      : wordDetails.explanation.native}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-gray-200">
          <button 
            class="w-full py-2 bg-[#007685] hover:bg-[#006675] text-white rounded-md transition-colors"
            on:click={closeSidebar}
          >
            Close
          </button>
        </div>
      </div>
    {/if}
  </div>