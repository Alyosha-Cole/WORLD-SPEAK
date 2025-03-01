// Store of people data by country code
export const peopleByCountry = {
  // Argentina
  ar: [
    {
      name: "Juan Pérez",
      occupation: "Tango Dancer",
      description:
        "A passionate tango dancer from Buenos Aires whose fluid movements and intense emotions capture the spirit of Argentina's dance and music culture.",
    },
    {
      name: "María Gómez",
      occupation: "Winemaker & Entrepreneur",
      description:
        "Hailing from Mendoza, María runs a boutique winery. She blends traditional viticulture with modern innovations, reflecting Argentina's rich wine heritage.",
    },
    {
      name: "Carlos Sánchez",
      occupation: "Rural Gaucho",
      description:
        "A proud gaucho from the Pampas, Carlos embodies Argentina's rural traditions and the deep connection to the land, living life with resilience and passion.",
    },
    {
      name: "Sofía Fernández",
      occupation: "Contemporary Artist",
      description:
        "From Córdoba, Sofía is an innovative artist who uses bold colors and mixed media to reflect the dynamic fusion of history and modernity in Argentina.",
    },
    {
      name: "Diego Romero",
      occupation: "Tech Innovator",
      description:
        "A forward-thinking entrepreneur from Rosario, Diego leads in the tech scene with innovative ideas that bridge Argentina's rich traditions and its modern future.",
    },
    {
      name: "Lucía Álvarez",
      occupation: "Cultural Curator",
      description:
        "Based in Salta, Lucía curates exhibitions that celebrate Argentina's indigenous roots and contemporary arts, highlighting the country's diverse cultural tapestry.",
    },
  ],

  // Bolivia
  bo: [
    {
      name: "Fernando Mamani",
      occupation: "Textile Artist",
      description:
        "A skilled weaver from La Paz who preserves Bolivia's rich textile traditions using vibrant colors and intricate patterns that tell stories of Andean culture.",
    },
    {
      name: "Isabel Quispe",
      occupation: "Eco-Tourism Guide",
      description:
        "Based in Rurrenabaque, Isabel leads sustainable tours through Bolivia's Amazon rainforest, sharing her deep knowledge of local biodiversity and indigenous practices.",
    },
    {
      name: "Javier Morales",
      occupation: "Salt Flat Worker",
      description:
        "From Uyuni, Javier works in the famous salt flats, harvesting salt using traditional methods while also guiding visitors through this breathtaking natural wonder.",
    },
    {
      name: "Carmen Flores",
      occupation: "Cholita Wrestler",
      description:
        "A proud cholita wrestler from El Alto who challenges stereotypes through traditional wrestling that blends athletics, culture, and feminine empowerment.",
    },
    {
      name: "Miguel Condori",
      occupation: "Indigenous Rights Advocate",
      description:
        "A community leader from Potosí who works to preserve Bolivia's indigenous languages and advocate for the rights of native communities throughout the country.",
    },
    {
      name: "Luisa Torres",
      occupation: "Quinoa Farmer",
      description:
        "From the Altiplano region, Luisa cultivates quinoa using sustainable farming practices passed down through generations, contributing to Bolivia's growing organic export market.",
    },
  ],
};

// Helper function to get people for a specific country
export function getPeopleForCountry(countryCode) {
  return peopleByCountry[countryCode.toLowerCase()] || [];
}

// Add default people for countries that don't have specific data
export function getDefaultPeople(countryName) {
  return [
    {
      name: "Local Resident",
      occupation: "Community Member",
      description: `A proud resident of ${countryName} who embodies the local culture and traditions.`,
    },
    {
      name: "Urban Professional",
      occupation: "Business Person",
      description: `Based in the capital city, this professional represents the modern workforce of ${countryName}.`,
    },
    {
      name: "Cultural Representative",
      occupation: "Arts Ambassador",
      description: `Promotes the rich cultural heritage of ${countryName} through various artistic expressions.`,
    },
  ];
}
