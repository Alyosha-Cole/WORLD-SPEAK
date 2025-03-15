<script>
    import { onMount } from 'svelte';
    import '../components/styles/partsOfSpeech.css'
    
    // Props
    export let message = "";
    export let language = "spanish";
    export let disabled = false;
  
    // State
    let tokens = [];
    let isLoading = false;
    let hasProcessed = false;
    let errorMessage = null;
    let selectedToken = null;
    let showModal = false;
    
    // Process text with NLP on component mount or when message changes
    $: if (message && !disabled && !hasProcessed) {
      processText(message);
    }
    
    async function processText(text) {
      if (!text || isLoading) return;
      
      isLoading = true;
      hasProcessed = false;
      
      try {
        const response = await fetch('http://localhost:5000/api/nlp/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language })
        });
        
        const data = await response.json();
        
        if (data.error) {
          errorMessage = data.error;
          console.error("Error processing text:", data.error);
        } else {
          tokens = data.tokens;
          errorMessage = null;
        }
      } catch (error) {
        console.error("Error calling NLP API:", error);
        errorMessage = "Failed to analyze text. Please try again.";
      } finally {
        isLoading = false;
        hasProcessed = true;
      }
    }
    
    // Select a token to show details
    function selectToken(token) {
      // Don't show modal for punctuation
      if (token.is_punct) return;
      
      selectedToken = token;
      showModal = true;
    }
    
    // Close the modal
    function closeModal() {
      showModal = false;
      selectedToken = null;
    }
    
    // Get user-friendly POS descriptions
    function getPosDescription(pos) {
      const descriptions = {
        'NOUN': 'Noun - a person, place, thing, or idea',
        'VERB': 'Verb - an action or state of being',
        'ADJ': 'Adjective - describes a noun',
        'ADV': 'Adverb - modifies a verb, adjective, or other adverb',
        'ADP': 'Adposition - preposition or postposition',
        'PROPN': 'Proper Noun - name of a specific person, place, or thing',
        'PRON': 'Pronoun - replaces a noun',
        'DET': 'Determiner - article or other determiner',
        'CONJ': 'Conjunction - connects words, phrases, or clauses',
        'CCONJ': 'Coordinating Conjunction - connects words or phrases of equal importance',
        'SCONJ': 'Subordinating Conjunction - connects a dependent clause to an independent clause',
        'NUM': 'Numeral - a number',
        'PART': 'Particle - a function word that does not fit in other categories',
        'INTJ': 'Interjection - an exclamation',
        'PUNCT': 'Punctuation - punctuation mark',
        'X': 'Other - words that don\'t fit into other categories',
        'SYM': 'Symbol - a symbol or sign'
      };
      
      return descriptions[pos] || pos;
    }
    
    // Handle click outside the modal
    function handleClickOutside(event) {
      if (showModal && !event.target.closest('.token-modal-content')) {
        closeModal();
      }
    }
  </script>
  
  <svelte:window on:click={handleClickOutside} />
  
  {#if isLoading}
    <div class="text-center py-2">
      <div class="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
        Analyzing text...
      </div>
    </div>
  {:else if tokens.length > 0}
    <div class="nlp-tokens">
      {#each tokens as token}
        <!-- Skip rendering for certain tokens if needed -->
        <span 
          class="pos-token pos-{token.pos} {token.is_punct ? 'pos-punct' : ''}"
          on:click={() => selectToken(token)}
          title={token.is_punct ? '' : getPosDescription(token.pos)}
        >
          {token.text}
          {#if !token.is_punct}
            <span class="token-tooltip">{token.pos}</span>
          {/if}
        </span>
      {/each}
    </div>
  {:else if errorMessage}
    <div class="text-center py-2">
      <div class="inline-block px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
        {errorMessage}
      </div>
    </div>
  {/if}
  
  <!-- Token detail modal -->
  {#if showModal && selectedToken}
    <div class="token-modal">
      <div class="token-modal-content">
        <div class="token-modal-header">
          <h3 class="font-bold text-lg">Word Analysis: "{selectedToken.text}"</h3>
          <button class="token-modal-close" on:click={closeModal}>&times;</button>
        </div>
        
        <div class="token-details mt-4">
          <div class="token-detail-row">
            <span class="token-detail-label">Word:</span>
            <span class="token-detail-value">{selectedToken.text}</span>
          </div>
          
          <div class="token-detail-row">
            <span class="token-detail-label">Lemma (base form):</span>
            <span class="token-detail-value">{selectedToken.lemma}</span>
          </div>
          
          <div class="token-detail-row">
            <span class="token-detail-label">Part of Speech:</span>
            <span class="token-detail-value">{selectedToken.pos}</span>
          </div>
          
          <div class="token-detail-row">
            <span class="token-detail-label">Description:</span>
            <span class="token-detail-value">{getPosDescription(selectedToken.pos)}</span>
          </div>
          
          <div class="token-detail-row">
            <span class="token-detail-label">Detailed Tag:</span>
            <span class="token-detail-value">{selectedToken.tag}</span>
          </div>
          
          <div class="token-detail-row">
            <span class="token-detail-label">Stop Word:</span>
            <span class="token-detail-value">{selectedToken.is_stop ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div class="mt-6">
          <button 
            class="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
            on:click={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .nlp-tokens {
      line-height: 1.6;
      padding: 0.5rem 0;
    }
  </style>