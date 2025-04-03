<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let activeTool = "inspect";
    export let enabledTools = {
      inspect: true,
      speak: true,
      translate: false,
      image: false,
      analyze: true
    };
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Define all available tools
    const tools = [
      {
        id: "inspect",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        label: "Inspect",
        tooltip: "Click on words to view their meaning and details"
      },
      {
        id: "speak",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        label: "Speak",
        tooltip: "Click on words to hear their pronunciation"
      },
      {
        id: "translate",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
        label: "Translate",
        tooltip: "Click on words to see translations"
      },
      {
        id: "image",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
        label: "Image",
        tooltip: "Click on words to see related images"
      },
      {
        id: "analyze",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
        label: "Analyze",
        tooltip: "Show linguistic analysis of the text"
      }
    ];
    
    // Change the active tool
    function setActiveTool(toolId) {
      if (enabledTools[toolId]) {
        dispatch('toolChange', { toolId });
      } else {
        dispatch('comingSoon', { toolId });
      }
    }
  </script>
  
  <div class="toolbar border-b border-gray-200 p-2 bg-gray-50">
    <div class="tools-container flex flex-wrap justify-around">
      {#each tools as tool}
        <button 
          class="tool-button flex flex-col items-center p-2 rounded-md transition-colors text-xs {
            activeTool === tool.id ? 
              'bg-blue-100 text-blue-700' : 
              'text-gray-600 hover:bg-gray-100'
          } {
            !enabledTools[tool.id] ? 'opacity-50' : ''
          }"
          on:click={() => setActiveTool(tool.id)}
          title={tool.tooltip}
        >
          <div class="icon mb-1">
            {@html tool.icon}
          </div>
          <span class="label">{tool.label}</span>
          {#if !enabledTools[tool.id]}
            <span class="coming-soon text-xs bg-gray-200 px-1 rounded mt-1">Soon</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
  
  <style>
    .tool-button {
      min-width: 60px;
      cursor: pointer;
    }
    
    .tool-button:focus {
      outline: none;
    }
  </style>