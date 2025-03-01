// Store of people data by country code
export const peopleByCountry = {
  // Argentina
  ar: [
    {
      id: "juan-perez",
      name: "Juan Pérez",
      occupation: "Tango Dancer",
      description:
        "A passionate tango dancer from Buenos Aires whose fluid movements and intense emotions capture the spirit of Argentina's dance and music culture.",
    },
    {
      id: "maria-gomez",
      name: "María Gómez",
      occupation: "Winemaker & Entrepreneur",
      description:
        "Hailing from Mendoza, María runs a boutique winery. She blends traditional viticulture with modern innovations, reflecting Argentina's rich wine heritage.",
    },
    {
      id: "carlos-sanchez",
      name: "Carlos Sánchez",
      occupation: "Rural Gaucho",
      description:
        "A proud gaucho from the Pampas, Carlos embodies Argentina's rural traditions and the deep connection to the land, living life with resilience and passion.",
    },
    {
      id: "sofia-fernandez",
      name: "Sofía Fernández",
      occupation: "Contemporary Artist",
      description:
        "From Córdoba, Sofía is an innovative artist who uses bold colors and mixed media to reflect the dynamic fusion of history and modernity in Argentina.",
    },
    {
      id: "diego-romero",
      name: "Diego Romero",
      occupation: "Tech Innovator",
      description:
        "A forward-thinking entrepreneur from Rosario, Diego leads in the tech scene with innovative ideas that bridge Argentina's rich traditions and its modern future.",
    },
    {
      id: "lucia-alvarez",
      name: "Lucía Álvarez",
      occupation: "Cultural Curator",
      description:
        "Based in Salta, Lucía curates exhibitions that celebrate Argentina's indigenous roots and contemporary arts, highlighting the country's diverse cultural tapestry.",
    },
  ],

  // Bolivia
  bo: [
    {
      id: "fernando-mamani",
      name: "Fernando Mamani",
      occupation: "Textile Artist",
      description:
        "A skilled weaver from La Paz who preserves Bolivia's rich textile traditions using vibrant colors and intricate patterns that tell stories of Andean culture.",
    },
    {
      id: "isabel-quispe",
      name: "Isabel Quispe",
      occupation: "Eco-Tourism Guide",
      description:
        "Based in Rurrenabaque, Isabel leads sustainable tours through Bolivia's Amazon rainforest, sharing her deep knowledge of local biodiversity and indigenous practices.",
    },
    {
      id: "javier-morales",
      name: "Javier Morales",
      occupation: "Salt Flat Worker",
      description:
        "From Uyuni, Javier works in the famous salt flats, harvesting salt using traditional methods while also guiding visitors through this breathtaking natural wonder.",
    },
    {
      id: "carmen-flores",
      name: "Carmen Flores",
      occupation: "Cholita Wrestler",
      description:
        "A proud cholita wrestler from El Alto who challenges stereotypes through traditional wrestling that blends athletics, culture, and feminine empowerment.",
    },
    {
      id: "miguel-condori",
      name: "Miguel Condori",
      occupation: "Indigenous Rights Advocate",
      description:
        "A community leader from Potosí who works to preserve Bolivia's indigenous languages and advocate for the rights of native communities throughout the country.",
    },
    {
      id: "luisa-torres",
      name: "Luisa Torres",
      occupation: "Quinoa Farmer",
      description:
        "From the Altiplano region, Luisa cultivates quinoa using sustainable farming practices passed down through generations, contributing to Bolivia's growing organic export market.",
    },
  ],

  // Russia
  ru: [
    {
      id: "mikhail-petrov",
      name: "Mikhail Petrov",
      occupation: "Literary Scholar",
      description:
        "A respected professor from Saint Petersburg who specializes in Dostoevsky and Tolstoy, sharing Russia's rich literary heritage with students from around the world.",
    },
    {
      id: "elena-volkova",
      name: "Elena Volkova",
      occupation: "Ballet Instructor",
      description:
        "Former prima ballerina at the Bolshoi Theater who now teaches classical Russian ballet techniques to a new generation of dancers in Moscow.",
    },
    {
      id: "ivan-sokolov",
      name: "Ivan Sokolov",
      occupation: "Siberian Forest Ranger",
      description:
        "From the Taiga forests near Lake Baikal, Ivan monitors wildlife and promotes sustainable practices in one of the world's largest forest ecosystems.",
    },
    {
      id: "natalya-orlova",
      name: "Natalya Orlova",
      occupation: "Traditional Folk Artist",
      description:
        "Creates stunning matryoshka dolls and painted lacquer boxes in Sergiev Posad, preserving centuries-old Russian artistic traditions with contemporary themes.",
    },
    {
      id: "dmitri-kuznetsov",
      name: "Dmitri Kuznetsov",
      occupation: "Tech Entrepreneur",
      description:
        "A forward-thinking founder of a successful tech startup in Moscow's growing digital ecosystem, combining Russian mathematical excellence with global innovation.",
    },
    {
      id: "anastasia-morozova",
      name: "Anastasia Morozova",
      occupation: "Arctic Researcher",
      description:
        "Based in Murmansk, she studies climate change impacts on the Arctic Circle, documenting changes to this vital and vulnerable northern ecosystem.",
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
      id: "local-resident",
      name: "Local Resident",
      occupation: "Community Member",
      description: `A proud resident of ${countryName} who embodies the local culture and traditions.`,
    },
    {
      id: "urban-professional",
      name: "Urban Professional",
      occupation: "Business Person",
      description: `Based in the capital city, this professional represents the modern workforce of ${countryName}.`,
    },
    {
      id: "cultural-representative",
      name: "Cultural Representative",
      occupation: "Arts Ambassador",
      description: `Promotes the rich cultural heritage of ${countryName} through various artistic expressions.`,
    },
  ];
}
