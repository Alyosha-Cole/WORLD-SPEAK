<!-- DefaultToolHandler.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let message = "";
    export let language = "spanish";
    export let activeTool = "inspect";
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Process the message text to create a structure we can work with
    let words = [];
    
    $: {
      if (message) {
        words = message.split(/\s+/).map((word, index) => ({
          text: word,
          originalIndex: index,
          cleanText: word.replace(/[.,!?;:()'"]/g, '')
        }));
      }
    }
    
    // Handle word click based on active tool
    function handleWordClick(word, event) {
      // Calculate position info for popups or sidebars
      const rect = event.target.getBoundingClientRect();
      const posInfo = {
        x: rect.left + (rect.width / 2),
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
      
      // Always allow inspect tool to work since it's implemented
      if (activeTool === 'inspect') {
        dispatch('inspect', { word: word.cleanText, posInfo });
        return;
      }
      
      // Dispatch different events based on active tool
      switch (activeTool) {
        case 'speak':
          dispatch('speak', { word: word.cleanText });
          break;
        case 'translate':
          dispatch('translate', { word: word.cleanText, posInfo });
          break;
        case 'image':
          dispatch('image', { word: word.cleanText });
          break;
        default:
          // Default to inspect as fallback
          dispatch('inspect', { word: word.cleanText, posInfo });
      }
    }
  </script>
  
  <div class="message-content">
    {#each words as word, i}
      <span 
        class="word cursor-pointer {
          activeTool === 'inspect' ? 'hover:bg-blue-50' : 
          activeTool === 'speak' ? 'hover:bg-green-50' : 
          'hover:bg-yellow-100'
        } px-0.5 py-0.5 rounded"
        on:click={(e) => handleWordClick(word, e)}
      >
        {word.text}{i < words.length - 1 ? ' ' : ''}
      </span>
    {/each}
  </div>
  
  <style>
    .message-content {
      line-height: 1.5;
    }
    
    .word {
      display: inline;
    }
  </style>