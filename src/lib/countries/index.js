import { argentina } from "./argentina.js";
import { bolivia } from "./bolivia.js";
import { russia } from "./russia.js";

// Export individual countries for direct access
export { argentina, bolivia, russia };

// Export a combined GeoJSON with all countries
export const allCountries = {
  type: "FeatureCollection",
  features: [
    argentina,
    bolivia,
    russia,
    // Add more countries as you create them
  ],
};

// Helper functions for working with the country data
export function getCountryByName(name) {
  return allCountries.features.find(
    (feature) => feature.properties.name.toLowerCase() === name.toLowerCase()
  );
}

export function getCountryByCode(code) {
  return allCountries.features.find(
    (feature) => feature.properties.code.toLowerCase() === code.toLowerCase()
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

// Define major languages we want to display
export const majorLanguages = [
  "Spanish",
  "Russian",
  // Add other major languages as needed
];

// Get all countries that speak a specific language
export function getCountriesByLanguage(language) {
  return allCountries.features.filter(
    (feature) =>
      feature.properties.languages &&
      feature.properties.languages.includes(language)
  );
}

// Filter the countries GeoJSON by language
export function filterCountriesByLanguage(language) {
  const filteredFeatures = getCountriesByLanguage(language);

  return {
    type: "FeatureCollection",
    features: filteredFeatures,
  };
}

// Get only major languages that have countries speaking them
export function getMajorLanguages() {
  return majorLanguages.filter(
    (language) => getCountriesByLanguage(language).length > 0
  );
}
