<!-- DefaultModeToolbar.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import { Eye, Volume2, Languages, Image } from 'lucide-svelte';
    
    // Props
    export let activeTool = 'inspect'; // Default tool is "inspect"
    export let enabledTools = {
      inspect: true,   // Enabled by default
      speak: false,    // Set to true when ready
      translate: false, // Set to true when ready
      image: false     // Set to true when ready
    };
  
    // Event dispatcher to communicate with parent component
    const dispatch = createEventDispatcher();
    
    // Tool configurations
    const tools = [
      { 
        id: 'inspect', 
        name: 'Inspect', 
        icon: Eye, 
        description: 'Click on words to see details' 
      },
      { 
        id: 'speak', 
        name: 'Speak', 
        icon: Volume2, 
        description: 'Click on words to hear pronunciation (UI only)' 
      },
      { 
        id: 'translate', 
        name: 'Translate', 
        icon: Languages, 
        description: 'Click on words to see translation' 
      },
      { 
        id: 'image', 
        name: 'Image', 
        icon: Image, 
        description: 'Click on words to see related images' 
      }
    ];
    
    // Handle tool selection
    function selectTool(toolId) {
      // The inspect tool is always available
      if (toolId === 'inspect') {
        activeTool = toolId;
        dispatch('toolChange', { toolId });
        return;
      }
      
      // If other tools are disabled, show coming soon message
      if (!enabledTools[toolId]) {
        dispatch('comingSoon', { toolId });
        return;
      }
      
      // Otherwise set it as the active tool
      activeTool = toolId;
      dispatch('toolChange', { toolId });
    }
  </script>
  
  <div class="default-mode-toolbar bg-white border-b border-gray-200 py-2">
    <div class="flex justify-around items-center">
      {#each tools as tool}
        <button 
          class="flex flex-col items-center p-2 rounded-md transition-colors 
                {activeTool === tool.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}
                {!enabledTools[tool.id] && tool.id !== 'inspect' ? 'opacity-60' : 'opacity-100'}"
          on:click={() => selectTool(tool.id)}
          title={enabledTools[tool.id] || tool.id === 'inspect' ? tool.description : `${tool.name} - Coming Soon!`}
        >
          <svelte:component this={tool.icon} class="h-5 w-5 mb-1" />
          <span class="text-xs">{tool.name}</span>
          {#if !enabledTools[tool.id] && tool.id !== 'inspect'}
            <span class="text-xs text-gray-500">Soon</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>