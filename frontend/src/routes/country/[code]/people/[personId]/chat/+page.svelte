<script>
    import { page } from '$app/stores';
    import { allCountries } from '$lib/countries/index.js';
    import { getPeopleForCountry, getDefaultPeople } from '$lib/data/peopleData.js';
    import { ArrowLeft, Send, ChevronsDown } from 'lucide-svelte';
    import { onMount, afterUpdate } from 'svelte';
    
    // Get country code and person ID from URL
    const countryCode = $page.params.code;
    const personId = $page.params.personId;
    
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
    
    // Load chat history from localStorage
    onMount(() => {
      const storageKey = `chat_${countryCode}_${personId}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        messages = JSON.parse(savedMessages);
        lastReadMessageIndex = messages.length - 1;
      }
      
      if (messages.length === 0) {
        // Default welcome message in Spanish
        let welcomeMessage = `¡Hola! Soy ${person.name}. ¿En qué puedo ayudarte hoy?`;
        
        // Choose welcome message based on language
        if (conversationLanguage === 'russian') {
          welcomeMessage = `Привет! Меня зовут ${person.name}. Чем я могу вам помочь сегодня?`;
        }
        // Add more language options as needed
        
        messages = [{
          role: 'assistant',
          content: welcomeMessage
        }];
      }
      
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
      
      // Add user message
      messages = [...messages, { role: 'user', content: userInput }];
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
        
        const data = await response.json();
        
        // Add assistant response
        if (data.assistant) {
          messages = [...messages, { role: 'assistant', content: data.assistant }];
        } else if (data.error) {
          console.error(data.error);
          messages = [...messages, { 
            role: 'system', 
            content: 'Error: Could not get a response. Please try again.' 
          }];
        }
      } catch (error) {
        console.error('Error calling chat API:', error);
        messages = [...messages, { 
          role: 'system', 
          content: 'Error: Could not connect to the server. Please check your connection.' 
        }];
      } finally {
        isLoading = false;
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
  </script>
  
  <svelte:head>
    <title>Chat with {person.name}</title>
  </svelte:head>
  
  <div class="relative h-full flex flex-col">
    <!-- Header with person info -->
    <header class="sticky top-0 z-20 bg-white shadow-sm p-3">
      <div class="flex items-center">
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
      </div>
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
              {msg.content}
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