import { error } from '@sveltejs/kit';
import { allCountries } from '$lib/countries/index.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const { code } = params;
  
  // Find the country by code
  const country = allCountries.features.find(
    feature => feature.properties.code.toLowerCase() === code.toLowerCase()
  );
  
  // If country not found, throw a 404 error
  if (!country) {
    throw error(404, {
      message: 'Country not found'
    });
  }
  
  // Return the country data
  return {
    country
  };
}