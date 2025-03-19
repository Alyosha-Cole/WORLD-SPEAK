<!-- DefaultView.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import DefaultModeToolbar from './DefaultModeToolbar.svelte';
  import DefaultToolHandler from './DefaultToolHandler.svelte';
  
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
    image: false      // Enable when ready
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
  
  // Forward events from the tool handler to the parent
  function forwardEvent(event) {
    const eventName = event.type;
    const detail = event.detail;
    
    dispatch(eventName, detail);
    
    // Special case for inspect as it's equivalent to wordClick in the parent
    if (eventName === 'inspect') {
      dispatch('wordClick', detail);
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
  <DefaultToolHandler 
    {message}
    {language}
    {activeTool}
    on:inspect={forwardEvent}
    on:speak={handleSpeakEvent}
    on:translate={forwardEvent}
    on:image={forwardEvent}
  />
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
</style>