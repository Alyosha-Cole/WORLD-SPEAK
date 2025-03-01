import { argentina } from "./argentina.js";
import { bolivia } from "./bolivia.js";

// Export individual countries for direct access
export { argentina, bolivia };

// Export a combined GeoJSON with all countries
export const allCountries = {
  type: "FeatureCollection",
  features: [
    argentina,
    bolivia,
    // Add more countries as you create them
  ],
};

// Helper functions for working with the country data
export function getCountryByName(name) {
  return allCountries.features.find(
    (feature) => feature.properties.name.toLowerCase() === name.toLowerCase()
  );
}

export function getCountriesByRegion(region) {
  return allCountries.features.filter(
    (feature) => feature.properties.region === region
  );
}

export function getSouthAmericanCountries() {
  return getCountriesByRegion("South America");
}

export function getCountryLanguages() {
  // Returns an array of all unique languages across all countries
  const languages = new Set();

  allCountries.features.forEach((country) => {
    if (country.properties.languages) {
      country.properties.languages.forEach((lang) => languages.add(lang));
    }
  });

  return Array.from(languages).sort();
}
