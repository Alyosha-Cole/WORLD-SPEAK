<script>
    import { Search, Volume2, Image, Languages, ChevronRight, ChevronLeft } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
  
    export let expanded = false;
    
    const dispatch = createEventDispatcher();
    
    // Define our mode options
    const modes = [
      { id: 'inspect', icon: Search, label: 'Inspect' },
      { id: 'speak', icon: Volume2, label: 'Speak' },
      { id: 'image', icon: Image, label: 'Image' },
      { id: 'translate', icon: Languages, label: 'Translate' }
    ];
  
    function toggleExpand() {
      expanded = !expanded;
      dispatch('toggle', { expanded });
    }
    
    function selectMode(modeId) {
      dispatch('select', { mode: modeId });
    }
  </script>
  
  <div class="fixed left-0 bottom-20 z-20">
    <div class="flex items-center transition-all duration-300 {expanded ? 'bg-white shadow-md rounded-r-lg' : ''}">
      <!-- Toggle button -->
      <button
        on:click={toggleExpand}
        class="bg-[#007685] hover:bg-[#65C3BA] text-white p-3 rounded-r-lg transition-colors shadow-md"
      >
        {#if expanded}
          <ChevronLeft class="h-5 w-5" />
        {:else}
          <ChevronRight class="h-5 w-5" />
        {/if}
      </button>
  
      <!-- Mode buttons - only show when expanded -->
      {#if expanded}
        <div class="flex px-2 py-1">
          {#each modes as mode}
            <button
              on:click={() => selectMode(mode.id)}
              class="flex flex-col items-center justify-center p-2 mx-1 rounded-lg hover:bg-gray-100 transition-colors"
              title={mode.label}
            >
              <svelte:component this={mode.icon} class="h-5 w-5 text-[#007685]" />
              <span class="text-xs mt-1 text-gray-600">{mode.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>