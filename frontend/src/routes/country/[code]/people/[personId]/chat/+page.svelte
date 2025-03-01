<script>
    import { page } from '$app/stores';
    import { allCountries } from '$lib/countries/index.js';
    import { getPeopleForCountry, getDefaultPeople } from '$lib/data/peopleData.js';
    import { ArrowLeft, Send } from 'lucide-svelte';
    import { onMount } from 'svelte';
    
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
    
    // Load chat history from localStorage
    onMount(() => {
      const storageKey = `chat_${countryCode}_${personId}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        messages = JSON.parse(savedMessages);
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
    });
    
    // Save messages to localStorage
    $: {
      if (messages.length > 0) {
        const storageKey = `chat_${countryCode}_${personId}`;
        localStorage.setItem(storageKey, JSON.stringify(messages));
      }
    }
    
    // Handle form submission
    async function handleSubmit() {
      if (!userInput.trim() || isLoading) return;
      
      // Add user message
      messages = [...messages, { role: 'user', content: userInput }];
      const currentInput = userInput;
      userInput = '';
      isLoading = true;
      
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
    
    // Auto-scroll to bottom when messages change
    $: if (messages && chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 0);
    }
  </script>
  
  <svelte:head>
    <title>Chat with {person.name}</title>
  </svelte:head>
  
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow p-4">
      <div class="container mx-auto px-4">
        <div class="flex items-center">
          <a href="/country/{countryCode}/people" class="text-primary hover:underline flex items-center">
            <ArrowLeft class="h-5 w-5 mr-1" />
            Back to People
          </a>
          <h1 class="text-xl font-bold text-gray-800 mx-auto">
            Chat with {person.name}
          </h1>
        </div>
      </div>
    </header>
  
    <!-- Main Chat Container -->
    <main class="flex-grow container mx-auto px-4 py-6 flex flex-col">
      <!-- Chat Messages Container -->
      <div
        bind:this={chatContainer}
        class="bg-white shadow rounded p-4 flex-grow overflow-y-auto mb-4 space-y-4"
      >
        {#each messages as msg}
          <div class="mb-4 flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-xs md:max-w-md p-3 rounded-lg {
              msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 
              msg.role === 'assistant' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }">
              {msg.content}
            </div>
          </div>
        {/each}
        
        {#if isLoading}
          <div class="flex justify-start">
            <div class="max-w-xs md:max-w-md p-3 rounded-lg bg-green-100 text-green-800">
              <div class="flex space-x-2">
                <div class="w-3 h-3 rounded-full bg-green-500 animate-bounce"></div>
                <div class="w-3 h-3 rounded-full bg-green-500 animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-3 h-3 rounded-full bg-green-500 animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        {/if}
      </div>
  
      <!-- Message Input Section -->
      <div class="bg-white shadow rounded p-4">
        <form on:submit|preventDefault={handleSubmit}>
          <div class="flex">
            <input
              bind:value={userInput}
              type="text"
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Write something in English..."
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 flex items-center disabled:bg-green-300"
              disabled={isLoading}
            >
              <Send class="h-4 w-4 mr-1" />
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>