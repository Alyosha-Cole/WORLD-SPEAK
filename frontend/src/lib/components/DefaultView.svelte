<!-- DefaultView.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import DefaultModeToolbar from './DefaultModeToolbar.svelte';
  import DefaultToolHandler from './DefaultToolHandler.svelte';
  import TokenDisplay from './TokenDisplay.svelte';
  
  // Props
  export let message = "";
  export let language = "spanish";
  
  // State
  let activeTool = "inspect"; // Default to inspect tool
  let isToolbarVisible = false; // Start with toolbar collapsed
  
  // The inspect tool is already implemented, speak is UI-enabled but functionality pending
  let enabledTools = {
    inspect: true,    // Already implemented
    speak: true,      // UI enabled but functionality pending
    translate: false, // Enable when ready
    image: false,     // Enable when ready
    analyze: true     // Adding linguistics analysis tool
  };
  
  // Event dispatcher to bubble events up to parent
  const dispatch = createEventDispatcher();
  
  // Toggle toolbar visibility
  function toggleToolbar() {
    isToolbarVisible = !isToolbarVisible;
  }
  
  // Handle tool change
  function handleToolChange(event) {
    activeTool = event.detail.toolId;
  }
  
  // Handle coming soon message
  function handleComingSoon(event) {
    const toolId = event.detail.toolId;
    alert(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} tool coming soon!`);
  }
  
  // Handle speak tool click - temporary placeholder functionality
  function handleSpeakEvent(event) {
    const { word } = event.detail;
    alert(`Speak functionality for word "${word}" coming soon!`);
  }
  
  // Function to extract the sentence containing a word
  function extractSentenceContext(fullMessage, word) {
    // Common sentence terminators
    const sentenceTerminators = ['.', '!', '?', '¡', '¿', '\n'];
    // For Russian language support
    if (language === 'russian') {
      sentenceTerminators.push(';', ':');
    }
    
    // If we don't have a word or message, return null
    if (!word || !fullMessage) return null;
    
    // Find the word position - case insensitive search
    const wordPosition = fullMessage.toLowerCase().indexOf(word.toLowerCase());
    if (wordPosition === -1) return null;
    
    // Find the start of the sentence
    let sentenceStart = 0;
    for (let i = wordPosition; i > 0; i--) {
      if (sentenceTerminators.includes(fullMessage[i])) {
        sentenceStart = i + 1;
        break;
      }
    }
    
    // Find the end of the sentence
    let sentenceEnd = fullMessage.length;
    for (let i = wordPosition; i < fullMessage.length; i++) {
      if (sentenceTerminators.includes(fullMessage[i])) {
        sentenceEnd = i + 1;
        break;
      }
    }
    
    // Extract and clean the sentence
    let sentenceContext = fullMessage.substring(sentenceStart, sentenceEnd).trim();
    
    // If the sentence is too long, provide a reasonable context window
    const MAX_CONTEXT_LENGTH = 150;
    if (sentenceContext.length > MAX_CONTEXT_LENGTH) {
      // Find the word position in the sentence
      const wordInSentencePos = sentenceContext.toLowerCase().indexOf(word.toLowerCase());
      
      // Calculate start and end positions for the context window
      let contextStart = Math.max(0, wordInSentencePos - Math.floor(MAX_CONTEXT_LENGTH / 2));
      let contextEnd = Math.min(sentenceContext.length, contextStart + MAX_CONTEXT_LENGTH);
      
      // Adjust to avoid cutting words
      while (contextStart > 0 && sentenceContext[contextStart] !== ' ') {
        contextStart--;
      }
      
      while (contextEnd < sentenceContext.length && sentenceContext[contextEnd] !== ' ') {
        contextEnd++;
      }
      
      // Extract the context window
      sentenceContext = sentenceContext.substring(contextStart, contextEnd);
      
      // Add ellipsis if we've truncated
      if (contextStart > 0) sentenceContext = '...' + sentenceContext;
      if (contextEnd < sentenceContext.length) sentenceContext = sentenceContext + '...';
    }
    
    return sentenceContext;
  }
  
  // Forward events from the tool handler to the parent
  function forwardEvent(event) {
    const eventName = event.type;
    const detail = event.detail;
    
    dispatch(eventName, detail);
    
    // Special case for inspect as it's equivalent to wordClick in the parent
    if (eventName === 'inspect') {
      // Get the word from the event detail
      const { word, posInfo } = detail;
      
      // Extract the sentence context
      const context = extractSentenceContext(message, word);
      
      // Dispatch wordClick with enhanced context
      dispatch('wordClick', { 
        word, 
        posInfo, 
        context 
      });
    }
  }
</script>

<div class="default-view">
  <!-- Toolbar toggle button -->
  <div class="toolbar-toggle flex justify-center border-b border-gray-200">
    <button 
      class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-transform duration-200"
      class:rotate-180={isToolbarVisible}
      on:click={toggleToolbar}
      aria-label={isToolbarVisible ? "Hide toolbar" : "Show toolbar"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  </div>
  
  <!-- Only show toolbar in default mode when expanded -->
  {#if isToolbarVisible}
    <DefaultModeToolbar 
      bind:activeTool={activeTool}
      bind:enabledTools={enabledTools}
      on:toolChange={handleToolChange}
      on:comingSoon={handleComingSoon}
    />
  {/if}
  
  <!-- Message content with active tool -->
  {#if activeTool === "analyze"}
    <div class="analyzed-content p-2 bg-blue-50 rounded">
      <TokenDisplay message={message} language={language} />
    </div>
  {:else}
    <DefaultToolHandler 
      {message}
      {language}
      {activeTool}
      on:inspect={forwardEvent}
      on:speak={handleSpeakEvent}
      on:translate={forwardEvent}
      on:image={forwardEvent}
    />
  {/if}
</div>

<style>
  .default-view {
    width: 100%;
  }
  
  .rotate-180 {
    transform: rotate(180deg);
  }
  
  .toolbar-toggle {
    cursor: pointer;
  }
  
  .analyzed-content {
    line-height: 1.6;
  }
</style>