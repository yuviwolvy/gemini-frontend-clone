import { type Country } from "../types";

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,idd"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch country data");
    }
    const data = await response.json();

    const formattedData: Country[] = data
      .map((country: any) => ({
        name: country.name.common,
        flagUrl: country.flags.svg,
        dialCode: `${country.idd.root}${
          country.idd.suffixes ? country.idd.suffixes[0] : ""
        }`,
      }))
      .filter((country: Country) => country.dialCode && country.name) // Filter out countries without a dial code or name
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

    return formattedData;
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return an empty array on error
  }
};
