// src/shared/ui/CountryFlag.tsx
interface CountryFlagProps {
    country: string
  }
  
  const countryToCode: Record<string, string> = {
    "France": "fr",
    "Espagne": "es",
    "Italie": "it",
    "Japon": "jp",
    "Royaume-Uni": "gb",
    "Allemagne": "de",
    "Portugal": "pt",
    "Brésil": "br",
    "Australie": "au",
    "Afrique du Sud": "za",
  }
  
  function CountryFlag({ country }: CountryFlagProps) {
    const code = countryToCode[country]
  
    if (!code) return null
  
    return (
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        alt=""
        className="h-3.5 w-5 rounded-xs object-cover shadow-xs"
      />
    )
  }
  
  export default CountryFlag