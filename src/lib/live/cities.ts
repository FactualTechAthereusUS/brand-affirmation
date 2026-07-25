export type City = {
  name: string;
  region: string;   // state/province
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
};

// Small gazetteer — search targets + seed coords for the simulator.
export const CITIES: City[] = [
  // United States
  { name: "Los Angeles",   region: "California",       country: "United States", countryCode: "US", lat: 34.05,  lng: -118.24 },
  { name: "San Francisco", region: "California",       country: "United States", countryCode: "US", lat: 37.77,  lng: -122.42 },
  { name: "San Diego",     region: "California",       country: "United States", countryCode: "US", lat: 32.72,  lng: -117.16 },
  { name: "Seattle",       region: "Washington",       country: "United States", countryCode: "US", lat: 47.60,  lng: -122.33 },
  { name: "Portland",      region: "Oregon",           country: "United States", countryCode: "US", lat: 45.51,  lng: -122.67 },
  { name: "Denver",        region: "Colorado",         country: "United States", countryCode: "US", lat: 39.74,  lng: -104.99 },
  { name: "Phoenix",       region: "Arizona",          country: "United States", countryCode: "US", lat: 33.45,  lng: -112.07 },
  { name: "Austin",        region: "Texas",            country: "United States", countryCode: "US", lat: 30.27,  lng: -97.74 },
  { name: "Dallas",        region: "Texas",            country: "United States", countryCode: "US", lat: 32.78,  lng: -96.80 },
  { name: "Houston",       region: "Texas",            country: "United States", countryCode: "US", lat: 29.76,  lng: -95.36 },
  { name: "Chicago",       region: "Illinois",         country: "United States", countryCode: "US", lat: 41.88,  lng: -87.63 },
  { name: "Minneapolis",   region: "Minnesota",        country: "United States", countryCode: "US", lat: 44.98,  lng: -93.27 },
  { name: "Detroit",       region: "Michigan",         country: "United States", countryCode: "US", lat: 42.33,  lng: -83.05 },
  { name: "Nashville",     region: "Tennessee",        country: "United States", countryCode: "US", lat: 36.16,  lng: -86.78 },
  { name: "Atlanta",       region: "Georgia",          country: "United States", countryCode: "US", lat: 33.75,  lng: -84.39 },
  { name: "Miami",         region: "Florida",          country: "United States", countryCode: "US", lat: 25.76,  lng: -80.19 },
  { name: "Orlando",       region: "Florida",          country: "United States", countryCode: "US", lat: 28.54,  lng: -81.38 },
  { name: "Charlotte",     region: "North Carolina",   country: "United States", countryCode: "US", lat: 35.23,  lng: -80.84 },
  { name: "New York",      region: "New York",         country: "United States", countryCode: "US", lat: 40.71,  lng: -74.00 },
  { name: "Brooklyn",      region: "New York",         country: "United States", countryCode: "US", lat: 40.65,  lng: -73.95 },
  { name: "Boston",        region: "Massachusetts",    country: "United States", countryCode: "US", lat: 42.36,  lng: -71.06 },
  { name: "Philadelphia",  region: "Pennsylvania",     country: "United States", countryCode: "US", lat: 39.95,  lng: -75.17 },
  { name: "Washington",    region: "District of Columbia", country: "United States", countryCode: "US", lat: 38.90, lng: -77.04 },
  // Canada
  { name: "Toronto",       region: "Ontario",          country: "Canada", countryCode: "CA", lat: 43.65,  lng: -79.38 },
  { name: "Vancouver",     region: "British Columbia", country: "Canada", countryCode: "CA", lat: 49.28,  lng: -123.12 },
  { name: "Montreal",      region: "Quebec",           country: "Canada", countryCode: "CA", lat: 45.50,  lng: -73.57 },
  // Europe
  { name: "London",        region: "England",          country: "United Kingdom", countryCode: "GB", lat: 51.51, lng: -0.13 },
  { name: "Manchester",    region: "England",          country: "United Kingdom", countryCode: "GB", lat: 53.48, lng: -2.24 },
  { name: "Dublin",        region: "Leinster",         country: "Ireland",  countryCode: "IE", lat: 53.35,  lng: -6.26 },
  { name: "Paris",         region: "Île-de-France",    country: "France",   countryCode: "FR", lat: 48.85,  lng: 2.35 },
  { name: "Berlin",        region: "Berlin",           country: "Germany",  countryCode: "DE", lat: 52.52,  lng: 13.40 },
  { name: "Munich",        region: "Bavaria",          country: "Germany",  countryCode: "DE", lat: 48.14,  lng: 11.58 },
  { name: "Amsterdam",     region: "North Holland",    country: "Netherlands", countryCode: "NL", lat: 52.37, lng: 4.90 },
  { name: "Madrid",        region: "Madrid",           country: "Spain",    countryCode: "ES", lat: 40.42,  lng: -3.70 },
  { name: "Barcelona",     region: "Catalonia",        country: "Spain",    countryCode: "ES", lat: 41.39,  lng: 2.17 },
  { name: "Rome",          region: "Lazio",            country: "Italy",    countryCode: "IT", lat: 41.90,  lng: 12.50 },
  { name: "Stockholm",     region: "Stockholm",        country: "Sweden",   countryCode: "SE", lat: 59.33,  lng: 18.07 },
  { name: "Copenhagen",    region: "Capital Region",   country: "Denmark",  countryCode: "DK", lat: 55.68,  lng: 12.57 },
  // APAC + South America
  { name: "Sydney",        region: "New South Wales",  country: "Australia", countryCode: "AU", lat: -33.87, lng: 151.21 },
  { name: "Melbourne",     region: "Victoria",         country: "Australia", countryCode: "AU", lat: -37.81, lng: 144.96 },
  { name: "Tokyo",         region: "Tokyo",            country: "Japan",     countryCode: "JP", lat: 35.68,  lng: 139.69 },
  { name: "Singapore",     region: "Singapore",        country: "Singapore", countryCode: "SG", lat: 1.35,   lng: 103.82 },
  { name: "Mumbai",        region: "Maharashtra",      country: "India",     countryCode: "IN", lat: 19.08,  lng: 72.88 },
  { name: "Delhi",         region: "Delhi",            country: "India",     countryCode: "IN", lat: 28.61,  lng: 77.21 },
  { name: "Dubai",         region: "Dubai",            country: "UAE",       countryCode: "AE", lat: 25.20,  lng: 55.27 },
  { name: "São Paulo",     region: "São Paulo",        country: "Brazil",    countryCode: "BR", lat: -23.55, lng: -46.63 },
  { name: "Mexico City",   region: "CDMX",             country: "Mexico",    countryCode: "MX", lat: 19.43,  lng: -99.13 },
];

export function findCity(query: string): City | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const exact = CITIES.find((c) => c.name.toLowerCase() === q);
  if (exact) return exact;
  return (
    CITIES.find(
      (c) =>
        c.name.toLowerCase().startsWith(q) ||
        c.region.toLowerCase().startsWith(q) ||
        c.country.toLowerCase().startsWith(q),
    ) || null
  );
}

export function suggest(query: string, limit = 6): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q),
  ).slice(0, limit);
}
