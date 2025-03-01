<script>
    export let country = null;
    
    $: hasCountry = country !== null;
  </script>
  
  {#if hasCountry}
    <div class="country-info p-6 bg-white rounded-lg shadow-lg">
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-slate-900">{country.properties.name}</h2>
      </div>
      
      <div class="space-y-3 text-slate-700">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <div class="text-slate-500">Capital</div>
          <div>{country.properties.capital || 'N/A'}</div>
          
          <div class="text-slate-500">Region</div>
          <div>{country.properties.region || 'N/A'}</div>
          
          <div class="text-slate-500">Population</div>
          <div>{country.properties.population?.toLocaleString() || 'N/A'}</div>
          
          <div class="text-slate-500">Languages</div>
          <div>
            {#if country.properties.languages}
              {country.properties.languages.join(', ')}
            {:else}
              N/A
            {/if}
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <a 
          href={`/country/${country.properties.code}`} 
          class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Learn more
        </a>
      </div>
    </div>
  {:else}
    <div class="country-info p-6 bg-white rounded-lg shadow-lg text-center">
      <p class="text-lg text-slate-500">Select a country on the map to see details</p>
    </div>
  {/if}
  
  <style>
    .country-info {
      width: 100%;
      height: 100%;
    }
  </style>