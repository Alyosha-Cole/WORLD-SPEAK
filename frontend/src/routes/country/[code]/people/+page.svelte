<script>
  import { page } from '$app/stores';
  import { allCountries } from '$lib/countries/index.js';
  import { getPeopleForCountry, getDefaultPeople } from '$lib/data/peopleData.js';
  import { ArrowLeft, User, Briefcase, Info, MessageSquare } from 'lucide-svelte';
  
  // Get country code from URL
  const countryCode = $page.params.code;
  
  // Find country data
  const country = allCountries.features.find(
    feature => feature.properties.code.toLowerCase() === countryCode.toLowerCase()
  );
  
  // Get people data for this country
  const people = getPeopleForCountry(countryCode) ||
                (country ? getDefaultPeople(country.properties.name) : []);
</script>

<svelte:head>
  <title>People of {country?.properties.name || 'Country'}</title>
</svelte:head>

<div class="bg-gray-100 min-h-screen py-8">
  <div class="container mx-auto px-4">
    <div class="mb-6">
      <a href="/" class="text-primary hover:underline flex items-center">
        <ArrowLeft class="h-5 w-5 mr-1" />
        Back to Map
      </a>
    </div>
    
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
      People of {country?.properties.name || 'Country'}
    </h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {#each people as person}
        <div class="bg-white rounded-lg shadow-md p-6 hover:transform hover:scale-[1.02] transition-transform duration-200 flex flex-col h-full">
          <div class="flex items-center mb-2">
            <User class="h-5 w-5 text-pink-600 mr-2" />
            <h2 class="text-xl font-bold text-pink-600">{person.name}</h2>
          </div>
          <div class="flex items-center mb-3">
            <Briefcase class="h-4 w-4 text-gray-800 mr-2" />
            <p class="font-semibold text-gray-800">{person.occupation}</p>
          </div>
          <div class="flex items-start mb-4">
            <Info class="h-4 w-4 text-gray-600 mr-2 mt-1 flex-shrink-0" />
            <p class="text-gray-600 flex-grow">{person.description}</p>
          </div>
          <div class="mt-auto">
            <a 
            href="/country/{countryCode}/people/{person.id}/chat"
            class="inline-flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <MessageSquare class="h-4 w-4 mr-2" />
              Start Conversation
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>