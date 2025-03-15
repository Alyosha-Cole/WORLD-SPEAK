<script>
    import { onMount } from 'svelte';
    import TokenDisplay from './TokenDisplay.svelte';
    
    // Props
    export let messages = [];
    export let language = "spanish";
    
    // State
    let analysisMode = false;
    let selectedMessageIndex = null;
    
    // Toggle analysis mode
    function toggleAnalysisMode() {
      analysisMode = !analysisMode;
      selectedMessageIndex = null;
    }
    
    // Select a message for analysis
    function selectMessage(index) {
      if (!analysisMode) return;
      
      if (selectedMessageIndex === index) {
        selectedMessageIndex = null;
      } else {
        selectedMessageIndex = index;
      }
    }
    
    // Check if a message should be analyzed
    function shouldAnalyzeMessage(msg) {
      return msg.role === 'assistant'; // Only analyze assistant messages for now
    }
  </script>
  
  <div class="message-analysis">
    <!-- Analysis mode toggle button -->
    <div class="flex justify-center my-2">
      <button 
        class="px-3 py-1 rounded-full text-sm font-medium transition-colors {analysisMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
        on:click={toggleAnalysisMode}
      >
        {analysisMode ? 'Exit Analysis Mode' : 'Analyze Language'}
      </button>
    </div>
    
    <!-- Analysis instructions (shown in analysis mode) -->
    {#if analysisMode}
      <div class="text-center text-xs text-gray-500 mb-4">
        Click on any message to analyze its language structure
      </div>
    {/if}
    
    <!-- Render messages with potential analysis -->
    <div class="messages-container">
      {#each messages as msg, i}
        <div 
          class="message {msg.role} {analysisMode && shouldAnalyzeMessage(msg) ? 'analysis-enabled' : ''} {selectedMessageIndex === i ? 'selected' : ''}"
          on:click={() => shouldAnalyzeMessage(msg) && selectMessage(i)}
        >
          <!-- Message content (normal mode or analysis mode with non-selected message) -->
          {#if !analysisMode || selectedMessageIndex !== i}
            <div class="message-content {analysisMode && shouldAnalyzeMessage(msg) ? 'clickable' : ''}">
              {msg.content}
            </div>
          {:else}
            <!-- Analyzed message content (selected in analysis mode) -->
            <div class="analyzed-content">
              <TokenDisplay message={msg.content} language={language} />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .message {
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
      padding: 0.75rem;
    }
    
    .message.user {
      background-color: #f0f0f0;
      align-self: flex-end;
    }
    
    .message.assistant {
      background-color: #e1f5fe;
      align-self: flex-start;
    }
    
    .analysis-enabled {
      position: relative;
    }
    
    .analysis-enabled:hover {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
    
    .analysis-enabled.selected {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 1);
    }
    
    .clickable {
      cursor: pointer;
    }
    
    .analyzed-content {
      background-color: white;
      border-radius: 0.25rem;
      padding: 0.5rem;
    }
  </style>