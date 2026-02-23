export const normalizeCountryCode = (countryName: string): string => {
  const countryMappings: Record<string, string> = {
    /** Lithuania (LT) **/
    "lithuania": "LT",
    "lietuva": "LT",
    "lithuanian": "LT",

    /** Latvia (LV) **/
    "latvia": "LV",
    "latvija": "LV",
    "latvian": "LV",

    /** Estonia (EE) **/
    "estonia": "EE",
    "eesti": "EE",
    "estonian": "EE",

    /** Poland (PL) **/
    "poland": "PL",
    "polska": "PL",
    "polish": "PL"
  };

  const normalized = countryName.toLowerCase().trim();
  return countryMappings[normalized] || countryName.toUpperCase();
};
