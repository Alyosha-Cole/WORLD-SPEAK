<script>
  import { page } from '$app/stores';
  import { allCountries } from '$lib/countries/index.js';
  import { getPeopleForCountry, getDefaultPeople } from '$lib/data/peopleData.js';
  import { ArrowLeft, Send, ChevronsDown, Volume2, Loader, Trash2 } from 'lucide-svelte';
  import { onMount, afterUpdate } from 'svelte';
  import TokenDisplay from '$lib/components/TokenDisplay.svelte';
  import LanguageLearningToolbar from '$lib/components/LanguageLearningToolbar.svelte';
  import DefaultView from '$lib/components/DefaultView.svelte';
  import WordDetailSidebar from '$lib/components/WordDetailSidebar.svelte';
  import ChatModesToolbar from '$lib/components/ChatModesToolbar.svelte';

  // Add a state variable to track which features are enabled
  let enabledFeatures = {
    inspect: true,   // Already implemented
    speak: false,    // Coming soon
    translate: false, // Coming soon
    image: false,      // Coming soon
    analyze: true     // Now enabled directly in the default view
  };

  // Update the handleWordClick function to handle different tool actions
  function handleWordClick(event) {
    const { word, posInfo, context } = event.detail;
    selectedWord = word;
    selectedWordPosInfo = posInfo;
    selectedWordContext = context; // Store the context
    showWordSidebar = true;
  }

  // Add handlers for other tool actions
  function handleSpeak(event) {
    const { word } = event.detail;
    // Implement speak functionality or show coming soon
    if (!enabledFeatures.speak) {
      alert("Speak feature coming soon!");
      return;
    }
    // Actual implementation goes here
  }

  function handleTranslate(event) {
    const { word, posInfo } = event.detail;
    // Implement translate functionality or show coming soon
    if (!enabledFeatures.translate) {
      alert("Translation feature coming soon!");
      return;
    }
    // Actual implementation goes here
  }

  function handleImage(event) {
    const { word } = event.detail;
    // Implement image functionality or show coming soon
    if (!enabledFeatures.image) {
      alert("Image feature coming soon!");
      return;
    }
    // Actual implementation goes here
  }

  // Get country code and person ID from URL
  const countryCode = $page.params.code;
  const personId = $page.params.personId;

  // Add this to your existing variables
  let isChatModesExpanded = false;
  
  // Add this function to handle mode selection
  function handleModeSelect(event) {
    const mode = event.detail.mode;
    console.log(`Selected mode: ${mode}`);
    alert(`${mode} mode is coming soon!`);
  }
  
  // Find country data
  const country = allCountries.features.find(
    feature => feature.properties.code.toLowerCase() === countryCode.toLowerCase()
  );
  
  // Get people data for this country
  const people = getPeopleForCountry(countryCode) ||
                (country ? getDefaultPeople(country.properties.name) : []);
  
  // Find the selected person
  const person = people.find(p => p.id === personId) || {
    name: 'Unknown',
    occupation: 'Person',
    description: 'No details available'
  };
  
  // Determine language based on country code
  function getLanguageForCountry(code) {
    const languageMap = {
      'ar': 'spanish',
      'bo': 'spanish',
      'cl': 'spanish',
      'co': 'spanish',
      'es': 'spanish',
      'mx': 'spanish',
      'ru': 'russian',
      // Add more mappings as needed
    };
    return languageMap[code.toLowerCase()] || 'spanish';
  }
  
  // Get the language for this conversation
  const conversationLanguage = getLanguageForCountry(countryCode);
  
  // Enhance the person object with location info from country
  const enhancedPerson = {
    ...person,
    location: country?.properties.name || 'unknown country',
    language: conversationLanguage
  };
  
  // Chat state
  let messages = [];
  let userInput = '';
  let chatContainer;
  let isLoading = false;
  let inputHeight = 66; // Approximate height of input bar (px)
  let showScrollButton = false;
  let userHasScrolled = false;
  let lastReadMessageIndex = 0;
  let unreadCount = 0;
  
  // Audio state
  let audioPlayer = null;
  let playingMessageId = null;
  let loadingVoiceId = null;
  let audioCache = new Map(); // Store generated audio files to avoid repeated calls
  
  // Language analysis and learning mode state
  let analysisIndex = null; // Index of the message being analyzed
  let globalAnalysisMode = false; // Whether analysis mode is globally enabled
  let showDictionary = false;
  let showGrammar = false;
  let learningMode = "default"; // Current learning mode: default, linguist, purist, translator
  
  // Word sidebar state
  let showWordSidebar = false;
  let selectedWord = null;
  let selectedWordPosInfo = null;
  let selectedWordContext = null; // Add this missing variable

  // Add confirmation dialog state variable
  let showClearConfirmation = false;
  
  // Function to create a welcome message
  function createWelcomeMessage() {
    // Default welcome message in Spanish
    let welcomeMessage = `¡Hola! Soy ${person.name}. ¿En qué puedo ayudarte hoy?`;
    
    // Choose welcome message based on language
    if (conversationLanguage === 'russian') {
      welcomeMessage = `Привет! Меня зовут ${person.name}. Чем я могу вам помочь сегодня?`;
    }
    // Add more language options as needed
    
    return {
      role: 'assistant',
      content: welcomeMessage,
      id: generateMessageId()
    };
  }
  
  // Function to clear chat history
  function clearChat() {
    // Remove from localStorage
    const storageKey = `chat_${countryCode}_${personId}`;
    localStorage.removeItem(storageKey);
    
    // Reset messages to just the welcome message
    messages = [createWelcomeMessage()];
    
    // Reset other chat-related state
    lastReadMessageIndex = 0;
    unreadCount = 0;
    userHasScrolled = false;
    analysisIndex = null;
    
    // Close the confirmation dialog
    showClearConfirmation = false;
    
    // Scroll to bottom to show the welcome message
    scrollToBottom(false);
  }
  
  // Show confirmation dialog before clearing
  function confirmClearChat() {
    showClearConfirmation = true;
  }
  
  // Cancel clear action
  function cancelClearChat() {
    showClearConfirmation = false;
  }
  
  // Load chat history from localStorage
  onMount(() => {
    const storageKey = `chat_${countryCode}_${personId}`;
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        messages = JSON.parse(savedMessages);
        lastReadMessageIndex = messages.length - 1;
      } catch (e) {
        console.error("Error parsing saved messages:", e);
        messages = [];
      }
    }
    
    if (messages.length === 0) {
      // Add default welcome message
      messages = [createWelcomeMessage()];
    } else {
      // Ensure existing messages have IDs
      messages = messages.map(msg => ({
        ...msg, 
        id: msg.id || generateMessageId()
      }));
    }
    
    // Initialize audio player
    audioPlayer = new Audio();
    audioPlayer.addEventListener('ended', () => {
      playingMessageId = null;
    });
    
    // Update the input height for padding calculations
    const inputBar = document.getElementById('message-input-bar');
    if (inputBar) {
      inputHeight = inputBar.offsetHeight;
      updatePadding();
    }
    
    // Add scroll event listener to detect when user scrolls up
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    
    // Initial scroll to bottom
    setTimeout(() => {
      scrollToBottom(false);
    }, 100);
  });
  
  // Generate a unique message ID
  function generateMessageId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // Handle scroll events
  function handleScroll() {
    if (!chatContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Use a larger threshold to determine "at bottom"
    const isAtBottom = distanceFromBottom < 100;
    
    // Update userHasScrolled flag
    userHasScrolled = !isAtBottom;
    
    // Show scroll button when not at bottom
    showScrollButton = !isAtBottom;
    
    // If user scrolls to bottom, mark all messages as read
    if (isAtBottom) {
      lastReadMessageIndex = messages.length - 1;
      unreadCount = 0;
    } else {
      // Calculate unread messages
      unreadCount = messages.length - lastReadMessageIndex - 1;
    }
  }
  
  // Update padding when inputHeight changes
  function updatePadding() {
    if (chatContainer) {
      chatContainer.style.paddingBottom = `${inputHeight + 16}px`; // Add extra padding
    }
  }
  
  // Save messages to localStorage
  $: {
    if (messages.length > 0) {
      const storageKey = `chat_${countryCode}_${personId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }
  
  // Track unread messages
  $: {
    if (messages.length > lastReadMessageIndex + 1 && userHasScrolled) {
      unreadCount = messages.length - lastReadMessageIndex - 1;
    }
  }
  
  // Auto-scroll to bottom when messages change
  $: if (messages && chatContainer && messages.length > 0) {
    // Get the last message
    const lastMessage = messages[messages.length - 1];
    
    // Auto-scroll for user messages or when not scrolled up
    if (lastMessage.role === 'user' || !userHasScrolled) {
      scrollToBottom(true);
    }
  }
  
  function scrollToBottom(animated = true) {
    if (!chatContainer) return;
    
    // Delay scrolling to ensure DOM is updated
    setTimeout(() => {
      if (animated) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
      
      // Reset flags
      userHasScrolled = false;
      lastReadMessageIndex = messages.length - 1;
      unreadCount = 0;
    }, 50);
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!userInput.trim() || isLoading) return;
    
    // Add user message with a unique ID
    messages = [...messages, { role: 'user', content: userInput, id: generateMessageId() }];
    const currentInput = userInput;
    userInput = '';
    isLoading = true;
    
    // Reset scroll flag to ensure scrolling happens
    userHasScrolled = false;
    
    try {
      // Call the backend API with person info and language
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages,
          person: enhancedPerson,
          language: conversationLanguage
        })
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response with a unique ID
      if (data.assistant) {
        messages = [...messages, { 
          role: 'assistant', 
          content: data.assistant,
          id: generateMessageId()
        }];
      } else if (data.error) {
        console.error(data.error);
        messages = [...messages, { 
          role: 'system', 
          content: 'Error: Could not get a response. Please try again.',
          id: generateMessageId()
        }];
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      messages = [...messages, { 
        role: 'system', 
        content: 'Error: Could not connect to the server. Please check your connection.',
        id: generateMessageId()
      }];
    } finally {
      isLoading = false;
    }
  }
  
  // Play audio for a message
  async function playVoice(messageId, text) {
    // If already playing this message, stop it
    if (playingMessageId === messageId) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      playingMessageId = null;
      return;
    }
    
    // Stop any currently playing audio
    if (playingMessageId) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
    
    // Check if we already have this audio cached
    if (audioCache.has(messageId)) {
      playingMessageId = messageId;
      audioPlayer.src = audioCache.get(messageId);
      audioPlayer.play();
      return;
    }
    
    // Show loading state
    loadingVoiceId = messageId;
    
    try {
      // Request audio from the backend
      const response = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          voiceId: 'IRjsPfajDk6jveoGo3jI' // Argentine man voice
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      // Convert response to blob and create an object URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the audio URL
      audioCache.set(messageId, audioUrl);
      
      // Play the audio if the user hasn't clicked on another message
      if (loadingVoiceId === messageId) {
        playingMessageId = messageId;
        audioPlayer.src = audioUrl;
        audioPlayer.play();
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      loadingVoiceId = null;
    }
  }
  
  // Return true if this message is from the same sender as the previous message
  function isContinuation(index) {
    if (index === 0) return false;
    return messages[index].role === messages[index - 1].role;
  }
  
  // Format timestamp (we'll use a placeholder for demo purposes)
  function getMessageTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Toggle analysis mode for a specific message
  function toggleAnalysis(index) {
    if (analysisIndex === index) {
      analysisIndex = null;
    } else {
      analysisIndex = index;
      
      // If we're entering analysis mode for a message,
      // make sure global analysis mode is enabled
      if (index !== null) {
        globalAnalysisMode = true;
      }
    }
    
    // Reset scroll position detection
    userHasScrolled = false;
    
    // Force re-render by creating a new messages array
    messages = [...messages];
  }
  
  // Open dictionary (placeholder for future feature)
  function openDictionary() {
    showDictionary = true;
    // Here you would implement dictionary functionality
    alert('Dictionary feature coming soon!');
    showDictionary = false;
  }
  
  // Open grammar reference (placeholder for future feature)
  function openGrammar() {
    showGrammar = true;
    // Here you would implement grammar reference functionality
    alert('Grammar reference feature coming soon!');
    showGrammar = false;
  }
  
  // Change learning mode
  function changeLearningMode(mode) {
    learningMode = mode;
    // You could add different behavior based on the selected mode
    console.log(`Switched to ${mode} mode`);
  }
</script>

<svelte:head>
  <title>Chat with {person.name}</title>
</svelte:head>

<div class="relative h-full flex flex-col">
  <!-- Header with person info -->
  <header class="sticky top-0 z-20 bg-white shadow-sm">
    <div class="flex items-center p-3">
      <a href="/country/{countryCode}/people" class="text-[#007685] hover:text-[#65C3BA] flex items-center">
        <ArrowLeft class="h-5 w-5 mr-1" />
        <span class="hidden md:inline">Back</span>
      </a>
      <div class="flex-grow flex flex-col items-center">
        <h1 class="text-xl font-medium text-gray-800">
          {person.name}
        </h1>
        <p class="text-xs text-gray-500">{person.occupation} • {enhancedPerson.location}</p>
      </div>
      <!-- Add clear chat button -->
      <button 
        on:click={confirmClearChat}
        class="text-gray-500 hover:text-red-500 transition-colors flex items-center"
        aria-label="Clear chat history"
      >
        <Trash2 class="h-5 w-5" />
        <span class="hidden md:inline ml-1">Clear</span>
      </button>
    </div>
    
    <!-- Language learning toolbar -->
    <LanguageLearningToolbar 
      language={conversationLanguage} 
      analysisMode={analysisIndex !== null}
      learningMode={learningMode}
      on:toggleAnalysis={() => {
        analysisIndex = null;
        globalAnalysisMode = !globalAnalysisMode;
      }}
      on:changeLearningMode={(event) => changeLearningMode(event.detail.mode)}
      on:openDictionary={() => openDictionary()}
      on:openGrammar={() => openGrammar()}
    />
  </header>

  <!-- Messages container - Takes full height with scrolling -->
  <div 
    bind:this={chatContainer}
    class="flex-grow overflow-y-auto px-4 py-4"
  >
    <div class="flex flex-col space-y-1">
      {#each messages as msg, i}
        <div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'} relative">
          <!-- Show timestamp above the first message in a sequence -->
          {#if !isContinuation(i)}
            <div class="text-xs text-gray-500 mx-2 mb-1 mt-2">{getMessageTime()}</div>
          {/if}
          
          <!-- Message bubble with voice button for assistant messages -->
          <div class="flex items-center group">
            <!-- Voice button (only for assistant messages) -->
            {#if msg.role === 'assistant'}
              <button 
                on:click={() => playVoice(msg.id, msg.content)}
                class="opacity-70 hover:opacity-100 mr-2 p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label="Play voice"
              >
                {#if loadingVoiceId === msg.id}
                  <Loader class="h-4 w-4 animate-spin" />
                {:else if playingMessageId === msg.id}
                  <Volume2 class="h-4 w-4 text-[#007685]" />
                {:else}
                  <Volume2 class="h-4 w-4" />
                {/if}
              </button>
            {/if}
            
            <!-- Message bubble -->
            <div class="message-bubble max-w-xs md:max-w-md px-3 py-2 rounded-2xl
              {msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : msg.role === 'assistant' 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'bg-red-100 text-red-800'
              }
              {!isContinuation(i) && msg.role === 'user' ? 'rounded-br-md' : ''}
              {!isContinuation(i) && msg.role === 'assistant' ? 'rounded-bl-md' : ''}
              {isContinuation(i) ? 'my-0.5' : 'mt-0.5'}
            ">
              {#if msg.role === 'assistant'}
                <!-- Render based on current learning mode -->
                {#if learningMode === "linguist" && analysisIndex === i}
                  <TokenDisplay message={msg.content} language={conversationLanguage} />
                {:else if learningMode === "translator"}
                  <!-- Translator mode is not fully implemented yet -->
                  {msg.content}
                {:else if learningMode === "purist"}
                  <!-- Purist mode is not fully implemented yet -->
                  {msg.content}
                {:else}
                  <!-- In the chat messages section, modify the DefaultView component usage -->
                  <DefaultView 
                    message={msg.content} 
                    language={conversationLanguage}
                    on:wordClick={handleWordClick}
                    on:speak={handleSpeak}
                    on:translate={handleTranslate}
                    on:image={handleImage}
                  />
                {/if}
              {:else}
                <!-- User messages are always shown as-is -->
                {msg.content}
              {/if}
            </div>
          </div>
        
        </div>
      {/each}
      
      <!-- Typing indicator positioned below the last message -->
      {#if isLoading}
        <div class="flex items-start mt-2">
          <div class="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-md">
            <div class="flex space-x-1">
              <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <ChatModesToolbar 
    bind:expanded={isChatModesExpanded}
    on:select={handleModeSelect}
  />

  <!-- Scroll to bottom button - Show when not at bottom -->
  <button 
    on:click={() => scrollToBottom(true)}
    class="fixed right-4 bottom-20 z-10 bg-[#007685] text-white rounded-full p-3 shadow-lg hover:bg-[#65C3BA] transition-colors {showScrollButton ? 'visible' : 'invisible'}"
    aria-label="Scroll to bottom"
  >
    <ChevronsDown class="h-6 w-6" />
    {#if unreadCount > 0}
      <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount}
      </span>
    {/if}
  </button>

  <!-- Message input bar - Fixed at bottom of screen -->
  <div id="message-input-bar" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 z-10 shadow-md">
    <div class="container mx-auto max-w-screen-lg">
      <form on:submit|preventDefault={handleSubmit} class="flex items-center">
        <input
          bind:value={userInput}
          type="text"
          class="flex-grow px-4 py-3 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-1 focus:ring-[#007685]"
          placeholder="Message..."
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          class="ml-2 p-3 rounded-full {userInput.trim() ? 'bg-[#007685] text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center focus:outline-none disabled:opacity-50 transition-colors"
          disabled={isLoading || !userInput.trim()}
        >
          <Send class="h-5 w-5" />
        </button>
      </form>
    </div>
  </div>
</div>

<!-- Word Detail Sidebar - Include the component here -->
{#if showWordSidebar}
  <WordDetailSidebar 
    word={selectedWord}
    posInfo={selectedWordPosInfo}
    context={selectedWordContext}
    language={conversationLanguage}
    bind:visible={showWordSidebar}
  />
{/if}

<!-- Confirmation Dialog for clearing chat -->
{#if showClearConfirmation}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Clear Chat History</h3>
      <p class="text-gray-700 mb-4">Are you sure you want to clear your chat history with {person.name}? This action cannot be undone.</p>
      <div class="flex justify-end space-x-3">
        <button
          on:click={cancelClearChat}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          on:click={clearChat}
          class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
{/if}