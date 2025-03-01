<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  
  // Props
  export let mapData;
  export let width = 800;
  export let height = 600;
  export let defaultFill = '#E5E7EB'; // Gray-200
  export let hoverFill = '#FBBF24'; // Amber-400
  export let selectedFill = '#F59E0B'; // Amber-500
  export let strokeColor = '#1F2937'; // Gray-800
  export let strokeWidth = 0.5;
  
  // State
  let mapElement;
  let selectedCountry = null;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Initialize map when component mounts
  onMount(() => {
    if (!mapData || !mapElement) return;
    
    createMap();
    
    // Clean up when component unmounts
    return () => {
      d3.select(mapElement).selectAll('*').remove();
    };
  });
  
  // Function to create the map
  function createMap() {
    // Clear any existing content
    d3.select(mapElement).selectAll('*').remove();
    
    // Create SVG container
    const svg = d3.select(mapElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Create projection
    const projection = d3.geoMercator();
    
    // Create path generator
    const path = d3.geoPath().projection(projection);
    
    // Fit projection to data
    projection.fitSize([width, height], mapData);
    
    // Create a group for the map features
    const mapGroup = svg.append('g');
    
    // Draw countries
    mapGroup.selectAll('path')
      .data(mapData.features)
      .join('path')
      .attr('d', path)
      .attr('class', 'country-path')
      .attr('fill', defaultFill)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('cursor', 'pointer')
      .attr('data-country', d => d.properties.name)
      .on('mouseover', function(event, d) {
        if (selectedCountry !== d.properties.name) {
          d3.select(this).attr('fill', hoverFill);
        }
        
        // Show tooltip if needed
        dispatch('hover', { 
          country: d.properties.name, 
          properties: d.properties,
          position: { x: event.pageX, y: event.pageY }
        });
      })
      .on('mouseout', function(event, d) {
        if (selectedCountry !== d.properties.name) {
          d3.select(this).attr('fill', defaultFill);
        }
        
        dispatch('hoverend', { country: d.properties.name });
      })
      .on('click', function(event, d) {
        // Update selected state
        if (selectedCountry) {
          // Reset previously selected country
          mapGroup.selectAll('path')
            .filter(function() {
              return d3.select(this).attr('data-country') === selectedCountry;
            })
            .attr('fill', defaultFill);
        }
        
        // Set new selected country
        selectedCountry = d.properties.name;
        d3.select(this).attr('fill', selectedFill);
        
        // Dispatch selection event
        dispatch('select', { 
          country: d.properties.name, 
          properties: d.properties 
        });
        
        // Navigate to the people page for this country
        if (d.properties.code) {
          window.location.href = `/country/${d.properties.code.toLowerCase()}/people`;
        }
      });
    
    // Optional: Add country labels
    // mapGroup.selectAll('text')
    //   .data(mapData.features)
    //   .join('text')
    //   .attr('x', d => path.centroid(d)[0])
    //   .attr('y', d => path.centroid(d)[1])
    //   .attr('text-anchor', 'middle')
    //   .attr('font-size', '10px')
    //   .attr('pointer-events', 'none')
    //   .text(d => d.properties.name);
  }
  
  // Watch for changes in props
  $: if (mapElement && mapData) {
    createMap();
  }
</script>

<div class={`map-container relative ${$$props.class || ''}`}>
  <svg bind:this={mapElement}></svg>
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
  }
  
  /* Make path transitions smooth */
  :global(.country-path) {
    transition: fill 0.3s ease;
  }
</style>