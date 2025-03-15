<script>
    // Props
    export let message = "";
    export let language = "spanish";
    
    // Event dispatching
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    // Process text for Spanish (or other languages with special characters)
    function processTextWithSpecialChars(text) {
      // This regex pattern includes Spanish special characters as word characters
      // It treats áéíóúüñÁÉÍÓÚÜÑ as parts of words, not as separate tokens
      const wordPattern = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+/g;
      
      const tokens = [];
      let lastIndex = 0;
      let match;
      
      // Find all words with special characters
      while ((match = wordPattern.exec(text)) !== null) {
        // If there's content between the last match and this one, add it as non-word content
        if (match.index > lastIndex) {
          tokens.push({
            text: text.substring(lastIndex, match.index),
            isWord: false
          });
        }
        
        // Add the matched word
        tokens.push({
          text: match[0],
          isWord: true
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text after the last match
      if (lastIndex < text.length) {
        tokens.push({
          text: text.substring(lastIndex),
          isWord: false
        });
      }
      
      return tokens;
    }
    
    // Process the text based on the language
    let textParts = processTextWithSpecialChars(message);
    
    // Handle word click
    function handleWordClick(wordText) {
      // Just pass the whole word as-is, let the dictionary API handle finding the base form
      dispatch('wordClick', { 
        word: wordText, 
        posInfo: { pos: "unknown" }
      });
    }
  </script>
  
  <div class="default-view">
    {#each textParts as part}
      {#if part.isWord}
        <span 
          class="word-clickable"
          on:click={() => handleWordClick(part.text)}
        >{part.text}</span>
      {:else}
        <span>{part.text}</span>
      {/if}
    {/each}
  </div>
  
  <style>
    .default-view {
      line-height: 1.5;
      word-wrap: break-word;
    }
    
    .word-clickable {
      cursor: pointer;
      border-bottom: 1px dotted rgba(0, 118, 133, 0.4);
      display: inline-block;
    }
    
    .word-clickable:hover {
      color: #007685;
      background-color: rgba(0, 118, 133, 0.05);
    }
  </style>