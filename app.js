/* FiguScan Mundial V36 - fondo real reducido, foto estable y borrado parcial de repetidas */
const STORAGE_KEY = 'figuscan_v12_stickers';
const USER_KEY = 'figuscan_v12_user';
const APP_URL = 'https://figuscan-mundial-app.vercel.app/';

const STATUS = {
  have: { label: 'Tengo', long: 'La tengo', cls: 'have', color: '#18A957' },
  missing: { label: 'Me falta', long: 'Me falta', cls: 'missing', color: '#E23131' },
  repeated: { label: 'Repetida', long: 'Repetida', cls: 'repeated', color: '#F28B13' },
};


const COUNTRIES = [
  {
    "id": "general",
    "name": "País sin cargar",
    "short": "",
    "flag": "⚽",
    "color": "#FFD166",
    "aliases": [
      "General",
      "GEN"
    ]
  },
  {
    "id": "francia",
    "name": "Francia",
    "short": "FRA",
    "flag": "🇫🇷",
    "color": "#EF4444",
    "aliases": [
      "France",
      "Francia",
      "FRA",
      "FR",
      "French Republic"
    ]
  },
  {
    "id": "espana",
    "name": "España",
    "short": "ESP",
    "flag": "🇪🇸",
    "color": "#7DD3FC",
    "aliases": [
      "Spain",
      "España",
      "ESP",
      "ES",
      "Kingdom of Spain"
    ]
  },
  {
    "id": "argentina",
    "name": "Argentina",
    "short": "ARG",
    "flag": "🇦🇷",
    "color": "#7DD3FC",
    "aliases": [
      "Argentina",
      "ARG",
      "AR",
      "Argentine Republic"
    ]
  },
  {
    "id": "inglaterra",
    "name": "Inglaterra",
    "short": "ENG",
    "flag": "🏴",
    "color": "#EF4444",
    "aliases": [
      "England",
      "Inglaterra",
      "ENG",
      "GB",
      "English"
    ]
  },
  {
    "id": "portugal",
    "name": "Portugal",
    "short": "POR",
    "flag": "🇵🇹",
    "color": "#DC2626",
    "aliases": [
      "Portugal",
      "POR",
      "PT",
      "Portuguese Republic"
    ]
  },
  {
    "id": "brasil",
    "name": "Brasil",
    "short": "BRA",
    "flag": "🇧🇷",
    "color": "#7DD3FC",
    "aliases": [
      "Brazil",
      "Brasil",
      "BRA",
      "BR",
      "Federative Republic of Brazil"
    ]
  },
  {
    "id": "paises-bajos",
    "name": "Países Bajos",
    "short": "NED",
    "flag": "🇳🇱",
    "color": "#D4AF37",
    "aliases": [
      "Netherlands",
      "Países Bajos",
      "NED",
      "NL",
      "Kingdom of the Netherlands",
      "Holanda",
      "Holland"
    ]
  },
  {
    "id": "marruecos",
    "name": "Marruecos",
    "short": "MAR",
    "flag": "🇲🇦",
    "color": "#FB923C",
    "aliases": [
      "Morocco",
      "Marruecos",
      "MAR",
      "MA",
      "Kingdom of Morocco"
    ]
  },
  {
    "id": "belgica",
    "name": "Bélgica",
    "short": "BEL",
    "flag": "🇧🇪",
    "color": "#F472B6",
    "aliases": [
      "Belgium",
      "Bélgica",
      "BEL",
      "BE",
      "Kingdom of Belgium"
    ]
  },
  {
    "id": "alemania",
    "name": "Alemania",
    "short": "GER",
    "flag": "🇩🇪",
    "color": "#D4AF37",
    "aliases": [
      "Germany",
      "Alemania",
      "GER",
      "DE",
      "Federal Republic of Germany",
      "Deutschland",
      "ALE"
    ]
  },
  {
    "id": "croacia",
    "name": "Croacia",
    "short": "CRO",
    "flag": "🇭🇷",
    "color": "#800020",
    "aliases": [
      "Croatia",
      "Croacia",
      "CRO",
      "HR",
      "Republic of Croatia"
    ]
  },
  {
    "id": "italia",
    "name": "Italia",
    "short": "ITA",
    "flag": "🇮🇹",
    "color": "#D4AF37",
    "aliases": [
      "Italy",
      "Italia",
      "ITA",
      "IT",
      "Italian Republic"
    ]
  },
  {
    "id": "colombia",
    "name": "Colombia",
    "short": "COL",
    "flag": "🇨🇴",
    "color": "#DC2626",
    "aliases": [
      "Colombia",
      "COL",
      "CO",
      "Republic of Colombia"
    ]
  },
  {
    "id": "senegal",
    "name": "Senegal",
    "short": "SEN",
    "flag": "🇸🇳",
    "color": "#800020",
    "aliases": [
      "Senegal",
      "SEN",
      "SN",
      "Republic of Senegal"
    ]
  },
  {
    "id": "mexico",
    "name": "México",
    "short": "MEX",
    "flag": "🇲🇽",
    "color": "#D4AF37",
    "aliases": [
      "Mexico",
      "México",
      "MEX",
      "MX",
      "United Mexican States"
    ]
  },
  {
    "id": "estados-unidos",
    "name": "Estados Unidos",
    "short": "USA",
    "flag": "🇺🇸",
    "color": "#22C55E",
    "aliases": [
      "United States",
      "Estados Unidos",
      "USA",
      "US",
      "United States of America",
      "EEUU",
      "EE.UU."
    ]
  },
  {
    "id": "uruguay",
    "name": "Uruguay",
    "short": "URU",
    "flag": "🇺🇾",
    "color": "#74C0FC",
    "aliases": [
      "Uruguay",
      "URU",
      "UY",
      "Eastern Republic of Uruguay"
    ]
  },
  {
    "id": "japon",
    "name": "Japón",
    "short": "JPN",
    "flag": "🇯🇵",
    "color": "#FF6B6B",
    "aliases": [
      "Japan",
      "Japón",
      "JPN",
      "JP"
    ]
  },
  {
    "id": "suiza",
    "name": "Suiza",
    "short": "SUI",
    "flag": "🇨🇭",
    "color": "#10B981",
    "aliases": [
      "Switzerland",
      "Suiza",
      "SUI",
      "CH",
      "Swiss Confederation"
    ]
  },
  {
    "id": "dinamarca",
    "name": "Dinamarca",
    "short": "DEN",
    "flag": "🇩🇰",
    "color": "#60A5FA",
    "aliases": [
      "Denmark",
      "Dinamarca",
      "DEN",
      "DK",
      "Kingdom of Denmark"
    ]
  },
  {
    "id": "iran",
    "name": "Irán",
    "short": "IRN",
    "flag": "🇮🇷",
    "color": "#F8FAFC",
    "aliases": [
      "Iran, Islamic Republic of",
      "Irán",
      "IRN",
      "IR",
      "Islamic Republic of Iran"
    ]
  },
  {
    "id": "turquia",
    "name": "Turquía",
    "short": "TUR",
    "flag": "🇹🇷",
    "color": "#74C0FC",
    "aliases": [
      "Türkiye",
      "Turquía",
      "TUR",
      "TR",
      "Republic of Türkiye",
      "Turkey"
    ]
  },
  {
    "id": "ecuador",
    "name": "Ecuador",
    "short": "ECU",
    "flag": "🇪🇨",
    "color": "#FACC15",
    "aliases": [
      "Ecuador",
      "ECU",
      "EC",
      "Republic of Ecuador"
    ]
  },
  {
    "id": "austria",
    "name": "Austria",
    "short": "AUT",
    "flag": "🇦🇹",
    "color": "#EF4444",
    "aliases": [
      "Austria",
      "AUT",
      "AT",
      "Republic of Austria"
    ]
  },
  {
    "id": "corea-del-sur",
    "name": "Corea del Sur",
    "short": "KOR",
    "flag": "🇰🇷",
    "color": "#EF4444",
    "aliases": [
      "Korea, Republic of",
      "Corea del Sur",
      "KOR",
      "KR",
      "South Korea",
      "Korea Republic"
    ]
  },
  {
    "id": "nigeria",
    "name": "Nigeria",
    "short": "NGA",
    "flag": "🇳🇬",
    "color": "#800020",
    "aliases": [
      "Nigeria",
      "NGA",
      "NG",
      "Federal Republic of Nigeria"
    ]
  },
  {
    "id": "australia",
    "name": "Australia",
    "short": "AUS",
    "flag": "🇦🇺",
    "color": "#DC2626",
    "aliases": [
      "Australia",
      "AUS",
      "AU"
    ]
  },
  {
    "id": "argelia",
    "name": "Argelia",
    "short": "ALG",
    "flag": "🇩🇿",
    "color": "#10B981",
    "aliases": [
      "Algeria",
      "Argelia",
      "ALG",
      "DZ",
      "People's Democratic Republic of Algeria"
    ]
  },
  {
    "id": "egipto",
    "name": "Egipto",
    "short": "EGY",
    "flag": "🇪🇬",
    "color": "#FF6B6B",
    "aliases": [
      "Egypt",
      "Egipto",
      "EGY",
      "EG",
      "Arab Republic of Egypt"
    ]
  },
  {
    "id": "canada",
    "name": "Canadá",
    "short": "CAN",
    "flag": "🇨🇦",
    "color": "#FF6B6B",
    "aliases": [
      "Canada",
      "Canadá",
      "CAN",
      "CA"
    ]
  },
  {
    "id": "noruega",
    "name": "Noruega",
    "short": "NOR",
    "flag": "🇳🇴",
    "color": "#22C55E",
    "aliases": [
      "Norway",
      "Noruega",
      "NOR",
      "NO",
      "Kingdom of Norway"
    ]
  },
  {
    "id": "ucrania",
    "name": "Ucrania",
    "short": "UKR",
    "flag": "🇺🇦",
    "color": "#FACC15",
    "aliases": [
      "Ukraine",
      "Ucrania",
      "UKR",
      "UA"
    ]
  },
  {
    "id": "panama",
    "name": "Panamá",
    "short": "PAN",
    "flag": "🇵🇦",
    "color": "#800020",
    "aliases": [
      "Panama",
      "Panamá",
      "PAN",
      "PA",
      "Republic of Panama"
    ]
  },
  {
    "id": "costa-de-marfil",
    "name": "Costa de Marfil",
    "short": "CIV",
    "flag": "🇨🇮",
    "color": "#10B981",
    "aliases": [
      "Côte d'Ivoire",
      "Costa de Marfil",
      "CIV",
      "CI",
      "Republic of Côte d'Ivoire",
      "Ivory Coast",
      "Cote d Ivoire",
      "Côte d Ivoire"
    ]
  },
  {
    "id": "polonia",
    "name": "Polonia",
    "short": "POL",
    "flag": "🇵🇱",
    "color": "#EF4444",
    "aliases": [
      "Poland",
      "Polonia",
      "POL",
      "PL",
      "Republic of Poland"
    ]
  },
  {
    "id": "rusia",
    "name": "Rusia",
    "short": "RUS",
    "flag": "🇷🇺",
    "color": "#F8FAFC",
    "aliases": [
      "Russian Federation",
      "Rusia",
      "RUS",
      "RU"
    ]
  },
  {
    "id": "reino-unido",
    "name": "Reino Unido",
    "short": "WAL",
    "flag": "🏴",
    "color": "#60A5FA",
    "aliases": [
      "Wales",
      "Reino Unido",
      "WAL",
      "GB",
      "Gales"
    ]
  },
  {
    "id": "suecia",
    "name": "Suecia",
    "short": "SWE",
    "flag": "🇸🇪",
    "color": "#74C0FC",
    "aliases": [
      "Sweden",
      "Suecia",
      "SWE",
      "SE",
      "Kingdom of Sweden"
    ]
  },
  {
    "id": "serbia",
    "name": "Serbia",
    "short": "SRB",
    "flag": "🇷🇸",
    "color": "#60A5FA",
    "aliases": [
      "Serbia",
      "SRB",
      "RS",
      "Republic of Serbia"
    ]
  },
  {
    "id": "paraguay",
    "name": "Paraguay",
    "short": "PAR",
    "flag": "🇵🇾",
    "color": "#F8FAFC",
    "aliases": [
      "Paraguay",
      "PAR",
      "PY",
      "Republic of Paraguay"
    ]
  },
  {
    "id": "republica-checa",
    "name": "República Checa",
    "short": "CZE",
    "flag": "🇨🇿",
    "color": "#EF4444",
    "aliases": [
      "Czechia",
      "República Checa",
      "CZE",
      "CZ",
      "Czech Republic",
      "Chequia"
    ]
  },
  {
    "id": "hungria",
    "name": "Hungría",
    "short": "HUN",
    "flag": "🇭🇺",
    "color": "#EF4444",
    "aliases": [
      "Hungary",
      "Hungría",
      "HUN",
      "HU"
    ]
  },
  {
    "id": "reino-unido-2",
    "name": "Reino Unido",
    "short": "SCO",
    "flag": "🏴",
    "color": "#60A5FA",
    "aliases": [
      "Scotland",
      "Reino Unido",
      "SCO",
      "GB",
      "Escocia"
    ]
  },
  {
    "id": "tunez",
    "name": "Túnez",
    "short": "TUN",
    "flag": "🇹🇳",
    "color": "#22C55E",
    "aliases": [
      "Tunisia",
      "Túnez",
      "TUN",
      "TN",
      "Republic of Tunisia"
    ]
  },
  {
    "id": "camerun",
    "name": "Camerún",
    "short": "CMR",
    "flag": "🇨🇲",
    "color": "#22C55E",
    "aliases": [
      "Cameroon",
      "Camerún",
      "CMR",
      "CM",
      "Republic of Cameroon"
    ]
  },
  {
    "id": "congo-dr",
    "name": "Congo DR",
    "short": "COD",
    "flag": "🇨🇩",
    "color": "#4D96FF",
    "aliases": [
      "Congo, The Democratic Republic of the",
      "Congo DR",
      "COD",
      "CD",
      "RD Congo",
      "DR Congo",
      "República Democrática del Congo"
    ]
  },
  {
    "id": "grecia",
    "name": "Grecia",
    "short": "GRE",
    "flag": "🇬🇷",
    "color": "#60A5FA",
    "aliases": [
      "Greece",
      "Grecia",
      "GRE",
      "GR",
      "Hellenic Republic"
    ]
  },
  {
    "id": "eslovaquia",
    "name": "Eslovaquia",
    "short": "SVK",
    "flag": "🇸🇰",
    "color": "#800020",
    "aliases": [
      "Slovakia",
      "Eslovaquia",
      "SVK",
      "SK",
      "Slovak Republic"
    ]
  },
  {
    "id": "venezuela",
    "name": "Venezuela",
    "short": "VEN",
    "flag": "🇻🇪",
    "color": "#74C0FC",
    "aliases": [
      "Venezuela, Bolivarian Republic of",
      "Venezuela",
      "VEN",
      "VE",
      "Bolivarian Republic of Venezuela"
    ]
  },
  {
    "id": "uzbekistan",
    "name": "Uzbekistán",
    "short": "UZB",
    "flag": "🇺🇿",
    "color": "#D4AF37",
    "aliases": [
      "Uzbekistan",
      "Uzbekistán",
      "UZB",
      "UZ",
      "Republic of Uzbekistan"
    ]
  },
  {
    "id": "reino-unido-3",
    "name": "Reino Unido",
    "short": "SCO",
    "flag": "🏴",
    "color": "#60A5FA",
    "aliases": [
      "Scotland",
      "Reino Unido",
      "SCO",
      "GB",
      "Escocia"
    ]
  },
  {
    "id": "reino-unido-4",
    "name": "Reino Unido",
    "short": "WAL",
    "flag": "🏴",
    "color": "#60A5FA",
    "aliases": [
      "Wales",
      "Reino Unido",
      "WAL",
      "GB",
      "Gales"
    ]
  },
  {
    "id": "reino-unido-5",
    "name": "Reino Unido",
    "short": "NIR",
    "flag": "🇬🇧",
    "color": "#60A5FA",
    "aliases": [
      "Northern Ireland",
      "Reino Unido",
      "NIR",
      "GB",
      "Irlanda del Norte"
    ]
  },
  {
    "id": "kosovo",
    "name": "Kosovo",
    "short": "KOS",
    "flag": "🇽🇰",
    "color": "#800020",
    "aliases": [
      "Kosovo",
      "KOS",
      "XK",
      "Kosova"
    ]
  },
  {
    "id": "taiwan",
    "name": "Taiwán",
    "short": "TPE",
    "flag": "🇹🇼",
    "color": "#10B981",
    "aliases": [
      "Chinese Taipei",
      "Taiwán",
      "TPE",
      "TW",
      "Taiwan",
      "China Taipei"
    ]
  },
  {
    "id": "polinesia-francesa",
    "name": "Polinesia Francesa",
    "short": "TAH",
    "flag": "🇵🇫",
    "color": "#F472B6",
    "aliases": [
      "Tahiti",
      "Polinesia Francesa",
      "TAH",
      "PF",
      "Tahití",
      "French Polynesia"
    ]
  },
  {
    "id": "afganistan",
    "name": "Afganistán",
    "short": "AFG",
    "flag": "🇦🇫",
    "color": "#D4AF37",
    "aliases": [
      "Afghanistan",
      "Afganistán",
      "AFG",
      "AF",
      "Islamic Republic of Afghanistan"
    ]
  },
  {
    "id": "albania",
    "name": "Albania",
    "short": "ALB",
    "flag": "🇦🇱",
    "color": "#F472B6",
    "aliases": [
      "Albania",
      "ALB",
      "AL",
      "Republic of Albania"
    ]
  },
  {
    "id": "andorra",
    "name": "Andorra",
    "short": "AND",
    "flag": "🇦🇩",
    "color": "#DC2626",
    "aliases": [
      "Andorra",
      "AND",
      "AD",
      "Principality of Andorra"
    ]
  },
  {
    "id": "angola",
    "name": "Angola",
    "short": "ANG",
    "flag": "🇦🇴",
    "color": "#22C55E",
    "aliases": [
      "Angola",
      "ANG",
      "AO",
      "Republic of Angola"
    ]
  },
  {
    "id": "anguila",
    "name": "Anguila",
    "short": "AIA",
    "flag": "🇦🇮",
    "color": "#FB923C",
    "aliases": [
      "Anguilla",
      "Anguila",
      "AIA",
      "AI"
    ]
  },
  {
    "id": "antigua-y-barbuda",
    "name": "Antigua y Barbuda",
    "short": "ATG",
    "flag": "🇦🇬",
    "color": "#7DD3FC",
    "aliases": [
      "Antigua and Barbuda",
      "Antigua y Barbuda",
      "ATG",
      "AG"
    ]
  },
  {
    "id": "arabia-saudita",
    "name": "Arabia Saudita",
    "short": "KSA",
    "flag": "🇸🇦",
    "color": "#4D96FF",
    "aliases": [
      "Saudi Arabia",
      "Arabia Saudita",
      "KSA",
      "SA",
      "Kingdom of Saudi Arabia"
    ]
  },
  {
    "id": "armenia",
    "name": "Armenia",
    "short": "ARM",
    "flag": "🇦🇲",
    "color": "#F8FAFC",
    "aliases": [
      "Armenia",
      "ARM",
      "AM",
      "Republic of Armenia"
    ]
  },
  {
    "id": "aruba",
    "name": "Aruba",
    "short": "ARU",
    "flag": "🇦🇼",
    "color": "#FF6B6B",
    "aliases": [
      "Aruba",
      "ARU",
      "AW"
    ]
  },
  {
    "id": "azerbaiyan",
    "name": "Azerbaiyán",
    "short": "AZE",
    "flag": "🇦🇿",
    "color": "#FACC15",
    "aliases": [
      "Azerbaijan",
      "Azerbaiyán",
      "AZE",
      "AZ",
      "Republic of Azerbaijan"
    ]
  },
  {
    "id": "bahamas",
    "name": "Bahamas",
    "short": "BAH",
    "flag": "🇧🇸",
    "color": "#22C55E",
    "aliases": [
      "Bahamas",
      "BAH",
      "BS",
      "Commonwealth of the Bahamas"
    ]
  },
  {
    "id": "banglades",
    "name": "Bangladés",
    "short": "BAN",
    "flag": "🇧🇩",
    "color": "#74C0FC",
    "aliases": [
      "Bangladesh",
      "Bangladés",
      "BAN",
      "BD",
      "People's Republic of Bangladesh"
    ]
  },
  {
    "id": "barbados",
    "name": "Barbados",
    "short": "BRB",
    "flag": "🇧🇧",
    "color": "#74C0FC",
    "aliases": [
      "Barbados",
      "BRB",
      "BB"
    ]
  },
  {
    "id": "barein",
    "name": "Baréin",
    "short": "BHR",
    "flag": "🇧🇭",
    "color": "#800020",
    "aliases": [
      "Bahrain",
      "Baréin",
      "BHR",
      "BH",
      "Kingdom of Bahrain"
    ]
  },
  {
    "id": "belice",
    "name": "Belice",
    "short": "BLZ",
    "flag": "🇧🇿",
    "color": "#10B981",
    "aliases": [
      "Belize",
      "Belice",
      "BLZ",
      "BZ"
    ]
  },
  {
    "id": "benin",
    "name": "Benín",
    "short": "BEN",
    "flag": "🇧🇯",
    "color": "#10B981",
    "aliases": [
      "Benin",
      "Benín",
      "BEN",
      "BJ",
      "Republic of Benin"
    ]
  },
  {
    "id": "bermudas",
    "name": "Bermudas",
    "short": "BER",
    "flag": "🇧🇲",
    "color": "#60A5FA",
    "aliases": [
      "Bermuda",
      "Bermudas",
      "BER",
      "BM"
    ]
  },
  {
    "id": "bielorrusia",
    "name": "Bielorrusia",
    "short": "BLR",
    "flag": "🇧🇾",
    "color": "#22C55E",
    "aliases": [
      "Belarus",
      "Bielorrusia",
      "BLR",
      "BY",
      "Republic of Belarus"
    ]
  },
  {
    "id": "bolivia",
    "name": "Bolivia",
    "short": "BOL",
    "flag": "🇧🇴",
    "color": "#D4AF37",
    "aliases": [
      "Bolivia, Plurinational State of",
      "Bolivia",
      "BOL",
      "BO",
      "Plurinational State of Bolivia"
    ]
  },
  {
    "id": "bosnia-y-herzegovina",
    "name": "Bosnia y Herzegovina",
    "short": "BIH",
    "flag": "🇧🇦",
    "color": "#F472B6",
    "aliases": [
      "Bosnia and Herzegovina",
      "Bosnia y Herzegovina",
      "BIH",
      "BA",
      "Republic of Bosnia and Herzegovina"
    ]
  },
  {
    "id": "botsuana",
    "name": "Botsuana",
    "short": "BOT",
    "flag": "🇧🇼",
    "color": "#F472B6",
    "aliases": [
      "Botswana",
      "Botsuana",
      "BOT",
      "BW",
      "Republic of Botswana"
    ]
  },
  {
    "id": "brunei",
    "name": "Brunéi",
    "short": "BRU",
    "flag": "🇧🇳",
    "color": "#FB923C",
    "aliases": [
      "Brunei Darussalam",
      "Brunéi",
      "BRU",
      "BN"
    ]
  },
  {
    "id": "bulgaria",
    "name": "Bulgaria",
    "short": "BGR",
    "flag": "🇧🇬",
    "color": "#60A5FA",
    "aliases": [
      "Bulgaria",
      "BGR",
      "BG",
      "Republic of Bulgaria"
    ]
  },
  {
    "id": "burkina-faso",
    "name": "Burkina Faso",
    "short": "BFA",
    "flag": "🇧🇫",
    "color": "#FB923C",
    "aliases": [
      "Burkina Faso",
      "BFA",
      "BF"
    ]
  },
  {
    "id": "burundi",
    "name": "Burundi",
    "short": "BDI",
    "flag": "🇧🇮",
    "color": "#10B981",
    "aliases": [
      "Burundi",
      "BDI",
      "BI",
      "Republic of Burundi"
    ]
  },
  {
    "id": "butan",
    "name": "Bután",
    "short": "BHU",
    "flag": "🇧🇹",
    "color": "#4D96FF",
    "aliases": [
      "Bhutan",
      "Bután",
      "BHU",
      "BT",
      "Kingdom of Bhutan"
    ]
  },
  {
    "id": "cabo-verde",
    "name": "Cabo Verde",
    "short": "CPV",
    "flag": "🇨🇻",
    "color": "#FACC15",
    "aliases": [
      "Cabo Verde",
      "CPV",
      "CV",
      "Republic of Cabo Verde",
      "Cape Verde"
    ]
  },
  {
    "id": "camboya",
    "name": "Camboya",
    "short": "CAM",
    "flag": "🇰🇭",
    "color": "#D4AF37",
    "aliases": [
      "Cambodia",
      "Camboya",
      "CAM",
      "KH",
      "Kingdom of Cambodia"
    ]
  },
  {
    "id": "caribe-neerlandes",
    "name": "Caribe neerlandés",
    "short": "BES",
    "flag": "🇧🇶",
    "color": "#74C0FC",
    "aliases": [
      "Bonaire, Sint Eustatius and Saba",
      "Caribe neerlandés",
      "BES",
      "BQ"
    ]
  },
  {
    "id": "catar",
    "name": "Catar",
    "short": "QAT",
    "flag": "🇶🇦",
    "color": "#EF4444",
    "aliases": [
      "Qatar",
      "Catar",
      "QAT",
      "QA",
      "State of Qatar"
    ]
  },
  {
    "id": "chad",
    "name": "Chad",
    "short": "CHA",
    "flag": "🇹🇩",
    "color": "#800020",
    "aliases": [
      "Chad",
      "CHA",
      "TD",
      "Republic of Chad"
    ]
  },
  {
    "id": "chile",
    "name": "Chile",
    "short": "CHI",
    "flag": "🇨🇱",
    "color": "#800020",
    "aliases": [
      "Chile",
      "CHI",
      "CL",
      "Republic of Chile"
    ]
  },
  {
    "id": "china",
    "name": "China",
    "short": "CHN",
    "flag": "🇨🇳",
    "color": "#10B981",
    "aliases": [
      "China",
      "CHN",
      "CN",
      "People's Republic of China"
    ]
  },
  {
    "id": "chipre",
    "name": "Chipre",
    "short": "CYP",
    "flag": "🇨🇾",
    "color": "#2DD36F",
    "aliases": [
      "Cyprus",
      "Chipre",
      "CYP",
      "CY",
      "Republic of Cyprus"
    ]
  },
  {
    "id": "ciudad-del-vaticano",
    "name": "Ciudad del Vaticano",
    "short": "VAT",
    "flag": "🇻🇦",
    "color": "#60A5FA",
    "aliases": [
      "Holy See (Vatican City State)",
      "Ciudad del Vaticano",
      "VAT",
      "VA"
    ]
  },
  {
    "id": "comoras",
    "name": "Comoras",
    "short": "COM",
    "flag": "🇰🇲",
    "color": "#7DD3FC",
    "aliases": [
      "Comoros",
      "Comoras",
      "COM",
      "KM",
      "Union of the Comoros"
    ]
  },
  {
    "id": "congo",
    "name": "Congo",
    "short": "CGO",
    "flag": "🇨🇬",
    "color": "#FF6B6B",
    "aliases": [
      "Congo",
      "CGO",
      "CG",
      "Republic of the Congo",
      "República del Congo"
    ]
  },
  {
    "id": "corea-del-norte",
    "name": "Corea del Norte",
    "short": "PRK",
    "flag": "🇰🇵",
    "color": "#FF6B6B",
    "aliases": [
      "Korea, Democratic People's Republic of",
      "Corea del Norte",
      "PRK",
      "KP",
      "Democratic People's Republic of Korea",
      "North Korea"
    ]
  },
  {
    "id": "costa-rica",
    "name": "Costa Rica",
    "short": "CRC",
    "flag": "🇨🇷",
    "color": "#60A5FA",
    "aliases": [
      "Costa Rica",
      "CRC",
      "CR",
      "Republic of Costa Rica"
    ]
  },
  {
    "id": "cuba",
    "name": "Cuba",
    "short": "CUB",
    "flag": "🇨🇺",
    "color": "#FB923C",
    "aliases": [
      "Cuba",
      "CUB",
      "CU",
      "Republic of Cuba"
    ]
  },
  {
    "id": "curazao",
    "name": "Curazao",
    "short": "CUW",
    "flag": "🇨🇼",
    "color": "#FB923C",
    "aliases": [
      "Curaçao",
      "Curazao",
      "CUW",
      "CW",
      "Curacao"
    ]
  },
  {
    "id": "dominica",
    "name": "Dominica",
    "short": "DMA",
    "flag": "🇩🇲",
    "color": "#EF4444",
    "aliases": [
      "Dominica",
      "DMA",
      "DM",
      "Commonwealth of Dominica"
    ]
  },
  {
    "id": "el-salvador",
    "name": "El Salvador",
    "short": "SLV",
    "flag": "🇸🇻",
    "color": "#74C0FC",
    "aliases": [
      "El Salvador",
      "SLV",
      "SV",
      "Republic of El Salvador"
    ]
  },
  {
    "id": "emiratos-arabes-unidos",
    "name": "Emiratos Árabes Unidos",
    "short": "UAE",
    "flag": "🇦🇪",
    "color": "#FF6B6B",
    "aliases": [
      "United Arab Emirates",
      "Emiratos Árabes Unidos",
      "UAE",
      "AE",
      "Emiratos Arabes Unidos"
    ]
  },
  {
    "id": "eritrea",
    "name": "Eritrea",
    "short": "ERI",
    "flag": "🇪🇷",
    "color": "#800020",
    "aliases": [
      "Eritrea",
      "ERI",
      "ER",
      "the State of Eritrea"
    ]
  },
  {
    "id": "eslovenia",
    "name": "Eslovenia",
    "short": "SVN",
    "flag": "🇸🇮",
    "color": "#800020",
    "aliases": [
      "Slovenia",
      "Eslovenia",
      "SVN",
      "SI",
      "Republic of Slovenia"
    ]
  },
  {
    "id": "estonia",
    "name": "Estonia",
    "short": "EST",
    "flag": "🇪🇪",
    "color": "#4D96FF",
    "aliases": [
      "Estonia",
      "EST",
      "EE",
      "Republic of Estonia"
    ]
  },
  {
    "id": "esuatini",
    "name": "Esuatini",
    "short": "SWZ",
    "flag": "🇸🇿",
    "color": "#10B981",
    "aliases": [
      "Eswatini",
      "Esuatini",
      "SWZ",
      "SZ",
      "Kingdom of Eswatini"
    ]
  },
  {
    "id": "etiopia",
    "name": "Etiopía",
    "short": "ETH",
    "flag": "🇪🇹",
    "color": "#7DD3FC",
    "aliases": [
      "Ethiopia",
      "Etiopía",
      "ETH",
      "ET",
      "Federal Democratic Republic of Ethiopia"
    ]
  },
  {
    "id": "filipinas",
    "name": "Filipinas",
    "short": "PHI",
    "flag": "🇵🇭",
    "color": "#D4AF37",
    "aliases": [
      "Philippines",
      "Filipinas",
      "PHI",
      "PH",
      "Republic of the Philippines"
    ]
  },
  {
    "id": "finlandia",
    "name": "Finlandia",
    "short": "FIN",
    "flag": "🇫🇮",
    "color": "#60A5FA",
    "aliases": [
      "Finland",
      "Finlandia",
      "FIN",
      "FI",
      "Republic of Finland"
    ]
  },
  {
    "id": "fiyi",
    "name": "Fiyi",
    "short": "FIJ",
    "flag": "🇫🇯",
    "color": "#F472B6",
    "aliases": [
      "Fiji",
      "Fiyi",
      "FIJ",
      "FJ",
      "Republic of Fiji"
    ]
  },
  {
    "id": "gabon",
    "name": "Gabón",
    "short": "GAB",
    "flag": "🇬🇦",
    "color": "#FB923C",
    "aliases": [
      "Gabon",
      "Gabón",
      "GAB",
      "GA",
      "Gabonese Republic"
    ]
  },
  {
    "id": "gambia",
    "name": "Gambia",
    "short": "GAM",
    "flag": "🇬🇲",
    "color": "#F472B6",
    "aliases": [
      "Gambia",
      "GAM",
      "GM",
      "Republic of the Gambia"
    ]
  },
  {
    "id": "georgia",
    "name": "Georgia",
    "short": "GEO",
    "flag": "🇬🇪",
    "color": "#7DD3FC",
    "aliases": [
      "Georgia",
      "GEO",
      "GE"
    ]
  },
  {
    "id": "ghana",
    "name": "Ghana",
    "short": "GHA",
    "flag": "🇬🇭",
    "color": "#FB923C",
    "aliases": [
      "Ghana",
      "GHA",
      "GH",
      "Republic of Ghana"
    ]
  },
  {
    "id": "gibraltar",
    "name": "Gibraltar",
    "short": "GIB",
    "flag": "🇬🇮",
    "color": "#FB923C",
    "aliases": [
      "Gibraltar",
      "GIB",
      "GI"
    ]
  },
  {
    "id": "granada",
    "name": "Granada",
    "short": "GRN",
    "flag": "🇬🇩",
    "color": "#74C0FC",
    "aliases": [
      "Grenada",
      "Granada",
      "GRN",
      "GD"
    ]
  },
  {
    "id": "groenlandia",
    "name": "Groenlandia",
    "short": "GRL",
    "flag": "🇬🇱",
    "color": "#4D96FF",
    "aliases": [
      "Greenland",
      "Groenlandia",
      "GRL",
      "GL"
    ]
  },
  {
    "id": "guadalupe",
    "name": "Guadalupe",
    "short": "GLP",
    "flag": "🇬🇵",
    "color": "#D4AF37",
    "aliases": [
      "Guadeloupe",
      "Guadalupe",
      "GLP",
      "GP"
    ]
  },
  {
    "id": "guam",
    "name": "Guam",
    "short": "GUM",
    "flag": "🇬🇺",
    "color": "#10B981",
    "aliases": [
      "Guam",
      "GUM",
      "GU"
    ]
  },
  {
    "id": "guatemala",
    "name": "Guatemala",
    "short": "GUA",
    "flag": "🇬🇹",
    "color": "#D4AF37",
    "aliases": [
      "Guatemala",
      "GUA",
      "GT",
      "Republic of Guatemala"
    ]
  },
  {
    "id": "guayana-francesa",
    "name": "Guayana Francesa",
    "short": "GUF",
    "flag": "🇬🇫",
    "color": "#EF4444",
    "aliases": [
      "French Guiana",
      "Guayana Francesa",
      "GUF",
      "GF"
    ]
  },
  {
    "id": "guernesey",
    "name": "Guernesey",
    "short": "GGY",
    "flag": "🇬🇬",
    "color": "#D4AF37",
    "aliases": [
      "Guernsey",
      "Guernesey",
      "GGY",
      "GG"
    ]
  },
  {
    "id": "guinea",
    "name": "Guinea",
    "short": "GUI",
    "flag": "🇬🇳",
    "color": "#74C0FC",
    "aliases": [
      "Guinea",
      "GUI",
      "GN",
      "Republic of Guinea"
    ]
  },
  {
    "id": "guinea-ecuatorial",
    "name": "Guinea Ecuatorial",
    "short": "EQG",
    "flag": "🇬🇶",
    "color": "#DC2626",
    "aliases": [
      "Equatorial Guinea",
      "Guinea Ecuatorial",
      "EQG",
      "GQ",
      "Republic of Equatorial Guinea"
    ]
  },
  {
    "id": "guinea-bisau",
    "name": "Guinea-Bisáu",
    "short": "GNB",
    "flag": "🇬🇼",
    "color": "#74C0FC",
    "aliases": [
      "Guinea-Bissau",
      "Guinea-Bisáu",
      "GNB",
      "GW",
      "Republic of Guinea-Bissau"
    ]
  },
  {
    "id": "guyana",
    "name": "Guyana",
    "short": "GUY",
    "flag": "🇬🇾",
    "color": "#FF6B6B",
    "aliases": [
      "Guyana",
      "GUY",
      "GY",
      "Republic of Guyana"
    ]
  },
  {
    "id": "haiti",
    "name": "Haití",
    "short": "HAI",
    "flag": "🇭🇹",
    "color": "#2DD36F",
    "aliases": [
      "Haiti",
      "Haití",
      "HAI",
      "HT",
      "Republic of Haiti"
    ]
  },
  {
    "id": "honduras",
    "name": "Honduras",
    "short": "HON",
    "flag": "🇭🇳",
    "color": "#D4AF37",
    "aliases": [
      "Honduras",
      "HON",
      "HN",
      "Republic of Honduras"
    ]
  },
  {
    "id": "india",
    "name": "India",
    "short": "IND",
    "flag": "🇮🇳",
    "color": "#60A5FA",
    "aliases": [
      "India",
      "IND",
      "IN",
      "Republic of India"
    ]
  },
  {
    "id": "indonesia",
    "name": "Indonesia",
    "short": "IDN",
    "flag": "🇮🇩",
    "color": "#FB923C",
    "aliases": [
      "Indonesia",
      "IDN",
      "ID",
      "Republic of Indonesia"
    ]
  },
  {
    "id": "irak",
    "name": "Irak",
    "short": "IRQ",
    "flag": "🇮🇶",
    "color": "#800020",
    "aliases": [
      "Iraq",
      "Irak",
      "IRQ",
      "IQ",
      "Republic of Iraq"
    ]
  },
  {
    "id": "irlanda",
    "name": "Irlanda",
    "short": "IRL",
    "flag": "🇮🇪",
    "color": "#FB923C",
    "aliases": [
      "Ireland",
      "Irlanda",
      "IRL",
      "IE"
    ]
  },
  {
    "id": "isla-bouvet",
    "name": "Isla Bouvet",
    "short": "BVT",
    "flag": "🇧🇻",
    "color": "#4D96FF",
    "aliases": [
      "Bouvet Island",
      "Isla Bouvet",
      "BVT",
      "BV"
    ]
  },
  {
    "id": "isla-norfolk",
    "name": "Isla Norfolk",
    "short": "NFK",
    "flag": "🇳🇫",
    "color": "#DC2626",
    "aliases": [
      "Norfolk Island",
      "Isla Norfolk",
      "NFK",
      "NF"
    ]
  },
  {
    "id": "isla-de-man",
    "name": "Isla de Man",
    "short": "IMN",
    "flag": "🇮🇲",
    "color": "#F472B6",
    "aliases": [
      "Isle of Man",
      "Isla de Man",
      "IMN",
      "IM"
    ]
  },
  {
    "id": "isla-de-navidad",
    "name": "Isla de Navidad",
    "short": "CXR",
    "flag": "🇨🇽",
    "color": "#22C55E",
    "aliases": [
      "Christmas Island",
      "Isla de Navidad",
      "CXR",
      "CX"
    ]
  },
  {
    "id": "islandia",
    "name": "Islandia",
    "short": "ISL",
    "flag": "🇮🇸",
    "color": "#4D96FF",
    "aliases": [
      "Iceland",
      "Islandia",
      "ISL",
      "IS",
      "Republic of Iceland"
    ]
  },
  {
    "id": "islas-aland",
    "name": "Islas Aland",
    "short": "ALA",
    "flag": "🇦🇽",
    "color": "#FACC15",
    "aliases": [
      "Åland Islands",
      "Islas Aland",
      "ALA",
      "AX"
    ]
  },
  {
    "id": "islas-caiman",
    "name": "Islas Caimán",
    "short": "CAY",
    "flag": "🇰🇾",
    "color": "#DC2626",
    "aliases": [
      "Cayman Islands",
      "Islas Caimán",
      "CAY",
      "KY"
    ]
  },
  {
    "id": "islas-cocos",
    "name": "Islas Cocos",
    "short": "CCK",
    "flag": "🇨🇨",
    "color": "#FACC15",
    "aliases": [
      "Cocos (Keeling) Islands",
      "Islas Cocos",
      "CCK",
      "CC"
    ]
  },
  {
    "id": "islas-cook",
    "name": "Islas Cook",
    "short": "COK",
    "flag": "🇨🇰",
    "color": "#FB923C",
    "aliases": [
      "Cook Islands",
      "Islas Cook",
      "COK",
      "CK"
    ]
  },
  {
    "id": "islas-feroe",
    "name": "Islas Feroe",
    "short": "FRO",
    "flag": "🇫🇴",
    "color": "#10B981",
    "aliases": [
      "Faroe Islands",
      "Islas Feroe",
      "FRO",
      "FO"
    ]
  },
  {
    "id": "islas-georgia-del-sur-y-sandwich-del-sur",
    "name": "Islas Georgia del Sur y Sandwich del Sur",
    "short": "SGS",
    "flag": "🇬🇸",
    "color": "#2DD36F",
    "aliases": [
      "South Georgia and the South Sandwich Islands",
      "Islas Georgia del Sur y Sandwich del Sur",
      "SGS",
      "GS"
    ]
  },
  {
    "id": "islas-heard-y-mcdonald",
    "name": "Islas Heard y McDonald",
    "short": "HMD",
    "flag": "🇭🇲",
    "color": "#22C55E",
    "aliases": [
      "Heard Island and McDonald Islands",
      "Islas Heard y McDonald",
      "HMD",
      "HM"
    ]
  },
  {
    "id": "islas-malvinas",
    "name": "Islas Malvinas",
    "short": "FLK",
    "flag": "🇫🇰",
    "color": "#4D96FF",
    "aliases": [
      "Falkland Islands (Malvinas)",
      "Islas Malvinas",
      "FLK",
      "FK"
    ]
  },
  {
    "id": "islas-marianas-del-norte",
    "name": "Islas Marianas del Norte",
    "short": "MNP",
    "flag": "🇲🇵",
    "color": "#FACC15",
    "aliases": [
      "Northern Mariana Islands",
      "Islas Marianas del Norte",
      "MNP",
      "MP",
      "Commonwealth of the Northern Mariana Islands"
    ]
  },
  {
    "id": "islas-marshall",
    "name": "Islas Marshall",
    "short": "MHL",
    "flag": "🇲🇭",
    "color": "#4D96FF",
    "aliases": [
      "Marshall Islands",
      "Islas Marshall",
      "MHL",
      "MH",
      "Republic of the Marshall Islands"
    ]
  },
  {
    "id": "islas-pitcairn",
    "name": "Islas Pitcairn",
    "short": "PCN",
    "flag": "🇵🇳",
    "color": "#F8FAFC",
    "aliases": [
      "Pitcairn",
      "Islas Pitcairn",
      "PCN",
      "PN"
    ]
  },
  {
    "id": "islas-salomon",
    "name": "Islas Salomón",
    "short": "SOL",
    "flag": "🇸🇧",
    "color": "#FF6B6B",
    "aliases": [
      "Solomon Islands",
      "Islas Salomón",
      "SOL",
      "SB"
    ]
  },
  {
    "id": "islas-turcas-y-caicos",
    "name": "Islas Turcas y Caicos",
    "short": "TCA",
    "flag": "🇹🇨",
    "color": "#4D96FF",
    "aliases": [
      "Turks and Caicos Islands",
      "Islas Turcas y Caicos",
      "TCA",
      "TC"
    ]
  },
  {
    "id": "islas-virgenes-britanicas",
    "name": "Islas Vírgenes Británicas",
    "short": "VGB",
    "flag": "🇻🇬",
    "color": "#DC2626",
    "aliases": [
      "Virgin Islands, British",
      "Islas Vírgenes Británicas",
      "VGB",
      "VG",
      "British Virgin Islands"
    ]
  },
  {
    "id": "islas-virgenes-estadounidenses",
    "name": "Islas Vírgenes Estadounidenses",
    "short": "VIR",
    "flag": "🇻🇮",
    "color": "#D4AF37",
    "aliases": [
      "Virgin Islands, U.S.",
      "Islas Vírgenes Estadounidenses",
      "VIR",
      "VI",
      "Virgin Islands of the United States"
    ]
  },
  {
    "id": "islas-menores-alejadas-de-ee-uu",
    "name": "Islas menores alejadas de EE. UU.",
    "short": "UMI",
    "flag": "🇺🇲",
    "color": "#60A5FA",
    "aliases": [
      "United States Minor Outlying Islands",
      "Islas menores alejadas de EE. UU.",
      "UMI",
      "UM"
    ]
  },
  {
    "id": "israel",
    "name": "Israel",
    "short": "ISR",
    "flag": "🇮🇱",
    "color": "#800020",
    "aliases": [
      "Israel",
      "ISR",
      "IL",
      "State of Israel"
    ]
  },
  {
    "id": "jamaica",
    "name": "Jamaica",
    "short": "JAM",
    "flag": "🇯🇲",
    "color": "#FB923C",
    "aliases": [
      "Jamaica",
      "JAM",
      "JM"
    ]
  },
  {
    "id": "jersey",
    "name": "Jersey",
    "short": "JEY",
    "flag": "🇯🇪",
    "color": "#F472B6",
    "aliases": [
      "Jersey",
      "JEY",
      "JE"
    ]
  },
  {
    "id": "jordania",
    "name": "Jordania",
    "short": "JOR",
    "flag": "🇯🇴",
    "color": "#FB923C",
    "aliases": [
      "Jordan",
      "Jordania",
      "JOR",
      "JO",
      "Hashemite Kingdom of Jordan"
    ]
  },
  {
    "id": "kazajistan",
    "name": "Kazajistán",
    "short": "KAZ",
    "flag": "🇰🇿",
    "color": "#800020",
    "aliases": [
      "Kazakhstan",
      "Kazajistán",
      "KAZ",
      "KZ",
      "Republic of Kazakhstan"
    ]
  },
  {
    "id": "kenia",
    "name": "Kenia",
    "short": "KEN",
    "flag": "🇰🇪",
    "color": "#F8FAFC",
    "aliases": [
      "Kenya",
      "Kenia",
      "KEN",
      "KE",
      "Republic of Kenya"
    ]
  },
  {
    "id": "kirguistan",
    "name": "Kirguistán",
    "short": "KGZ",
    "flag": "🇰🇬",
    "color": "#60A5FA",
    "aliases": [
      "Kyrgyzstan",
      "Kirguistán",
      "KGZ",
      "KG",
      "Kyrgyz Republic"
    ]
  },
  {
    "id": "kiribati",
    "name": "Kiribati",
    "short": "KIR",
    "flag": "🇰🇮",
    "color": "#4D96FF",
    "aliases": [
      "Kiribati",
      "KIR",
      "KI",
      "Republic of Kiribati"
    ]
  },
  {
    "id": "kuwait",
    "name": "Kuwait",
    "short": "KUW",
    "flag": "🇰🇼",
    "color": "#800020",
    "aliases": [
      "Kuwait",
      "KUW",
      "KW",
      "State of Kuwait"
    ]
  },
  {
    "id": "laos",
    "name": "Laos",
    "short": "LAO",
    "flag": "🇱🇦",
    "color": "#800020",
    "aliases": [
      "Lao People's Democratic Republic",
      "Laos",
      "LAO",
      "LA"
    ]
  },
  {
    "id": "lesoto",
    "name": "Lesoto",
    "short": "LSO",
    "flag": "🇱🇸",
    "color": "#10B981",
    "aliases": [
      "Lesotho",
      "Lesoto",
      "LSO",
      "LS",
      "Kingdom of Lesotho"
    ]
  },
  {
    "id": "letonia",
    "name": "Letonia",
    "short": "LVA",
    "flag": "🇱🇻",
    "color": "#22C55E",
    "aliases": [
      "Latvia",
      "Letonia",
      "LVA",
      "LV",
      "Republic of Latvia"
    ]
  },
  {
    "id": "liberia",
    "name": "Liberia",
    "short": "LBR",
    "flag": "🇱🇷",
    "color": "#FF6B6B",
    "aliases": [
      "Liberia",
      "LBR",
      "LR",
      "Republic of Liberia"
    ]
  },
  {
    "id": "libia",
    "name": "Libia",
    "short": "LBY",
    "flag": "🇱🇾",
    "color": "#60A5FA",
    "aliases": [
      "Libya",
      "Libia",
      "LBY",
      "LY"
    ]
  },
  {
    "id": "liechtenstein",
    "name": "Liechtenstein",
    "short": "LIE",
    "flag": "🇱🇮",
    "color": "#D4AF37",
    "aliases": [
      "Liechtenstein",
      "LIE",
      "LI",
      "Principality of Liechtenstein"
    ]
  },
  {
    "id": "lituania",
    "name": "Lituania",
    "short": "LTU",
    "flag": "🇱🇹",
    "color": "#800020",
    "aliases": [
      "Lithuania",
      "Lituania",
      "LTU",
      "LT",
      "Republic of Lithuania"
    ]
  },
  {
    "id": "luxemburgo",
    "name": "Luxemburgo",
    "short": "LUX",
    "flag": "🇱🇺",
    "color": "#DC2626",
    "aliases": [
      "Luxembourg",
      "Luxemburgo",
      "LUX",
      "LU",
      "Grand Duchy of Luxembourg"
    ]
  },
  {
    "id": "libano",
    "name": "Líbano",
    "short": "LBN",
    "flag": "🇱🇧",
    "color": "#D4AF37",
    "aliases": [
      "Lebanon",
      "Líbano",
      "LBN",
      "LB",
      "Lebanese Republic"
    ]
  },
  {
    "id": "macedonia-del-norte",
    "name": "Macedonia del Norte",
    "short": "MKD",
    "flag": "🇲🇰",
    "color": "#4D96FF",
    "aliases": [
      "North Macedonia",
      "Macedonia del Norte",
      "MKD",
      "MK",
      "Republic of North Macedonia"
    ]
  },
  {
    "id": "madagascar",
    "name": "Madagascar",
    "short": "MAD",
    "flag": "🇲🇬",
    "color": "#EF4444",
    "aliases": [
      "Madagascar",
      "MAD",
      "MG",
      "Republic of Madagascar"
    ]
  },
  {
    "id": "malasia",
    "name": "Malasia",
    "short": "MAS",
    "flag": "🇲🇾",
    "color": "#EF4444",
    "aliases": [
      "Malaysia",
      "Malasia",
      "MAS",
      "MY"
    ]
  },
  {
    "id": "malaui",
    "name": "Malaui",
    "short": "MWI",
    "flag": "🇲🇼",
    "color": "#FB923C",
    "aliases": [
      "Malawi",
      "Malaui",
      "MWI",
      "MW",
      "Republic of Malawi"
    ]
  },
  {
    "id": "maldivas",
    "name": "Maldivas",
    "short": "MDV",
    "flag": "🇲🇻",
    "color": "#74C0FC",
    "aliases": [
      "Maldives",
      "Maldivas",
      "MDV",
      "MV",
      "Republic of Maldives"
    ]
  },
  {
    "id": "mali",
    "name": "Malí",
    "short": "MLI",
    "flag": "🇲🇱",
    "color": "#2DD36F",
    "aliases": [
      "Mali",
      "Malí",
      "MLI",
      "ML",
      "Republic of Mali"
    ]
  },
  {
    "id": "malta",
    "name": "Malta",
    "short": "MLT",
    "flag": "🇲🇹",
    "color": "#7DD3FC",
    "aliases": [
      "Malta",
      "MLT",
      "MT",
      "Republic of Malta"
    ]
  },
  {
    "id": "martinica",
    "name": "Martinica",
    "short": "MTQ",
    "flag": "🇲🇶",
    "color": "#FACC15",
    "aliases": [
      "Martinique",
      "Martinica",
      "MTQ",
      "MQ"
    ]
  },
  {
    "id": "mauricio",
    "name": "Mauricio",
    "short": "MRI",
    "flag": "🇲🇺",
    "color": "#D4AF37",
    "aliases": [
      "Mauritius",
      "Mauricio",
      "MRI",
      "MU",
      "Republic of Mauritius"
    ]
  },
  {
    "id": "mauritania",
    "name": "Mauritania",
    "short": "MTN",
    "flag": "🇲🇷",
    "color": "#F8FAFC",
    "aliases": [
      "Mauritania",
      "MTN",
      "MR",
      "Islamic Republic of Mauritania"
    ]
  },
  {
    "id": "mayotte",
    "name": "Mayotte",
    "short": "MYT",
    "flag": "🇾🇹",
    "color": "#2DD36F",
    "aliases": [
      "Mayotte",
      "MYT",
      "YT"
    ]
  },
  {
    "id": "micronesia",
    "name": "Micronesia",
    "short": "FSM",
    "flag": "🇫🇲",
    "color": "#EF4444",
    "aliases": [
      "Micronesia, Federated States of",
      "Micronesia",
      "FSM",
      "FM",
      "Federated States of Micronesia"
    ]
  },
  {
    "id": "moldavia",
    "name": "Moldavia",
    "short": "MDA",
    "flag": "🇲🇩",
    "color": "#22C55E",
    "aliases": [
      "Moldova, Republic of",
      "Moldavia",
      "MDA",
      "MD",
      "Republic of Moldova"
    ]
  },
  {
    "id": "mongolia",
    "name": "Mongolia",
    "short": "MNG",
    "flag": "🇲🇳",
    "color": "#10B981",
    "aliases": [
      "Mongolia",
      "MNG",
      "MN"
    ]
  },
  {
    "id": "montenegro",
    "name": "Montenegro",
    "short": "MNE",
    "flag": "🇲🇪",
    "color": "#2DD36F",
    "aliases": [
      "Montenegro",
      "MNE",
      "ME"
    ]
  },
  {
    "id": "montserrat",
    "name": "Montserrat",
    "short": "MSR",
    "flag": "🇲🇸",
    "color": "#FB923C",
    "aliases": [
      "Montserrat",
      "MSR",
      "MS"
    ]
  },
  {
    "id": "mozambique",
    "name": "Mozambique",
    "short": "MOZ",
    "flag": "🇲🇿",
    "color": "#2DD36F",
    "aliases": [
      "Mozambique",
      "MOZ",
      "MZ",
      "Republic of Mozambique"
    ]
  },
  {
    "id": "myanmar",
    "name": "Myanmar",
    "short": "MYA",
    "flag": "🇲🇲",
    "color": "#DC2626",
    "aliases": [
      "Myanmar",
      "MYA",
      "MM",
      "Republic of Myanmar"
    ]
  },
  {
    "id": "monaco",
    "name": "Mónaco",
    "short": "MON",
    "flag": "🇲🇨",
    "color": "#7DD3FC",
    "aliases": [
      "Monaco",
      "Mónaco",
      "MON",
      "MC",
      "Principality of Monaco"
    ]
  },
  {
    "id": "namibia",
    "name": "Namibia",
    "short": "NAM",
    "flag": "🇳🇦",
    "color": "#60A5FA",
    "aliases": [
      "Namibia",
      "NAM",
      "NA",
      "Republic of Namibia"
    ]
  },
  {
    "id": "nauru",
    "name": "Nauru",
    "short": "NRU",
    "flag": "🇳🇷",
    "color": "#F472B6",
    "aliases": [
      "Nauru",
      "NRU",
      "NR",
      "Republic of Nauru"
    ]
  },
  {
    "id": "nepal",
    "name": "Nepal",
    "short": "NEP",
    "flag": "🇳🇵",
    "color": "#FACC15",
    "aliases": [
      "Nepal",
      "NEP",
      "NP",
      "Federal Democratic Republic of Nepal"
    ]
  },
  {
    "id": "nicaragua",
    "name": "Nicaragua",
    "short": "NCA",
    "flag": "🇳🇮",
    "color": "#74C0FC",
    "aliases": [
      "Nicaragua",
      "NCA",
      "NI",
      "Republic of Nicaragua"
    ]
  },
  {
    "id": "niue",
    "name": "Niue",
    "short": "NIU",
    "flag": "🇳🇺",
    "color": "#F472B6",
    "aliases": [
      "Niue",
      "NIU",
      "NU"
    ]
  },
  {
    "id": "nueva-caledonia",
    "name": "Nueva Caledonia",
    "short": "NCL",
    "flag": "🇳🇨",
    "color": "#10B981",
    "aliases": [
      "New Caledonia",
      "Nueva Caledonia",
      "NCL",
      "NC"
    ]
  },
  {
    "id": "nueva-zelanda",
    "name": "Nueva Zelanda",
    "short": "NZL",
    "flag": "🇳🇿",
    "color": "#2DD36F",
    "aliases": [
      "New Zealand",
      "Nueva Zelanda",
      "NZL",
      "NZ"
    ]
  },
  {
    "id": "niger",
    "name": "Níger",
    "short": "NIG",
    "flag": "🇳🇪",
    "color": "#60A5FA",
    "aliases": [
      "Niger",
      "Níger",
      "NIG",
      "NE",
      "Republic of the Niger"
    ]
  },
  {
    "id": "oman",
    "name": "Omán",
    "short": "OMA",
    "flag": "🇴🇲",
    "color": "#10B981",
    "aliases": [
      "Oman",
      "Omán",
      "OMA",
      "OM",
      "Sultanate of Oman"
    ]
  },
  {
    "id": "pakistan",
    "name": "Pakistán",
    "short": "PAK",
    "flag": "🇵🇰",
    "color": "#FF6B6B",
    "aliases": [
      "Pakistan",
      "Pakistán",
      "PAK",
      "PK",
      "Islamic Republic of Pakistan"
    ]
  },
  {
    "id": "palaos",
    "name": "Palaos",
    "short": "PLW",
    "flag": "🇵🇼",
    "color": "#2DD36F",
    "aliases": [
      "Palau",
      "Palaos",
      "PLW",
      "PW",
      "Republic of Palau"
    ]
  },
  {
    "id": "papua-nueva-guinea",
    "name": "Papúa Nueva Guinea",
    "short": "PNG",
    "flag": "🇵🇬",
    "color": "#F8FAFC",
    "aliases": [
      "Papua New Guinea",
      "Papúa Nueva Guinea",
      "PNG",
      "PG",
      "Independent State of Papua New Guinea"
    ]
  },
  {
    "id": "peru",
    "name": "Perú",
    "short": "PER",
    "flag": "🇵🇪",
    "color": "#F472B6",
    "aliases": [
      "Peru",
      "Perú",
      "PER",
      "PE",
      "Republic of Peru"
    ]
  },
  {
    "id": "puerto-rico",
    "name": "Puerto Rico",
    "short": "PUR",
    "flag": "🇵🇷",
    "color": "#D4AF37",
    "aliases": [
      "Puerto Rico",
      "PUR",
      "PR"
    ]
  },
  {
    "id": "hong-kong",
    "name": "Hong Kong",
    "short": "HKG",
    "flag": "🇭🇰",
    "color": "#2DD36F",
    "aliases": [
      "Hong Kong",
      "HKG",
      "HK",
      "Hong Kong Special Administrative Region of China"
    ]
  },
  {
    "id": "macao",
    "name": "Macao",
    "short": "MAC",
    "flag": "🇲🇴",
    "color": "#4D96FF",
    "aliases": [
      "Macao",
      "MAC",
      "MO",
      "Macao Special Administrative Region of China"
    ]
  },
  {
    "id": "republica-centroafricana",
    "name": "República Centroafricana",
    "short": "CTA",
    "flag": "🇨🇫",
    "color": "#FB923C",
    "aliases": [
      "Central African Republic",
      "República Centroafricana",
      "CTA",
      "CF"
    ]
  },
  {
    "id": "republica-dominicana",
    "name": "República Dominicana",
    "short": "DOM",
    "flag": "🇩🇴",
    "color": "#F472B6",
    "aliases": [
      "Dominican Republic",
      "República Dominicana",
      "DOM",
      "DO"
    ]
  },
  {
    "id": "reunion",
    "name": "Reunión",
    "short": "REU",
    "flag": "🇷🇪",
    "color": "#800020",
    "aliases": [
      "Réunion",
      "Reunión",
      "REU",
      "RE"
    ]
  },
  {
    "id": "ruanda",
    "name": "Ruanda",
    "short": "RWA",
    "flag": "🇷🇼",
    "color": "#10B981",
    "aliases": [
      "Rwanda",
      "Ruanda",
      "RWA",
      "RW",
      "Rwandese Republic"
    ]
  },
  {
    "id": "rumania",
    "name": "Rumania",
    "short": "ROU",
    "flag": "🇷🇴",
    "color": "#800020",
    "aliases": [
      "Romania",
      "Rumania",
      "ROU",
      "RO"
    ]
  },
  {
    "id": "samoa",
    "name": "Samoa",
    "short": "SAM",
    "flag": "🇼🇸",
    "color": "#7DD3FC",
    "aliases": [
      "Samoa",
      "SAM",
      "WS",
      "Independent State of Samoa"
    ]
  },
  {
    "id": "samoa-americana",
    "name": "Samoa Americana",
    "short": "ASA",
    "flag": "🇦🇸",
    "color": "#22C55E",
    "aliases": [
      "American Samoa",
      "Samoa Americana",
      "ASA",
      "AS"
    ]
  },
  {
    "id": "san-bartolome",
    "name": "San Bartolomé",
    "short": "BLM",
    "flag": "🇧🇱",
    "color": "#D4AF37",
    "aliases": [
      "Saint Barthélemy",
      "San Bartolomé",
      "BLM",
      "BL"
    ]
  },
  {
    "id": "san-cristobal-y-nieves",
    "name": "San Cristóbal y Nieves",
    "short": "SKN",
    "flag": "🇰🇳",
    "color": "#60A5FA",
    "aliases": [
      "Saint Kitts and Nevis",
      "San Cristóbal y Nieves",
      "SKN",
      "KN"
    ]
  },
  {
    "id": "san-marino",
    "name": "San Marino",
    "short": "SMR",
    "flag": "🇸🇲",
    "color": "#FACC15",
    "aliases": [
      "San Marino",
      "SMR",
      "SM",
      "Republic of San Marino"
    ]
  },
  {
    "id": "san-martin",
    "name": "San Martín",
    "short": "MAF",
    "flag": "🇲🇫",
    "color": "#7DD3FC",
    "aliases": [
      "Saint Martin (French part)",
      "San Martín",
      "MAF",
      "MF"
    ]
  },
  {
    "id": "san-pedro-y-miquelon",
    "name": "San Pedro y Miquelón",
    "short": "SPM",
    "flag": "🇵🇲",
    "color": "#800020",
    "aliases": [
      "Saint Pierre and Miquelon",
      "San Pedro y Miquelón",
      "SPM",
      "PM"
    ]
  },
  {
    "id": "san-vicente-y-las-granadinas",
    "name": "San Vicente y las Granadinas",
    "short": "VIN",
    "flag": "🇻🇨",
    "color": "#22C55E",
    "aliases": [
      "Saint Vincent and the Grenadines",
      "San Vicente y las Granadinas",
      "VIN",
      "VC"
    ]
  },
  {
    "id": "santa-elena",
    "name": "Santa Elena",
    "short": "SHN",
    "flag": "🇸🇭",
    "color": "#74C0FC",
    "aliases": [
      "Saint Helena, Ascension and Tristan da Cunha",
      "Santa Elena",
      "SHN",
      "SH"
    ]
  },
  {
    "id": "santa-lucia",
    "name": "Santa Lucía",
    "short": "LCA",
    "flag": "🇱🇨",
    "color": "#4D96FF",
    "aliases": [
      "Saint Lucia",
      "Santa Lucía",
      "LCA",
      "LC"
    ]
  },
  {
    "id": "santo-tome-y-principe",
    "name": "Santo Tomé y Príncipe",
    "short": "STP",
    "flag": "🇸🇹",
    "color": "#4D96FF",
    "aliases": [
      "Sao Tome and Principe",
      "Santo Tomé y Príncipe",
      "STP",
      "ST",
      "Democratic Republic of Sao Tome and Principe"
    ]
  },
  {
    "id": "seychelles",
    "name": "Seychelles",
    "short": "SEY",
    "flag": "🇸🇨",
    "color": "#22C55E",
    "aliases": [
      "Seychelles",
      "SEY",
      "SC",
      "Republic of Seychelles"
    ]
  },
  {
    "id": "sierra-leona",
    "name": "Sierra Leona",
    "short": "SLE",
    "flag": "🇸🇱",
    "color": "#DC2626",
    "aliases": [
      "Sierra Leone",
      "Sierra Leona",
      "SLE",
      "SL",
      "Republic of Sierra Leone"
    ]
  },
  {
    "id": "singapur",
    "name": "Singapur",
    "short": "SIN",
    "flag": "🇸🇬",
    "color": "#22C55E",
    "aliases": [
      "Singapore",
      "Singapur",
      "SIN",
      "SG",
      "Republic of Singapore"
    ]
  },
  {
    "id": "sint-maarten",
    "name": "Sint Maarten",
    "short": "SXM",
    "flag": "🇸🇽",
    "color": "#F8FAFC",
    "aliases": [
      "Sint Maarten (Dutch part)",
      "Sint Maarten",
      "SXM",
      "SX"
    ]
  },
  {
    "id": "siria",
    "name": "Siria",
    "short": "SYR",
    "flag": "🇸🇾",
    "color": "#F8FAFC",
    "aliases": [
      "Syrian Arab Republic",
      "Siria",
      "SYR",
      "SY"
    ]
  },
  {
    "id": "somalia",
    "name": "Somalia",
    "short": "SOM",
    "flag": "🇸🇴",
    "color": "#22C55E",
    "aliases": [
      "Somalia",
      "SOM",
      "SO",
      "Federal Republic of Somalia"
    ]
  },
  {
    "id": "sri-lanka",
    "name": "Sri Lanka",
    "short": "SRI",
    "flag": "🇱🇰",
    "color": "#FB923C",
    "aliases": [
      "Sri Lanka",
      "SRI",
      "LK",
      "Democratic Socialist Republic of Sri Lanka"
    ]
  },
  {
    "id": "sudafrica",
    "name": "Sudáfrica",
    "short": "RSA",
    "flag": "🇿🇦",
    "color": "#F8FAFC",
    "aliases": [
      "South Africa",
      "Sudáfrica",
      "RSA",
      "ZA",
      "Republic of South Africa"
    ]
  },
  {
    "id": "sudan",
    "name": "Sudán",
    "short": "SDN",
    "flag": "🇸🇩",
    "color": "#4D96FF",
    "aliases": [
      "Sudan",
      "Sudán",
      "SDN",
      "SD",
      "Republic of the Sudan"
    ]
  },
  {
    "id": "sudan-del-sur",
    "name": "Sudán del Sur",
    "short": "SSD",
    "flag": "🇸🇸",
    "color": "#2DD36F",
    "aliases": [
      "South Sudan",
      "Sudán del Sur",
      "SSD",
      "SS",
      "Republic of South Sudan"
    ]
  },
  {
    "id": "surinam",
    "name": "Surinam",
    "short": "SUR",
    "flag": "🇸🇷",
    "color": "#10B981",
    "aliases": [
      "Suriname",
      "Surinam",
      "SUR",
      "SR",
      "Republic of Suriname"
    ]
  },
  {
    "id": "svalbard-y-jan-mayen",
    "name": "Svalbard y Jan Mayen",
    "short": "SJM",
    "flag": "🇸🇯",
    "color": "#2DD36F",
    "aliases": [
      "Svalbard and Jan Mayen",
      "Svalbard y Jan Mayen",
      "SJM",
      "SJ"
    ]
  },
  {
    "id": "sahara-occidental",
    "name": "Sáhara Occidental",
    "short": "ESH",
    "flag": "🇪🇭",
    "color": "#F8FAFC",
    "aliases": [
      "Western Sahara",
      "Sáhara Occidental",
      "ESH",
      "EH"
    ]
  },
  {
    "id": "tailandia",
    "name": "Tailandia",
    "short": "THA",
    "flag": "🇹🇭",
    "color": "#60A5FA",
    "aliases": [
      "Thailand",
      "Tailandia",
      "THA",
      "TH",
      "Kingdom of Thailand"
    ]
  },
  {
    "id": "chinese-taipei",
    "name": "Chinese Taipei",
    "short": "TPE",
    "flag": "🇹🇼",
    "color": "#22C55E",
    "aliases": [
      "Taiwan, Province of China",
      "Chinese Taipei",
      "TPE",
      "TW"
    ]
  },
  {
    "id": "tanzania",
    "name": "Tanzania",
    "short": "TAN",
    "flag": "🇹🇿",
    "color": "#F472B6",
    "aliases": [
      "Tanzania, United Republic of",
      "Tanzania",
      "TAN",
      "TZ",
      "United Republic of Tanzania"
    ]
  },
  {
    "id": "tayikistan",
    "name": "Tayikistán",
    "short": "TJK",
    "flag": "🇹🇯",
    "color": "#10B981",
    "aliases": [
      "Tajikistan",
      "Tayikistán",
      "TJK",
      "TJ",
      "Republic of Tajikistan"
    ]
  },
  {
    "id": "territorio-britanico-del-oceano-indico",
    "name": "Territorio Británico del Océano Índico",
    "short": "IOT",
    "flag": "🇮🇴",
    "color": "#EF4444",
    "aliases": [
      "British Indian Ocean Territory",
      "Territorio Británico del Océano Índico",
      "IOT",
      "IO"
    ]
  },
  {
    "id": "territorios-australes-franceses",
    "name": "Territorios Australes Franceses",
    "short": "ATF",
    "flag": "🇹🇫",
    "color": "#FB923C",
    "aliases": [
      "French Southern Territories",
      "Territorios Australes Franceses",
      "ATF",
      "TF"
    ]
  },
  {
    "id": "palestina",
    "name": "Palestina",
    "short": "PLE",
    "flag": "🇵🇸",
    "color": "#7DD3FC",
    "aliases": [
      "Palestine, State of",
      "Palestina",
      "PLE",
      "PS",
      "the State of Palestine"
    ]
  },
  {
    "id": "timor-oriental",
    "name": "Timor Oriental",
    "short": "TLS",
    "flag": "🇹🇱",
    "color": "#DC2626",
    "aliases": [
      "Timor-Leste",
      "Timor Oriental",
      "TLS",
      "TL",
      "Democratic Republic of Timor-Leste"
    ]
  },
  {
    "id": "togo",
    "name": "Togo",
    "short": "TOG",
    "flag": "🇹🇬",
    "color": "#FACC15",
    "aliases": [
      "Togo",
      "TOG",
      "TG",
      "Togolese Republic"
    ]
  },
  {
    "id": "tokelau",
    "name": "Tokelau",
    "short": "TKL",
    "flag": "🇹🇰",
    "color": "#7DD3FC",
    "aliases": [
      "Tokelau",
      "TKL",
      "TK"
    ]
  },
  {
    "id": "tonga",
    "name": "Tonga",
    "short": "TGA",
    "flag": "🇹🇴",
    "color": "#74C0FC",
    "aliases": [
      "Tonga",
      "TGA",
      "TO",
      "Kingdom of Tonga"
    ]
  },
  {
    "id": "trinidad-y-tobago",
    "name": "Trinidad y Tobago",
    "short": "TRI",
    "flag": "🇹🇹",
    "color": "#EF4444",
    "aliases": [
      "Trinidad and Tobago",
      "Trinidad y Tobago",
      "TRI",
      "TT",
      "Republic of Trinidad and Tobago"
    ]
  },
  {
    "id": "turkmenistan",
    "name": "Turkmenistán",
    "short": "TKM",
    "flag": "🇹🇲",
    "color": "#F472B6",
    "aliases": [
      "Turkmenistan",
      "Turkmenistán",
      "TKM",
      "TM"
    ]
  },
  {
    "id": "tuvalu",
    "name": "Tuvalu",
    "short": "TUV",
    "flag": "🇹🇻",
    "color": "#60A5FA",
    "aliases": [
      "Tuvalu",
      "TUV",
      "TV"
    ]
  },
  {
    "id": "uganda",
    "name": "Uganda",
    "short": "UGA",
    "flag": "🇺🇬",
    "color": "#2DD36F",
    "aliases": [
      "Uganda",
      "UGA",
      "UG",
      "Republic of Uganda"
    ]
  },
  {
    "id": "vanuatu",
    "name": "Vanuatu",
    "short": "VAN",
    "flag": "🇻🇺",
    "color": "#EF4444",
    "aliases": [
      "Vanuatu",
      "VAN",
      "VU",
      "Republic of Vanuatu"
    ]
  },
  {
    "id": "vietnam",
    "name": "Vietnam",
    "short": "VIE",
    "flag": "🇻🇳",
    "color": "#2DD36F",
    "aliases": [
      "Viet Nam",
      "Vietnam",
      "VIE",
      "VN",
      "Socialist Republic of Viet Nam"
    ]
  },
  {
    "id": "wallis-y-futuna",
    "name": "Wallis y Futuna",
    "short": "WLF",
    "flag": "🇼🇫",
    "color": "#FB923C",
    "aliases": [
      "Wallis and Futuna",
      "Wallis y Futuna",
      "WLF",
      "WF"
    ]
  },
  {
    "id": "yemen",
    "name": "Yemen",
    "short": "YEM",
    "flag": "🇾🇪",
    "color": "#22C55E",
    "aliases": [
      "Yemen",
      "YEM",
      "YE",
      "Republic of Yemen"
    ]
  },
  {
    "id": "yibuti",
    "name": "Yibuti",
    "short": "DJI",
    "flag": "🇩🇯",
    "color": "#22C55E",
    "aliases": [
      "Djibouti",
      "Yibuti",
      "DJI",
      "DJ",
      "Republic of Djibouti"
    ]
  },
  {
    "id": "zambia",
    "name": "Zambia",
    "short": "ZAM",
    "flag": "🇿🇲",
    "color": "#F472B6",
    "aliases": [
      "Zambia",
      "ZAM",
      "ZM",
      "Republic of Zambia"
    ]
  },
  {
    "id": "zimbabue",
    "name": "Zimbabue",
    "short": "ZIM",
    "flag": "🇿🇼",
    "color": "#EF4444",
    "aliases": [
      "Zimbabwe",
      "Zimbabue",
      "ZIM",
      "ZW",
      "Republic of Zimbabwe"
    ]
  }
];
const MAIN_COUNTRY_IDS = ["general", "argentina", "brasil", "francia", "uruguay", "espana", "inglaterra", "alemania", "italia", "portugal", "paises-bajos", "mexico", "estados-unidos", "japon", "marruecos", "belgica", "croacia", "colombia", "senegal", "suiza", "dinamarca", "iran", "turquia", "ecuador", "austria", "corea-del-sur", "nigeria", "australia", "argelia", "egipto", "canada"];
function slugifyCountry(value){
  return String(value || '')
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'') || 'general';
}
function customCountryName(id){
  const found = state?.stickers?.find?.(s => s.country === id && s.countryName);
  return found?.countryName || '';
}
function countryById(id){
  const found = COUNTRIES.find(c=>c.id===id);
  if(found) return found;
  const name = customCountryName(id) || String(id || 'pais-sin-cargar').replace(/-/g,' ').replace(/\b\w/g, m=>m.toUpperCase());
  return { id:id || 'general', name, short:name.slice(0,3).toUpperCase(), flag:'⚑', color:'#FFE08A', custom:true };
}
function countryLabel(id){ return countryById(id).name; }
function countryInputValue(country, countryName){
  if(!countryName && (!country || country === 'general')) return '';
  return countryName || countryLabel(country || 'general');
}
function countryDisplayName(s){
  if(!s) return 'País sin cargar';
  if(s.countryName) return s.countryName;
  const id = s.country || 'general';
  return id === 'general' ? 'País sin cargar' : countryLabel(id);
}
function countryFromInput(value){
  const raw = String(value || '').trim();
  if(!raw) return { country:'general', countryName:'' };
  const q = normalizeText(raw);
  const byName = COUNTRIES.find(c => {
    const fields = [c.name, c.short, c.id, ...(c.aliases || [])];
    return fields.some(v => normalizeText(v) === q);
  }) || COUNTRIES.find(c => {
    const fields = [c.name, c.short, c.id, ...(c.aliases || [])];
    return fields.some(v => normalizeText(v).includes(q) || q.includes(normalizeText(v)));
  });
  if(byName) return { country:byName.id, countryName:byName.name };
  return { country:slugifyCountry(raw), countryName:raw };
}
function availableCountries(){
  const map = new Map();
  // En pantalla mostramos las más usadas + las que el usuario ya cargó.
  MAIN_COUNTRY_IDS.forEach(id => { const c = countryById(id); if(c) map.set(c.id, c); });
  state.stickers.forEach(s => {
    const id = s.country || 'general';
    if(!map.has(id)) map.set(id, countryById(id));
  });
  return Array.from(map.values());
}

const icons = {
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1 0 4h-3"/><path d="M7 5H4a2 2 0 0 0 0 4h3"/><path d="M9 17h6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5a1 1 0 0 1 1-1h2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/></svg>',
  flash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
  album: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M9 6h7"/><path d="M9 10h7"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5A8.1 8.1 0 0 1 8 18.6L3 20l1.4-4.8A8.1 8.1 0 1 1 20 11.5Z"/><path d="M8.5 8.5c.4 3.1 2 5 5 6"/><path d="M8.5 8.5h2l.8 2-1 1"/><path d="M13.5 14.5l1-1 2 .8v2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4-4L5 21"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 6 4 3-1.5 5h-5L8 9l4-3Z"/><path d="M8 9 4.5 7.8M16 9l3.5-1.2M9.5 14 7 18M14.5 14l2.5 4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
};

let state = {
  view: 'home',
  stickers: loadStickers(),
  user: localStorage.getItem(USER_KEY) || 'Lucas',
  albumFilter: 'all',
  countryFilter: 'all',
  search: '',
  countrySearch: '',
  selected: new Set(),
  modal: null,
  toast: null,
  manualDefault: 'have',
  editingId: null,
  scannerStream: null,
  cameraStarting: false,
  cameraError: '',
  scanBusy: false,
  detectedNumber: '',
  scanCandidate: null,
  autoScanTimer: null,
  autoScanPaused: false,
  shareMode: 'summary',
  batchStatus: 'have',
  viewerId: null,
  torchOn: false
};

const app = document.getElementById('app');

function loadStickers(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveStickers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stickers)); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function now(){ return new Date().toISOString(); }
function haptic(type='tap'){
  if(!navigator.vibrate) return;
  if(type === 'success') navigator.vibrate([18, 35, 18]);
  else if(type === 'warn') navigator.vibrate([35]);
  else navigator.vibrate(12);
}
function normalizeNumber(value){
  const v = String(value || '').replace(/[^0-9]/g,'').replace(/^0+(?=\d)/,'');
  return v;
}
function normalizeText(value){
  return String(value || '')
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase();
}
function byNumber(a,b){ return Number(a.number) - Number(b.number); }
function setView(view, opts={}){
  stopCamera();
  state.view = view;
  if(opts.filter) state.albumFilter = opts.filter;
  if(opts.manualDefault) state.manualDefault = opts.manualDefault;
  if(opts.editingId !== undefined) state.editingId = opts.editingId;
  state.selected = new Set();
  state.detectedNumber = '';
  state.scanCandidate = null;
  state.autoScanPaused = false;
  if(view === 'scanner') state.cameraError = '';
  render();
}

function centerScannerFrame(){
  if(state.view !== 'scanner') return;
  const el = document.querySelector('.scanner-wrap');
  if(!el) return;
  try{
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }catch(e){
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90);
    window.scrollTo(0, y);
  }
}

let toastTimer = null;
function toast(message, type='success'){
  haptic(type === 'warn' ? 'warn' : 'success');
  state.toast = { message, type };
  paintToast();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ state.toast=null; paintToast(); }, 1200);
}
function paintToast(){
  document.querySelectorAll('.toast').forEach(el=>el.remove());
  if(!state.toast) return;
  const host = document.querySelector('.app') || app || document.body;
  const div = document.createElement('div');
  div.className = `toast ${state.toast.type==='warn'?'warn':'success'}`;
  div.innerHTML = `${state.toast.type==='warn'?icons.repeat:icons.check}<span>${escapeHtml(state.toast.message)}</span>`;
  host.appendChild(div);
}
function counts(){
  return {
    have: state.stickers.filter(s=>s.status==='have').length,
    missing: state.stickers.filter(s=>s.status==='missing').length,
    repeated: state.stickers.filter(s=>s.status==='repeated').reduce((acc,s)=>acc + (Number(s.repeatedCount)||1),0),
    total: state.stickers.length
  };
}

function stickerCountry(s){ return s.country || 'general'; }
function countryStats(){
  const map = new Map();
  state.stickers.forEach(s=>{
    const id = stickerCountry(s);
    if(!map.has(id)) map.set(id,{ id, total:0, have:0, missing:0, repeated:0 });
    const row = map.get(id); row.total += 1; row[s.status] += 1;
  });
  return Array.from(map.values()).sort((a,b)=>b.total-a.total).slice(0,8);
}
function progressPercent(row){ return row.total ? Math.round((row.have / row.total) * 100) : 0; }

function existingByNumber(number){ return state.stickers.find(s => String(s.number) === String(number)); }
function formatSticker(s){
  const name = s.player ? ` - ${s.player}` : '';
  return `N° ${s.number}${name}`;
}

function addOrUpdateSticker({ number, status, repeatedCount=1, player='', country='general', countryName='', image='', forceMissing=false }){
  number = normalizeNumber(number);
  if(!number){ toast('Ingresá un número de figurita.', 'warn'); return false; }
  if(!['have','missing','repeated'].includes(status)) status = 'have';

  const existing = existingByNumber(number);
  const stamp = now();
  const cleanPlayer = String(player || '').trim();
  const cleanCountry = country || 'general';
  const cleanCountryName = countryName || (cleanCountry === 'general' ? '' : countryLabel(cleanCountry));
  const qty = Math.max(1, Number(repeatedCount)||1);

  if(existing){
    if(cleanPlayer) existing.player = cleanPlayer;
    if(cleanCountry) existing.country = cleanCountry;
    if(cleanCountryName) existing.countryName = cleanCountryName;
    if(image) existing.image = image;
    existing.updatedAt = stamp;

    if(status === 'have'){
      if(existing.status === 'have'){
        existing.status = 'repeated';
        existing.repeatedCount = Math.max(2, (Number(existing.repeatedCount)||1) + 1);
        toast(`Ya tenías la N° ${number}. La marqué como repetida.`, 'warn');
      } else if(existing.status === 'repeated'){
        existing.repeatedCount = (Number(existing.repeatedCount)||1) + 1;
        toast(`La N° ${number} ya era repetida. Sumé una más.`, 'warn');
      } else {
        existing.status = 'have';
        existing.repeatedCount = 0;
        toast(`La N° ${number} estaba en faltantes. Ahora la tenés.`, 'success');
      }
      saveStickers(); render(); return true;
    }

    if(status === 'repeated'){
      existing.status = 'repeated';
      existing.repeatedCount = (Number(existing.repeatedCount)||0) + qty;
      toast(`La N° ${number} quedó como repetida x${existing.repeatedCount}.`, 'warn');
      saveStickers(); render(); return true;
    }

    if(status === 'missing'){
      if(existing.status === 'missing'){
        toast(`La N° ${number} ya estaba en faltantes.`, 'warn');
        saveStickers(); render(); return true;
      }
      if(forceMissing){
        existing.status = 'missing';
        existing.repeatedCount = 0;
        toast(`La N° ${number} quedó como faltante.`, 'success');
        saveStickers(); render(); return true;
      }
      state.modal = {
        title: `La N° ${number} ya está cargada`,
        text: `Figura como “${STATUS[existing.status].label}”. ¿Querés cambiarla a “Me falta”?`,
        cancel: 'Mantener',
        confirm: 'Cambiar a faltante',
        danger: false,
        onConfirm: () => {
          existing.status = 'missing';
          existing.repeatedCount = 0;
          existing.updatedAt = now();
          saveStickers();
          state.modal = null;
          state.albumFilter = 'missing';
          state.countryFilter = 'all';
          state.search = '';
          toast(`La N° ${number} quedó como faltante.`, 'success');
          setView('album',{filter:'missing'});
        }
      };
      render();
      return false;
    }
  }

  const sticker = {
    id: uid(),
    number,
    player: cleanPlayer,
    country: cleanCountry,
    countryName: cleanCountryName,
    image: image || '',
    status,
    repeatedCount: status === 'repeated' ? qty : 0,
    createdAt: stamp,
    updatedAt: stamp
  };
  state.stickers.push(sticker);
  state.stickers.sort(byNumber);
  saveStickers();
  toast(`Figurita N° ${number} guardada como ${STATUS[status].label}.`, 'success');
  render();
  return true;
}

function deleteSticker(id){
  const s = state.stickers.find(x=>x.id===id);
  if(!s) return;

  // Si es repetida y tiene cantidad, no borrar todo de golpe.
  // Primero preguntamos cuántas repetidas quiere quitar.
  if(s.status === 'repeated' && Number(s.repeatedCount || 0) > 1){
    state.modal = {
      kind: 'deleteRepeated',
      stickerId: id,
      qty: 1,
      maxQty: Number(s.repeatedCount) || 1,
      title: `Borrar repetidas N° ${s.number}`,
      text: `Tenés ${Number(s.repeatedCount)||1} repetidas. Elegí cuántas querés borrar.`,
      cancel: 'Cancelar',
      confirm: 'Borrar',
      danger: true,
      onConfirm: () => confirmDeleteRepeated()
    };
    render();
    return;
  }

  state.modal = {
    title: `Eliminar figurita N° ${s.number}`,
    text: 'Esta acción borra la figurita de tu álbum en este celular.',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(x=>x.id!==id);
      state.selected.delete(id);
      saveStickers();
      state.modal = null;
      toast(`Eliminé la N° ${s.number}.`, 'success');
      render();
    }
  };
  render();
}
function changeDeleteQty(delta){
  if(!state.modal || state.modal.kind !== 'deleteRepeated') return;
  const max = Number(state.modal.maxQty) || 1;
  const next = Math.max(1, Math.min(max, (Number(state.modal.qty)||1) + delta));
  state.modal.qty = next;
  render();
}
function setDeleteAllRepeated(){
  if(!state.modal || state.modal.kind !== 'deleteRepeated') return;
  state.modal.qty = Number(state.modal.maxQty) || 1;
  render();
}
function confirmDeleteRepeated(){
  const m = state.modal;
  if(!m || m.kind !== 'deleteRepeated') return;
  const s = state.stickers.find(x=>x.id===m.stickerId);
  if(!s){ state.modal=null; render(); return; }
  const current = Number(s.repeatedCount)||1;
  const qty = Math.max(1, Math.min(current, Number(m.qty)||1));
  if(qty >= current){
    state.stickers = state.stickers.filter(x=>x.id!==s.id);
    state.selected.delete(s.id);
    toast(`Eliminé todas las repetidas de la N° ${s.number}.`, 'success');
  }else{
    s.repeatedCount = current - qty;
    s.updatedAt = now();
    toast(`Borré ${qty}. Quedan ${s.repeatedCount} repetidas de la N° ${s.number}.`, 'success');
  }
  saveStickers();
  state.modal = null;
  render();
}
function bulkDelete(){
  const ids = [...state.selected];
  if(!ids.length) return;
  state.modal = {
    title: `Eliminar ${ids.length} figuritas`,
    text: 'Se borrarán de tu álbum en este celular.',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(s=>!state.selected.has(s.id));
      state.selected = new Set();
      saveStickers();
      state.modal = null;
      toast('Figuritas eliminadas.', 'success');
      render();
    }
  };
  render();
}
function bulkStatus(status){
  if(!state.selected.size) return;
  state.stickers.forEach(s=>{
    if(state.selected.has(s.id)){
      s.status = status;
      s.repeatedCount = status === 'repeated' ? Math.max(1, Number(s.repeatedCount)||1) : 0;
      s.updatedAt = now();
    }
  });
  saveStickers();
  state.selected = new Set();
  toast('Cambios aplicados.', 'success');
  render();
}
function toggleSelect(id){
  if(state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
  render();
}
function filteredStickers(){
  let list = [...state.stickers];
  if(state.albumFilter !== 'all') list = list.filter(s=>s.status===state.albumFilter);
  if(state.countryFilter !== 'all') list = list.filter(s=>stickerCountry(s)===state.countryFilter);
  if(state.search.trim()) {
    const q = normalizeText(state.search);
    const qn = normalizeNumber(state.search);
    list = list.filter(s=>String(s.number).includes(qn) || normalizeText(s.player||'').includes(q));
  }
  if(state.countrySearch.trim()) {
    const cq = normalizeText(state.countrySearch);
    list = list.filter(s=>normalizeText(s.countryName || countryLabel(stickerCountry(s))).includes(cq));
  }
  return list.sort(byNumber);
}


function statusIcon(status){
  if(status==='have') return icons.check;
  if(status==='missing') return icons.x;
  return icons.repeat;
}
function appTrophyBg(){
  return `<div class="bg-trophy"><svg viewBox="0 0 260 260" fill="none" aria-hidden="true"><path d="M72 44h116v42c0 32-26 58-58 58s-58-26-58-58V44Z" fill="#FFD96A" stroke="#FFF2B2" stroke-width="6"/><path d="M188 58h35c9 0 16 7 16 16 0 27-22 49-49 49h-8" stroke="#FFD96A" stroke-width="16" stroke-linecap="round"/><path d="M72 58H37c-9 0-16 7-16 16 0 27 22 49 49 49h8" stroke="#FFD96A" stroke-width="16" stroke-linecap="round"/><path d="M130 144v38" stroke="#FFD96A" stroke-width="18" stroke-linecap="round"/><path d="M92 204h76" stroke="#FFD96A" stroke-width="20" stroke-linecap="round"/><path d="M78 230h104" stroke="#FFD96A" stroke-width="18" stroke-linecap="round"/><path d="M99 64c6 40 32 58 70 59" stroke="white" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/></svg></div>`;
}
function topbar(right=''){
  return `<div class="topbar"><div class="brand"><div class="logo">${icons.trophy}</div><div><div class="brand-title">FiguScan</div><div class="brand-sub">Mundial de figuritas</div></div></div>${right}</div>`;
}

function homeScreen(){
  const c = counts();
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'all'})">Mi álbum</button>`)}
    <section class="hero premium-hero">
      <div class="shine-ball">${icons.trophy}</div>
      <h1>Tu álbum, listo para cambiar</h1>
      <p>Escaneá, cargá faltantes y compartí listas con estilo mundialista.</p>
      <div class="hero-actions">
        <button class="btn btn-gold" onclick="setView('scanner')">${icons.scan} Escanear ahora</button>
        <button class="btn btn-white" onclick="setView('manual',{manualDefault:'have'})">${icons.plus} Agregar manual</button>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Resumen</h2><span class="muted">${c.total} cargadas</span></div>
      <div class="stats">
        <button class="stat have" onclick="setView('album',{filter:'have'})">${icons.check}<div class="stat-num">${c.have}</div><div class="stat-label">Tengo</div></button>
        <button class="stat missing" onclick="setView('album',{filter:'missing'})">${icons.x}<div class="stat-num">${c.missing}</div><div class="stat-label">Me faltan</div></button>
        <button class="stat repeated" onclick="setView('album',{filter:'repeated'})">${icons.repeat}<div class="stat-num">${c.repeated}</div><div class="stat-label">Repetidas</div></button>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Accesos rápidos</h2></div>
      <div class="quick-grid">
        <button class="quick-card" onclick="setView('album',{filter:'all'})">${icons.album}<br>Mi álbum</button>
        <button class="quick-card" onclick="setView('friends')">${icons.users}<br>Cambios con amigos</button>
        <button class="quick-card" onclick="setView('album',{filter:'repeated'})">${icons.repeat}<br>Repetidas</button>
        <button class="quick-card" onclick="setView('share')">${icons.share}<br>Compartir</button>
      </div>
    </section>

    <section class="section progress-section">
      <div class="section-title"><h2>Progreso por selección</h2><span class="muted">motivación</span></div>
      ${countryProgressHtml()}
    </section>
  </main>`;
}

function countryProgressHtml(){
  const rows = countryStats();
  if(!rows.length) return `<p class="muted">Cuando cargues figuritas, vas a ver el avance por selección.</p>`;
  return `<div class="country-progress-list">${rows.map(row=>{ const c=countryById(row.id); const pct=progressPercent(row); return `<button class="country-progress" onclick="selectCountry('${row.id}')"><span class="flag">${c.flag}</span><span><strong>${c.name}</strong><small>${row.have}/${row.total} obtenidas</small></span><b>${pct}%</b><i><em style="width:${pct}%"></em></i></button>`; }).join('')}</div>`;
}
function selectCountry(id){
  state.countryFilter = id || 'all';
  state.countrySearch = '';
  state.selected = new Set();
  state.view = 'album';
  haptic('tap');
  render();
}
function countryCarouselHtml(){
  const rows = countryStats();
  const allActive = state.countryFilter === 'all' && !state.countrySearch.trim();
  const total = state.stickers.length;
  const items = [`<button class="country-tile ${allActive?'active':''}" onclick="selectCountry('all')"><span class="tile-flag">${icons.album}</span><strong>Ver todo</strong><small>${total} figuritas</small><i><em style="width:100%"></em></i></button>`];
  const seen = new Set(rows.map(r=>r.id));
  rows.forEach(row=>{
    const c = countryById(row.id); const pct = progressPercent(row); const active = state.countryFilter === row.id;
    items.push(`<button class="country-tile ${active?'active':''}" onclick="selectCountry('${row.id}')"><span class="tile-flag">${c.flag}</span><strong>${c.name}</strong><small>${row.have}/${row.total} tengo</small><b>${pct}%</b><i><em style="width:${pct}%"></em></i></button>`);
  });
  availableCountries().filter(c=>!seen.has(c.id)).slice(0,8).forEach(c=>{
    const active = state.countryFilter === c.id;
    items.push(`<button class="country-tile ${active?'active':''}" onclick="selectCountry('${c.id}')"><span class="tile-flag">${c.flag}</span><strong>${c.name}</strong><small>Sin progreso</small><i><em style="width:0%"></em></i></button>`);
  });
  return `<div class="country-carousel">${items.join('')}</div>`;
}

function entryModeSwitch(current){
  return `<section class="entry-switch-wrap"><div class="entry-switch">
    <button class="entry-switch-btn ${current==='scanner'?'active':''}" onclick="setView('scanner')">${icons.scan}<span>Escanear</span></button>
    <button class="entry-switch-btn ${current==='manual'?'active':''}" onclick="setView('manual',{manualDefault:'have'})">${icons.plus}<span>Agregar manualmente</span></button>
  </div><p class="entry-switch-help">Elegí si querés leer la figurita con cámara o cargarla a mano.</p></section>`;
}

function manualScreen(){
  const editing = state.editingId ? state.stickers.find(s=>s.id===state.editingId) : null;
  const defaultStatus = editing ? editing.status : state.manualDefault;
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'${state.albumFilter}'})">Volver</button>`)}
    <section class="hero">
      <div class="logo">${icons.plus}</div>
      <h1>${editing ? 'Editar figurita' : 'Agregar figurita'}</h1>
      <p>${editing ? 'Actualizá el número, jugador, estado o cantidad.' : 'Cargala por número. Si ya la tenés, la app la pasa a repetida automáticamente.'}</p>
    </section>
    ${entryModeSwitch('manual')}
    <section class="section">
      <form class="form" onsubmit="submitManual(event)">
        <div class="field"><label>Número de figurita</label><input class="input" inputmode="numeric" pattern="[0-9]*" id="num" placeholder="Ej: 24" value="${editing ? escapeHtml(editing.number) : ''}" required></div>
        <div class="field"><label>Nombre del jugador</label><input class="input" id="player" placeholder="Ej: Messi" value="${editing ? escapeHtml(editing.player||'') : ''}"></div>
        <div class="field"><label>Selección / país</label><input class="input" id="countryInput" list="countryList" placeholder="Escribí Argentina, Brasil..." value="${editing ? escapeHtml(countryInputValue(editing.country, editing.countryName)) : ''}"><datalist id="countryList">${countryOptions(editing?.country || 'general')}</datalist><small class="help">Escribí y elegí una sugerencia. Si no existe, la app agrega ese país.</small></div>
        <div class="field"><label>¿Cómo la querés marcar?</label><div class="state-grid">
          ${stateButton('have', defaultStatus)}
          ${stateButton('missing', defaultStatus)}
          ${stateButton('repeated', defaultStatus)}
        </div></div>
        <input type="hidden" id="manualStatus" value="${defaultStatus}">
        <div id="qtyBlock" class="${defaultStatus==='repeated'?'':'hidden'}">${qtyBlock(editing?.repeatedCount || 1)}</div>
        <button class="btn btn-primary full" type="submit">Guardar</button>
        <button class="btn btn-ghost full" type="button" onclick="submitManual(event,true)">Guardar y cargar otra</button>
        <button class="btn btn-line full" type="button" onclick="setView('album',{filter:'${state.albumFilter}'})">Cancelar</button>
      </form>
    </section>
  </main>`;
}
function countryOptions(active='general'){ return COUNTRIES.filter(c=>c.id !== 'general').map(c=>`<option value="${escapeHtml(c.name)}">${escapeHtml(c.short || '')} ${escapeHtml(c.flag || '')}</option>`).join(''); }
function stateButton(status, active){
  return `<button type="button" class="state-option ${status} ${active===status?'active':''}" onclick="chooseManualStatus('${status}')">${statusIcon(status)} <span>${STATUS[status].long}</span></button>`;
}
function qtyBlock(qty){
  return `<div class="field"><label>Cantidad de repetidas</label><div class="qty"><button type="button" onclick="changeQty(-1)">−</button><strong id="qtyValue">${Math.max(1, Number(qty)||1)}</strong><button type="button" onclick="changeQty(1)">+</button></div></div>`;
}
function chooseManualStatus(status){
  document.getElementById('manualStatus').value = status;
  document.querySelectorAll('.state-option').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.state-option.${status}`)?.classList.add('active');
  document.getElementById('qtyBlock').classList.toggle('hidden', status !== 'repeated');
}
function changeQty(delta){
  const el = document.getElementById('qtyValue');
  const next = Math.max(1, (Number(el.textContent)||1) + delta);
  el.textContent = next;
}
function submitManual(e, again=false){
  e?.preventDefault?.();
  const number = normalizeNumber(document.getElementById('num')?.value);
  const player = document.getElementById('player')?.value || '';
  const status = document.getElementById('manualStatus')?.value || state.manualDefault || 'have';
  const countryData = countryFromInput(document.getElementById('countryInput')?.value || '');
  const country = countryData.country;
  const countryName = countryData.countryName;
  const repeatedCount = Math.max(1, Number(document.getElementById('qtyValue')?.textContent || 1));

  if(!number){ toast('Ingresá el número de figurita.', 'warn'); return false; }

  if(state.editingId){
    const s = state.stickers.find(x=>x.id===state.editingId);
    if(s){
      s.number = number;
      s.player = player.trim();
      s.country = country;
      s.countryName = countryName;
      s.status = status;
      s.repeatedCount = status==='repeated' ? repeatedCount : 0;
      s.updatedAt = now();
      saveStickers();
      toast('Figurita actualizada.');
      state.editingId = null;
      state.countryFilter = 'all';
      state.search = '';
      setView('album',{filter:status});
    }
    return false;
  }

  const ok = addOrUpdateSticker({number, player, country, countryName, status, repeatedCount});
  if(ok){
    state.countryFilter = 'all';
    state.search = '';
    if(again){
      state.manualDefault = status;
      state.editingId = null;
      render();
      const num = document.getElementById('num');
      if(num){ num.value=''; num.focus(); }
      const p = document.getElementById('player'); if(p) p.value='';
    } else {
      setView('album',{filter:status});
    }
  }
  return false;
}


function albumCountryHeaderHtml(){
  if(state.countryFilter === 'all' && !state.countrySearch.trim()) return `<div class="album-country-title"><div>${icons.ball}<span>Vista global</span></div><small>${state.stickers.length} figuritas cargadas</small></div>`;
  const id = state.countryFilter !== 'all' ? state.countryFilter : '';
  const name = state.countrySearch.trim() || (id ? countryLabel(id) : 'País');
  const list = state.stickers.filter(s => id ? stickerCountry(s)===id : normalizeText(s.countryName || countryLabel(stickerCountry(s))).includes(normalizeText(name)));
  const have = list.filter(s=>s.status==='have').length;
  const total = list.length;
  const pct = total ? Math.round((have/total)*100) : 0;
  const meta = id ? countryById(id) : {flag:'⚑', name};
  return `<div class="album-country-title active-country"><div><span class="country-big-flag">${meta.flag}</span><span>${escapeHtml(name)}</span></div><small>${have}/${total} tengo · ${pct}%</small><i><em style="width:${pct}%"></em></i></div>`;
}

function albumScreen(){
  const list = filteredStickers();
  const filterLabel = state.albumFilter==='all'?'Todas':STATUS[state.albumFilter].label;
  const defaultAdd = state.albumFilter === 'all' ? 'have' : state.albumFilter;
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('share')">Compartir</button>`)}
    <section class="section album-head">
      <div class="section-title"><h2>Mi álbum</h2><span class="muted">${filterLabel}</span></div>
      ${albumCountryHeaderHtml()}
      ${countryCarouselHtml()}
      <div class="album-search-grid">
        <input class="search" placeholder="Buscar número o jugador" value="${escapeHtml(state.search)}" oninput="state.search=this.value; render()">
        <div class="country-search-wrap">
          <input class="search" list="albumCountryList" placeholder="Buscar país" value="${escapeHtml(state.countrySearch)}" oninput="state.countrySearch=this.value; render()">
          <datalist id="albumCountryList">${availableCountries().map(c=>`<option value="${escapeHtml(c.name)}"></option>`).join('')}</datalist>
        </div>
      </div>
      <div class="toolbar">
        ${filterChip('all','Todas')}${filterChip('have','Tengo')}${filterChip('missing','Me faltan')}${filterChip('repeated','Repetidas')}
      </div>
      <div class="toolbar countries-toolbar">${countryChip('all','Todas')}${availableCountries().map(c=>countryChip(c.id, c.short || c.name.slice(0,3).toUpperCase())).join('')}</div>
      <div class="album-actions">
        <button class="btn btn-primary" onclick="setView('manual',{manualDefault:'${defaultAdd}'})">${icons.plus} Agregar ${state.albumFilter==='missing'?'faltante':state.albumFilter==='repeated'?'repetida':state.albumFilter==='have'?'tengo':'manual'}</button>
        <button class="btn btn-ghost" onclick="state.selected = new Set(); render()">Limpiar selección</button>
        <button class="btn btn-line" onclick="state.search=''; state.countrySearch=''; state.countryFilter='all'; render()">Limpiar búsqueda</button>
      </div>
    </section>
    ${state.selected.size ? bulkBar() : ''}
    <section class="cards">
      ${list.length ? list.map(stickerCard).join('') : `<div class="empty" style="grid-column:1/-1">No hay figuritas en esta sección.<br><br><button class="btn btn-primary" onclick="setView('manual',{manualDefault:'${defaultAdd}'})">Agregar ahora</button></div>`}
    </section>
  </main>`;
}
function filterChip(key,label){ return `<button class="chip ${state.albumFilter===key?'active':''}" onclick="state.albumFilter='${key}'; state.search=''; state.selected=new Set(); render()">${label}</button>`; }
function countryChip(key,label){ const meta = key==='all' ? null : countryById(key); return `<button class="chip country ${state.countryFilter===key?'active':''}" onclick="state.countryFilter='${key}'; state.selected=new Set(); render()">${key==='all'?'':meta.flag+' '}${key==='all'?label:(meta.short || label)}</button>`; }
function bulkBar(){
  return `<section class="bulkbar"><strong>${state.selected.size} seleccionadas</strong><div class="row"><button class="btn btn-green" onclick="bulkStatus('have')">Tengo</button><button class="btn btn-danger" onclick="bulkStatus('missing')">Me falta</button></div><div class="row"><button class="btn btn-orange" onclick="bulkStatus('repeated')">Repetida</button><button class="btn btn-danger" onclick="bulkDelete()">Eliminar</button></div></section>`;
}
function stickerCard(s){
  const selected = state.selected.has(s.id);
  return `<article class="sticker-card ${s.status} ${s.status==='repeated'?'shiny':''}" onclick="openStickerViewer('${s.id}')">
    <button class="select-box ${selected?'on':''}" onclick="event.stopPropagation(); toggleSelect('${s.id}')">${selected ? icons.check : ''}</button>
    <div style="padding-left:26px">
      <div class="sticker-top"><div class="number">#${s.number}</div><span class="status-badge ${s.status}">${statusIcon(s.status)} ${STATUS[s.status].label}${s.status==='repeated'?` x${s.repeatedCount||1}`:''}</span></div>
      ${s.image ? `<div class="sticker-photo"><img src="${s.image}" alt="Figurita ${escapeHtml(s.number)}" loading="lazy"></div>` : `<div class="sticker-photo sticker-photo-empty"><div>${icons.trophy}</div><strong>Sin foto</strong></div>`}
      <div class="country-line"><span>${countryById(stickerCountry(s)).flag}</span> ${escapeHtml(countryDisplayName(s))}</div>
      <div class="player">${escapeHtml(s.player || 'Sin jugador')}</div>
      <div class="card-actions">
        <button class="icon-btn" title="Editar" onclick="event.stopPropagation(); setView('manual',{editingId:'${s.id}'})">${icons.edit}</button>
        <button class="icon-btn" title="WhatsApp" onclick="event.stopPropagation(); shareSingle('${s.id}')">${icons.whatsapp}</button>
        <button class="icon-btn danger" title="Eliminar" onclick="event.stopPropagation(); deleteSticker('${s.id}')">${icons.trash}</button>
        <button class="icon-btn" title="Cambiar estado" onclick="event.stopPropagation(); quickCycle('${s.id}')">${icons.repeat}</button>
      </div>
    </div>
  </article>`;
}
function quickCycle(id){
  const s = state.stickers.find(x=>x.id===id); if(!s) return;
  s.status = s.status==='have'?'repeated':s.status==='repeated'?'missing':'have';
  s.repeatedCount = s.status==='repeated' ? Math.max(1,Number(s.repeatedCount)||1) : 0;
  s.updatedAt = now(); saveStickers(); toast(`La N° ${s.number} ahora está como ${STATUS[s.status].label}.`); render();
}

function scannerScreen(){
  return `<main class="screen scanner-screen">
    ${topbar(`<button class="pill" onclick="setView('home')">Inicio</button>`)}
    <section class="hero scanner-hero"><div class="logo">${icons.scan}</div><h1>Foto de figurita</h1><p>Encadrá la figurita completa, sacá una foto prolija y guardala con imagen en tu álbum.</p></section>
    ${entryModeSwitch('scanner')}
    <section class="section scan-section scan-section-full">
      <div class="scanner-wrap scanner-wrap-xl" onclick="handleScannerFrameTap(event)">
        <video id="video" class="video video-xl" autoplay playsinline muted></video>
        <div class="scan-overlay"><div class="scan-text">Centrar la figurita completa en el marco</div><div class="scan-frame scan-frame-xl"><span>Tocá el recuadro para activar cámara o sacar foto</span></div></div>
        <button class="flash-fab ${state.torchOn?'on':''}" onclick="toggleTorch(event)" type="button" title="Luz / flash">${icons.flash}</button>
        <div class="auto-scan-badge ${state.scanBusy?'working':''}">${state.scanBusy ? 'Mejorando imagen...' : 'Cámara lista'}</div>
        ${state.cameraError ? cameraFallback() : ''}
      </div>
      <div class="scan-controls scan-controls-grid">
        <button class="btn btn-primary full" onclick="scanFrame(true)">${icons.image} Sacar foto y guardar imagen</button>
        <button class="btn btn-ghost full" onclick="setView('manual',{manualDefault:'have'})">Cargar sin foto</button>
      </div>
      <div id="detectedBox">${state.scanCandidate ? detectedBox() : ''}</div>
    </section>
    ${batchQuickSection()}
  </main>`;
}
function handleScannerFrameTap(e){
  if(e) e.stopPropagation();
  const video = document.getElementById('video');
  if(!state.scannerStream || state.cameraError || !video || !video.videoWidth){
    state.cameraError = '';
    startCamera(true);
    return;
  }
  scanFrame(true);
}

function cameraFallback(){
  return `<div class="camera-fallback">
    <div class="camera-fallback-card">
      <strong>La cámara no se activó</strong>
      <span>${escapeHtml(state.cameraError || 'Revisá el permiso de cámara.')}</span>
      <button class="btn btn-primary full" onclick="retryCamera()">Activar cámara</button>
      <button class="btn btn-ghost full" onclick="setView('manual',{manualDefault:'have'})">Cargar manual</button>
    </div>
  </div>`;
}
function retryCamera(){
  state.cameraError = '';
  state.cameraStarting = false;
  startCamera(true);
}

async function toggleTorch(e){
  if(e) e.stopPropagation();
  try{
    if(!state.scannerStream){
      toast('Activando cámara primero...', 'warn');
      await startCamera(true);
    }
    const track = state.scannerStream?.getVideoTracks?.()[0];
    if(!track) throw new Error('Sin pista de video');
    const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
    if(!caps || !caps.torch){
      toast('Tu navegador no permite controlar el flash. Usá más luz externa.', 'warn');
      return;
    }
    const next = !state.torchOn;
    await track.applyConstraints({ advanced: [{ torch: next }] });
    state.torchOn = next;
    toast(next ? 'Luz activada.' : 'Luz apagada.', 'success');
    render();
  }catch(e){
    toast('No pude activar el flash en este teléfono. Usá luz externa si hace falta.', 'warn');
  }
}

function detectedBox(){
  const c = state.scanCandidate || { number:'', player:'', country:'general', countryName:'', image:'' };
  return `<div class="detected scan-success scan-card-save lux-save-panel"><div class="particles"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="figu-capture-title"><strong>Foto lista</strong><span>Completá los datos y elegí el estado</span></div>
    ${c.image ? `<div class="figu-stage"><div class="figu-world-bg"></div><img class="scan-preview" src="${c.image}" alt="Vista de figurita"><button class="remove-photo-btn" onclick="removeScanPhoto(event)" type="button">${icons.trash} Eliminar foto</button></div>` : `<div class="figu-stage empty-photo"><div class="figu-world-bg"></div><button class="btn btn-gold full" onclick="state.scanCandidate=null; render(); setTimeout(startCamera,50)" type="button">Sacar foto</button></div>`}
    <section class="scan-data-panel">
      <div class="scan-data-head"><span>${icons.edit}</span><div><strong>Datos de la figurita</strong><small>Estos son los campos que se cargan en el álbum</small></div></div>
      <div class="field number-field"><label>Número de figurita</label><div class="number-control"><button type="button" onclick="stepDetectedNumber(-1)">−</button><input class="input" id="detectedNum" inputmode="numeric" value="${escapeHtml(c.number)}" placeholder="Ej: 24"><button type="button" onclick="stepDetectedNumber(1)">+</button></div></div>
      <div class="field"><label>Nombre del jugador</label><input class="input" id="detectedPlayer" value="${escapeHtml(c.player || '')}" placeholder="Ej: Messi"></div>
      <div class="field"><label>País / selección</label><input class="input" id="detectedCountry" list="countryListScan" value="${escapeHtml(countryInputValue(c.country, c.countryName))}" placeholder="Ej: Portugal"><datalist id="countryListScan">${countryOptions(c.country || 'general')}</datalist></div>
    </section>
    <div class="state-grid luxury-state-grid" style="margin-top:12px">
      <button class="state-option have" onclick="saveDetected('have')">${icons.check} La tengo</button>
      <button class="state-option repeated" onclick="saveDetected('repeated')">${icons.repeat} Repetida</button>
      <button class="state-option missing" onclick="saveDetected('missing')">${icons.x} Me falta</button>
    </div>
    <button class="btn btn-primary full" style="margin-top:12px" onclick="state.scanCandidate=null; state.detectedNumber=''; state.autoScanPaused=false; render(); setTimeout(startCamera,50)">Sacar otra foto</button>
  </div>`;
}
function removeScanPhoto(e){
  if(e) e.stopPropagation();
  if(state.scanCandidate) state.scanCandidate.image = '';
  toast('Foto eliminada. Podés sacar otra o guardar sin imagen.', 'warn');
  render();
}
function stepDetectedNumber(delta){
  const input = document.getElementById('detectedNum');
  if(!input) return;
  const current = Number(normalizeNumber(input.value) || 0);
  const next = Math.max(1, current + delta);
  input.value = String(next);
}
function saveDetected(status){
  const c = state.scanCandidate || {};
  const num = normalizeNumber(document.getElementById('detectedNum')?.value || c.number || '');
  const player = document.getElementById('detectedPlayer')?.value || c.player || '';
  const countryRaw = document.getElementById('detectedCountry')?.value || c.countryName || '';
  const parsed = countryFromInput(countryRaw);
  addOrUpdateSticker({number:num,status,repeatedCount:1,player,country:parsed.country,countryName:parsed.countryName,image:c.image || ''});
  state.countryFilter='all'; state.search=''; state.detectedNumber=''; state.scanCandidate=null; state.autoScanPaused=false; state.view='scanner'; render(); setTimeout(startCamera,80);
}
function batchQuickSection(){
  const active = state.batchStatus || 'have';
  return `<section class="section batch-quick">
    <div class="section-title"><h2>Cargar varias rápido</h2><span class="muted">sin volver atrás</span></div>
    <p class="muted">Escribí varios números separados por coma, espacio o salto de línea.</p>
    <textarea id="batchNumbers" class="batch-input" inputmode="numeric" placeholder="Ej: 4, 9, 15, 22"></textarea>
    <div class="batch-status-grid">
      ${batchStatusButton('have', active)}
      ${batchStatusButton('missing', active)}
      ${batchStatusButton('repeated', active)}
    </div>
    <button class="btn btn-primary full" onclick="saveBatchQuick()">Guardar varias</button>
  </section>`;
}
function batchStatusButton(status, active){
  return `<button class="batch-status ${status} ${active===status?'active':''}" onclick="state.batchStatus='${status}'; render()">${statusIcon(status)} <span>${STATUS[status].label}</span></button>`;
}
function saveBatchQuick(){
  const input = document.getElementById('batchNumbers');
  const raw = input ? input.value : '';
  const nums = Array.from(new Set(String(raw).split(/[^0-9]+/).map(normalizeNumber).filter(Boolean)));
  if(!nums.length){ toast('Escribí al menos un número.', 'warn'); return; }
  const status = state.batchStatus || 'have';
  nums.forEach(n => addOrUpdateSticker({ number:n, status, repeatedCount:1, country:'general', countryName:'' }));
  state.countryFilter='all'; state.search=''; state.countrySearch='';
  haptic('success');
  toast(`Guardé ${nums.length} figuritas como ${STATUS[status].label}.`, 'success');
  state.view='album'; state.albumFilter=status; render();
}

async function startCamera(manual=false){
  if(state.view !== 'scanner') return;
  let video = document.getElementById('video');
  if(!video) return;

  // Si ya hay stream, puede haberse perdido al re-renderizar. Re-adjuntar siempre.
  if(state.scannerStream && !manual){
    attachCameraStream();
    return;
  }
  if(state.cameraStarting) return;

  state.cameraStarting = true;
  state.cameraError = '';

  try{
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      throw new Error('Este navegador no permite usar cámara desde esta pantalla.');
    }

    if(state.scannerStream){
      state.scannerStream.getTracks().forEach(t=>t.stop());
      state.scannerStream = null;
    }

    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.scannerStream = stream;
    state.cameraStarting = false;
    state.cameraError = '';
    state.torchOn = false;

    // Muy importante: después del permiso puede haber habido un render.
    attachCameraStream();
  }catch(e){
    state.cameraStarting = false;
    state.cameraError = 'Permiso de cámara bloqueado o no disponible. Tocá “Activar cámara” o cargá manual.';
    const videoNow = document.getElementById('video');
    if(videoNow) videoNow.srcObject = null;
    render();
  }
}
function attachCameraStream(){
  if(state.view !== 'scanner' || !state.scannerStream) return;
  const video = document.getElementById('video');
  if(!video) return;
  if(video.srcObject !== state.scannerStream) video.srcObject = state.scannerStream;
  video.setAttribute('playsinline', 'true');
  video.setAttribute('autoplay', 'true');
  video.muted = true;
  const playPromise = video.play();
  if(playPromise && typeof playPromise.catch === 'function') playPromise.catch(()=>{});
}
function stopCamera(){
  stopAutoScan();
  if(state.scannerStream){ state.scannerStream.getTracks().forEach(t=>t.stop()); state.scannerStream=null; }
  state.cameraStarting = false;
  state.torchOn = false;
}
function startAutoScan(){
  // Desactivado: las figuritas no se comportan como QR. Ahora sacamos foto a demanda.
  stopAutoScan();
}
function stopAutoScan(){
  if(state.autoScanTimer){ clearInterval(state.autoScanTimer); state.autoScanTimer=null; }
}
async function scanFrame(manualTap=false){
  if(state.scanBusy) return;
  const video = document.getElementById('video');
  if(!video || !video.videoWidth){
    startCamera(true);
    toast('Activando cámara. Tocá el recuadro de nuevo en unos segundos.', 'warn');
    return;
  }
  state.scanBusy = true;
  toast('Mejorando imagen...', 'warn');
  try{
    const image = captureStickerImage(video);
    state.autoScanPaused = true;
    state.scanCandidate = {
      number: '',
      player: '',
      country: 'general',
      countryName: '',
      image,
      rawText: ''
    };
    toast('Foto lista.', 'success');
    haptic('success');
  }catch(e){
    toast('No pude sacar la foto. Probá de nuevo o cargá manual.', 'warn');
  }
  state.scanBusy = false;
  render();
  setTimeout(startCamera,50);
}

function getCenteredStickerCrop(canvas){
  const ratio = 3 / 4;
  const w = canvas.width;
  const h = canvas.height;

  // V30: recorte menos agresivo. Antes se ampliaba demasiado y cortaba la figurita.
  // Mantiene formato de figurita, pero deja aire para que entre completa en Android/iPhone.
  let cropW = Math.floor(w * 0.78);
  let cropH = Math.floor(cropW / ratio);

  if(cropH > h * 0.92){
    cropH = Math.floor(h * 0.92);
    cropW = Math.floor(cropH * ratio);
  }

  const x = Math.max(0, Math.floor((w - cropW) / 2));
  const y = Math.max(0, Math.floor((h - cropH) / 2));
  return { x, y, w: cropW, h: cropH };
}

function captureStickerImage(video){
  const vw=video.videoWidth, vh=video.videoHeight;
  if(!vw || !vh) throw new Error('Video sin dimensiones');

  // V31: captura central estable para Android/iPhone.
  // La figurita debe quedar en el marco; luego intentamos recortarla automáticamente.
  const targetRatio = 3 / 4;
  let ch = Math.floor(vh * .92);
  let cw = Math.floor(ch * targetRatio);
  if(cw > vw * .94){ cw = Math.floor(vw * .94); ch = Math.floor(cw / targetRatio); }
  const sx = Math.max(0, Math.floor((vw-cw)/2));
  const sy = Math.max(0, Math.floor((vh-ch)/2));

  const tmp=document.createElement('canvas');
  tmp.width=1500;
  tmp.height=Math.round(1500 * ch / cw);
  const tctx=tmp.getContext('2d', { willReadFrequently:true });
  tctx.imageSmoothingEnabled = true;
  tctx.imageSmoothingQuality = 'high';
  tctx.filter='contrast(1.08) brightness(1.03) saturate(1.08)';
  tctx.drawImage(video,sx,sy,cw,ch,0,0,tmp.width,tmp.height);

  // V35: fondo generado + recorte estable. No zoom agresivo ni fondo real como marco.
  let detected = detectDarkStickerBounds(tmp) || detectStickerBounds(tmp);
  let box = detected ? expandBox(detected, tmp.width, tmp.height, .055) : getCenteredStickerCrop(tmp);
  box = forceTightStickerCrop(box, tmp.width, tmp.height);

  const c=document.createElement('canvas');
  c.width=1080;
  c.height=1480;
  const ctx=c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  drawWorldCupBackground(ctx,c.width,c.height);

  const S = c.width / 760;
  const cardX=52*S, cardY=50*S, cardW=c.width-104*S, cardH=c.height-100*S;
  roundRect(ctx,cardX,cardY,cardW,cardH,48*S);
  const cardGrad = ctx.createLinearGradient(cardX,cardY,cardX+cardW,cardY+cardH);
  cardGrad.addColorStop(0,'rgba(255,241,168,.24)');
  cardGrad.addColorStop(.45,'rgba(255,255,255,.055)');
  cardGrad.addColorStop(1,'rgba(122,18,48,.22)');
  ctx.fillStyle=cardGrad;
  ctx.fill();
  ctx.strokeStyle='rgba(255,224,138,.95)';
  ctx.lineWidth=6*S;
  ctx.stroke();

  // Fondo de foto limpio: NO se usa el fondo del lugar.
  const photoX=96*S, photoY=158*S, photoW=c.width-192*S, photoH=780*S;
  roundRect(ctx,photoX-14*S,photoY-14*S,photoW+28*S,photoH+28*S,42*S);
  ctx.fillStyle='rgba(5,7,13,.72)';
  ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.16)';
  ctx.lineWidth=2*S;
  ctx.stroke();

  ctx.save();
  roundRect(ctx,photoX,photoY,photoW,photoH,34*S);
  ctx.clip();

  // Fondo sólido/estadio abstracto para que solo importe la figurita.
  const bgGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  bgGrad.addColorStop(0, '#061126');
  bgGrad.addColorStop(.48, '#0d2d68');
  bgGrad.addColorStop(1, '#4b1224');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Patrón sutil tipo cancha/álbum, sin usar la mesa/pared original.
  ctx.save();
  ctx.globalAlpha=.18;
  ctx.strokeStyle='#FFE08A';
  ctx.lineWidth=3*S;
  for(let y=photoY+70*S; y<photoY+photoH; y+=82*S){
    ctx.beginPath(); ctx.moveTo(photoX+28*S,y); ctx.lineTo(photoX+photoW-28*S,y-34*S); ctx.stroke();
  }
  ctx.globalAlpha=.13;
  ctx.beginPath(); ctx.arc(photoX+photoW*.82, photoY+photoH*.22, 105*S, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(photoX+photoW*.18, photoY+photoH*.84, 92*S, 0, Math.PI*2); ctx.stroke();
  ctx.restore();

  // Luz central detrás de la figurita.
  const haloBg = ctx.createRadialGradient(photoX+photoW/2, photoY+photoH*.48, 20*S, photoX+photoW/2, photoY+photoH*.48, photoW*.58);
  haloBg.addColorStop(0, 'rgba(255,241,168,.20)');
  haloBg.addColorStop(1, 'rgba(255,241,168,0)');
  ctx.fillStyle=haloBg;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // La figurita se dibuja sobre fondo generado. El recorte intenta volver transparente el fondo real.
  const cutout = createForegroundCutout(tmp, box);
  const srcRatio = cutout.width / cutout.height;
  const maxW = photoW * .84;
  const maxH = photoH * .84;
  let stickerW=maxW, stickerH=maxH;
  if(srcRatio > maxW/maxH){ stickerH = stickerW / srcRatio; }
  else { stickerW = stickerH * srcRatio; }
  const stickerX = photoX + (photoW-stickerW)/2;
  const stickerY = photoY + (photoH-stickerH)/2;

  // Base clara de contraste detrás de la figurita, no es fondo real.
  const basePad = 16*S;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.64)';
  ctx.shadowBlur = 38*S;
  ctx.shadowOffsetY = 22*S;
  const plateGrad = ctx.createLinearGradient(stickerX, stickerY, stickerX, stickerY+stickerH);
  plateGrad.addColorStop(0,'rgba(255,255,255,.12)');
  plateGrad.addColorStop(1,'rgba(0,0,0,.22)');
  ctx.fillStyle = plateGrad;
  roundRect(ctx, stickerX-basePad, stickerY-basePad, stickerW+basePad*2, stickerH+basePad*2, 26*S);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.filter='contrast(1.08) brightness(1.04) saturate(1.10)';
  ctx.drawImage(cutout, 0, 0, cutout.width, cutout.height, stickerX, stickerY, stickerW, stickerH);
  ctx.restore();

  roundRect(ctx, stickerX-basePad, stickerY-basePad, stickerW+basePad*2, stickerH+basePad*2, 26*S);
  ctx.strokeStyle='rgba(255,255,255,.30)';
  ctx.lineWidth=2*S;
  ctx.stroke();

  ctx.restore();

  roundRect(ctx,photoX,photoY,photoW,photoH,34*S);
  ctx.strokeStyle='rgba(255,224,138,.60)';
  ctx.lineWidth=3*S;
  ctx.stroke();

  // Sello sutil de la app, sin textos grandes que molesten la foto.
  const bandY = 1018*S;
  roundRect(ctx,108*S,bandY,544*S,64*S,24*S);
  ctx.fillStyle='rgba(5,7,13,.46)';
  ctx.fill();
  ctx.strokeStyle='rgba(255,224,138,.22)';
  ctx.lineWidth=2*S;
  ctx.stroke();
  ctx.fillStyle='rgba(255,224,138,.92)';
  ctx.font=`900 ${22*S}px Inter, Arial`;
  ctx.fillText('FiguScan Mundial',136*S,bandY+40*S);

  const shine=ctx.createLinearGradient(0,0,c.width,c.height);
  shine.addColorStop(0,'rgba(255,255,255,.20)');
  shine.addColorStop(.18,'rgba(255,255,255,0)');
  shine.addColorStop(.58,'rgba(255,255,255,.08)');
  shine.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=shine;
  roundRect(ctx,cardX+8*S,cardY+8*S,cardW-16*S,cardH-16*S,42*S);
  ctx.fill();

  return c.toDataURL('image/jpeg', .96);
}


function forceTightStickerCrop(box, maxW, maxH){
  // V36: recorte estable. No se agranda de manera agresiva.
  // Buscamos el centro del cromo y dejamos un margen moderado para no cortar jugador/número.
  const targetRatio = 0.70; // ancho / alto aproximado de una figurita.
  let cx = box.x + box.w / 2;
  let cy = box.y + box.h / 2;
  const boxRatio = box.w / Math.max(1, box.h);

  // Si el detector agarró demasiado entorno, volvemos al centro del marco de cámara.
  const looksTooWide = boxRatio > 0.92 || box.w > maxW * 0.70 || box.h > maxH * 0.92;
  if(looksTooWide){
    cx = maxW / 2;
    cy = maxH / 2;
  }

  let h = looksTooWide ? maxH * 0.74 : box.h * 1.04;
  let w = h * targetRatio;

  // Si el ancho detectado es razonable, lo respetamos sin pasarnos.
  if(!looksTooWide){
    w = Math.max(w, box.w * 1.02);
    h = w / targetRatio;
  }

  // Límites: suficiente zoom para quitar fondo, pero sin cortar demasiado.
  w = Math.min(w, maxW * 0.58);
  h = Math.min(h, maxH * 0.80);
  w = Math.max(w, maxW * 0.42);
  h = Math.max(h, w / targetRatio);

  let x = Math.round(cx - w / 2);
  let y = Math.round(cy - h / 2);
  x = Math.max(0, Math.min(Math.round(maxW - w), x));
  y = Math.max(0, Math.min(Math.round(maxH - h), y));
  return { x, y, w: Math.round(w), h: Math.round(h) };
}

function createForegroundCutout(sourceCanvas, box){
  // V36: intenta quitar el fondo real que rodea a la figurita.
  // Es un recorte local por color de borde + flood-fill desde los bordes.
  const sw = Math.max(1, Math.round(box.w));
  const sh = Math.max(1, Math.round(box.h));
  const cut = document.createElement('canvas');
  cut.width = sw;
  cut.height = sh;
  const ctx = cut.getContext('2d', { willReadFrequently:true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, box.x, box.y, box.w, box.h, 0, 0, sw, sh);

  const img = ctx.getImageData(0,0,sw,sh);
  const data = img.data;

  // Muestras de color del borde del recorte: eso normalmente es mesa/pared/fondo real.
  const samples = [];
  const sample = (x,y)=>{
    x=Math.max(0,Math.min(sw-1,x)); y=Math.max(0,Math.min(sh-1,y));
    const i=(y*sw+x)*4;
    samples.push([data[i],data[i+1],data[i+2]]);
  };
  const step = Math.max(4, Math.round(Math.min(sw,sh)/36));
  for(let x=0;x<sw;x+=step){ sample(x,0); sample(x,sh-1); }
  for(let y=0;y<sh;y+=step){ sample(0,y); sample(sw-1,y); }

  const groups = [[],[],[],[]];
  samples.forEach((s,idx)=>groups[idx%4].push(s));
  const avgs = groups.filter(g=>g.length).map(g=>{
    const sum=g.reduce((a,c)=>[a[0]+c[0],a[1]+c[1],a[2]+c[2]],[0,0,0]);
    return [sum[0]/g.length,sum[1]/g.length,sum[2]/g.length];
  });
  const allAvg = samples.reduce((a,c)=>[a[0]+c[0],a[1]+c[1],a[2]+c[2]],[0,0,0]).map(v=>v/Math.max(1,samples.length));
  avgs.push(allAvg);

  const dist=(r,g,b,c)=>Math.hypot(r-c[0],g-c[1],b-c[2]);
  const removable = new Uint8Array(sw*sh);
  for(let y=0;y<sh;y++){
    for(let x=0;x<sw;x++){
      const i=(y*sw+x)*4;
      const r=data[i], g=data[i+1], b=data[i+2];
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      const sat=max-min;
      const luma=.299*r+.587*g+.114*b;
      const d = Math.min(...avgs.map(c=>dist(r,g,b,c)));
      // Color parecido al borde = fondo. También sacamos zonas muy planas cercanas al borde.
      removable[y*sw+x] = (d < 58 || (d < 76 && sat < 28) || (luma > 232 && sat < 20 && d < 92)) ? 1 : 0;
    }
  }

  // Flood fill desde los bordes: solo elimina el fondo conectado con el exterior.
  const bg = new Uint8Array(sw*sh);
  const qx = new Int32Array(sw*sh);
  const qy = new Int32Array(sw*sh);
  let head=0, tail=0;
  const push=(x,y)=>{
    if(x<0||x>=sw||y<0||y>=sh) return;
    const k=y*sw+x;
    if(bg[k] || !removable[k]) return;
    bg[k]=1; qx[tail]=x; qy[tail]=y; tail++;
  };
  for(let x=0;x<sw;x++){ push(x,0); push(x,sh-1); }
  for(let y=0;y<sh;y++){ push(0,y); push(sw-1,y); }
  while(head<tail){
    const x=qx[head], y=qy[head]; head++;
    push(x+1,y); push(x-1,y); push(x,y+1); push(x,y-1);
  }

  // Limpieza de alfa. Si el detector falló y pretende borrar casi todo, no usamos recorte transparente.
  let removed=0;
  for(let i=0;i<bg.length;i++) if(bg[i]) removed++;
  const ratio = removed / Math.max(1,bg.length);
  if(ratio > .06 && ratio < .74){
    for(let y=0;y<sh;y++){
      for(let x=0;x<sw;x++){
        const k=y*sw+x;
        if(!bg[k]) continue;
        const i=k*4;
        data[i+3]=0;
      }
    }
    // Suavizado simple en el borde del corte.
    for(let y=1;y<sh-1;y++){
      for(let x=1;x<sw-1;x++){
        const k=y*sw+x;
        if(bg[k]) continue;
        const touches = bg[k-1]+bg[k+1]+bg[k-sw]+bg[k+sw];
        if(touches){ data[k*4+3]=225; }
      }
    }
    ctx.putImageData(img,0,0);
  }
  return cut;
}

function detectDarkStickerBounds(canvas){
  const ctx=canvas.getContext('2d', { willReadFrequently:true });
  const w=canvas.width, h=canvas.height;
  const data=ctx.getImageData(0,0,w,h).data;
  const step=6;
  const gw=Math.ceil(w/step), gh=Math.ceil(h/step);
  const mask=new Uint8Array(gw*gh);
  const marginX=w*.08, marginY=h*.06;
  for(let gy=0; gy<gh; gy++){
    const y=Math.min(h-1, gy*step);
    for(let gx=0; gx<gw; gx++){
      const x=Math.min(w-1, gx*step);
      if(x<marginX || x>w-marginX || y<marginY || y>h-marginY) continue;
      const i=(y*w+x)*4;
      const r=data[i], g=data[i+1], b=data[i+2];
      const luma=.299*r+.587*g+.114*b;
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      // Buscamos principalmente borde negro/oscuro de la figurita.
      if(luma < 88 && (max-min) < 95) mask[gy*gw+gx]=1;
    }
  }
  const seen=new Uint8Array(gw*gh);
  const dirs=[1,-1,gw,-gw,gw+1,gw-1,-gw+1,-gw-1];
  const stack=[];
  let best=null;
  const cx=w/2, cy=h/2;
  for(let idx=0; idx<mask.length; idx++){
    if(!mask[idx] || seen[idx]) continue;
    seen[idx]=1; stack.length=0; stack.push(idx);
    let minGx=gw, minGy=gh, maxGx=0, maxGy=0, area=0;
    while(stack.length){
      const cur=stack.pop();
      const gx=cur%gw, gy=Math.floor(cur/gw);
      area++;
      if(gx<minGx) minGx=gx; if(gx>maxGx) maxGx=gx;
      if(gy<minGy) minGy=gy; if(gy>maxGy) maxGy=gy;
      for(const d of dirs){
        const ni=cur+d;
        if(ni<0 || ni>=mask.length || seen[ni] || !mask[ni]) continue;
        const ngx=ni%gw;
        if(Math.abs(ngx-gx)>1) continue;
        seen[ni]=1; stack.push(ni);
      }
    }
    const bx=minGx*step, by=minGy*step, bw=(maxGx-minGx+1)*step, bh=(maxGy-minGy+1)*step;
    const ratio=bw/bh;
    if(area<40 || bw<w*.18 || bh<h*.25 || ratio<.48 || ratio>.95) continue;
    const compCx=bx+bw/2, compCy=by+bh/2;
    const dist=Math.hypot((compCx-cx)/w, (compCy-cy)/h);
    if(dist>.32) continue;
    const score=area * (1.35-dist*2.1);
    if(!best || score>best.score) best={x:bx,y:by,w:bw,h:bh,score};
  }
  return best ? {x:best.x,y:best.y,w:best.w,h:best.h} : null;
}

function detectStickerBounds(canvas){
  const ctx=canvas.getContext('2d', { willReadFrequently:true });
  const w=canvas.width, h=canvas.height;
  const step=7;
  const gw=Math.ceil(w/step), gh=Math.ceil(h/step);
  const data=ctx.getImageData(0,0,w,h).data;
  const mask=new Uint8Array(gw*gh);

  // Ignoramos bordes extremos. La figurita debería estar dentro del marco central.
  const marginX=w*.06, marginY=h*.04;
  for(let gy=0; gy<gh; gy++){
    const y=Math.min(h-1, gy*step);
    for(let gx=0; gx<gw; gx++){
      const x=Math.min(w-1, gx*step);
      if(x<marginX || x>w-marginX || y<marginY || y>h-marginY) continue;
      const i=(y*w+x)*4;
      const r=data[i], g=data[i+1], b=data[i+2];
      const luma=.299*r+.587*g+.114*b;
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      const sat=max-min;
      // Bordes negros de la figurita + colores fuertes del cromo.
      const salient = (luma < 92) || (sat > 58 && luma < 235);
      if(salient) mask[gy*gw+gx]=1;
    }
  }

  const seen=new Uint8Array(gw*gh);
  let best=null;
  const cx=w/2, cy=h/2;
  const stack=[];
  const dirs=[1,-1,gw,-gw,gw+1,gw-1,-gw+1,-gw-1];

  for(let idx=0; idx<mask.length; idx++){
    if(!mask[idx] || seen[idx]) continue;
    seen[idx]=1; stack.length=0; stack.push(idx);
    let minGx=gw, minGy=gh, maxGx=0, maxGy=0, area=0;
    while(stack.length){
      const cur=stack.pop();
      const gx=cur%gw, gy=Math.floor(cur/gw);
      area++;
      if(gx<minGx) minGx=gx; if(gx>maxGx) maxGx=gx;
      if(gy<minGy) minGy=gy; if(gy>maxGy) maxGy=gy;
      for(const d of dirs){
        const ni=cur+d;
        if(ni<0 || ni>=mask.length || seen[ni] || !mask[ni]) continue;
        const ngx=ni%gw;
        if(Math.abs(ngx-gx)>1) continue;
        seen[ni]=1; stack.push(ni);
      }
    }
    const bx=minGx*step, by=minGy*step, bw=(maxGx-minGx+1)*step, bh=(maxGy-minGy+1)*step;
    if(area<28 || bw<w*.16 || bh<h*.18) continue;
    const compCx=bx+bw/2, compCy=by+bh/2;
    const dist=Math.hypot((compCx-cx)/w, (compCy-cy)/h);
    const centerBoost=Math.max(0, 1.15-dist*2.2);
    const shapePenalty = (bh/bw < 1.05 || bh/bw > 2.4) ? .55 : 1;
    const score=area * (1+centerBoost) * shapePenalty;
    if(!best || score>best.score) best={x:bx,y:by,w:bw,h:bh,score};
  }

  if(!best) return null;
  return {x:best.x,y:best.y,w:best.w,h:best.h};
}

function expandBox(box, maxW, maxH, pct=.06){
  const mx=box.w*pct, my=box.h*pct;
  const x=Math.max(0, Math.floor(box.x-mx));
  const y=Math.max(0, Math.floor(box.y-my));
  const r=Math.min(maxW, Math.ceil(box.x+box.w+mx));
  const b=Math.min(maxH, Math.ceil(box.y+box.h+my));
  return {x,y,w:r-x,h:b-y};
}

function drawWorldCupBackground(ctx,w,h){
  const g=ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'#05070d');
  g.addColorStop(.34,'#101b35');
  g.addColorStop(.68,'#401021');
  g.addColorStop(1,'#080b14');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);

  ctx.save();
  ctx.globalAlpha=.22;
  ctx.strokeStyle='#D4AF37';
  ctx.lineWidth=18;
  ctx.beginPath(); ctx.arc(w*.83,h*.16,185,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.16,h*.84,145,0,Math.PI*2); ctx.stroke();
  ctx.globalAlpha=.13;
  ctx.lineWidth=6;
  for(let y=90;y<h;y+=78){ ctx.beginPath(); ctx.moveTo(-60,y); ctx.lineTo(w+80,y-48); ctx.stroke(); }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha=.16;
  ctx.strokeStyle='#FFF1A8';
  ctx.lineWidth=10;
  ctx.lineCap='round';
  roundRect(ctx,w*.38,h*.08,w*.24,h*.13,22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.50,h*.21); ctx.lineTo(w*.50,h*.30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.42,h*.32); ctx.lineTo(w*.58,h*.32); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function cropVideoCenter(video){
  const vw=video.videoWidth, vh=video.videoHeight;
  const cw = Math.floor(vw*.82), ch = Math.floor(vh*.62);
  const sx = Math.floor((vw-cw)/2), sy = Math.floor((vh-ch)/2);
  const c=document.createElement('canvas'); c.width=1100; c.height=Math.round(1100*ch/cw);
  const ctx=c.getContext('2d');
  ctx.filter='contrast(1.75) brightness(1.12) grayscale(1)';
  ctx.drawImage(video,sx,sy,cw,ch,0,0,c.width,c.height);
  return c.toDataURL('image/png');
}
function analyzeStickerText(text){
  const clean = String(text||'').replace(/[|_~]/g,' ').replace(/\s+/g,' ').trim();
  const number = pickNumber(clean);
  const country = pickCountry(clean);
  const player = pickPlayer(text, country.countryName);
  return { number, player, ...country };
}
function pickNumber(text){
  const m = String(text||'').match(/\b\d{1,4}\b/g);
  if(!m || !m.length) return '';
  const nums = m.map(Number).filter(n=>n>0 && n<1000);
  if(!nums.length) return '';
  nums.sort((a,b)=>String(a).length-String(b).length || a-b);
  return String(nums[0]);
}
function pickCountry(text){
  const q = normalizeText(text);
  for(const c of COUNTRIES){
    const fields = [c.name, c.short, ...(c.aliases || [])];
    if(fields.some(v => normalizeText(v) && q.includes(normalizeText(v)))) return { country:c.id, countryName:c.name };
  }
  return { country:'general', countryName:'' };
}
function pickPlayer(text, countryName=''){
  const bad = new Set(['FIFA','WORLD','CUP','QATAR','RUSSIA','PANINI','STICKER','FIGUSCAN','GENERAL', normalizeText(countryName).toUpperCase()]);
  const lines = String(text||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const candidates = lines.map(line=>line.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]/g,' ').replace(/\s+/g,' ').trim())
    .filter(line=>line.length>=4 && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(line))
    .filter(line=>!bad.has(line.toUpperCase()))
    .filter(line=>!COUNTRIES.some(c=>normalizeText(line)===normalizeText(c.name) || normalizeText(line)===normalizeText(c.short)));
  candidates.sort((a,b)=>b.length-a.length);
  return candidates[0] || '';
}
function friendsScreen(){
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'repeated'})">Repetidas</button>`)}
    <section class="hero"><div class="logo">${icons.users}</div><h1>Cambios con amigos</h1><p>Por ahora compartí tus listas por WhatsApp. La comparación automática puede sumarse después con usuarios en nube.</p></section>
    <section class="section"><h2>Rápido y simple</h2><p class="muted">Compartí “Solo repetidas” o “Solo me faltan”. Tu amigo te responde con lo que tiene.</p><button class="btn btn-primary full" onclick="setView('share')">${icons.share} Ir a compartir</button></section>
  </main>`;
}

function shareScreen(){
  const msg = buildShareMessage(state.shareMode);
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'all'})">Mi álbum</button>`)}
    <section class="hero"><div class="logo">${icons.share}</div><h1>Compartir por WhatsApp</h1><p>Elegí si enviás todo el resumen o solo una parte del álbum.</p></section>
    <section class="section">
      <div class="section-title"><h2>Elegí qué enviar</h2></div>
      <div class="share-options">
        ${shareOption('summary','Resumen completo',icons.list)}
        ${shareOption('have','Solo tengo',icons.check)}
        ${shareOption('missing','Solo me faltan',icons.x)}
        ${shareOption('repeated','Solo repetidas',icons.repeat)}
      </div>
    </section>
    <section class="section">
      <div class="section-title"><h2>Vista previa</h2><span class="muted">mensaje</span></div>
      <div class="preview">${escapeHtml(msg)}</div>
      <div class="share-actions">
        <button class="btn btn-primary full" onclick="openWhatsApp()">${icons.whatsapp} Enviar por WhatsApp</button>
        <button class="btn btn-gold full" onclick="shareImage()">${icons.image} Compartir imagen visual</button>
        <button class="btn btn-ghost full" onclick="copyMessage()">${icons.copy} Copiar mensaje</button>
      </div>
      <p class="tiny">WhatsApp por link solo permite texto. La opción “imagen visual” genera una placa con logo y recuadro; si tu celular lo permite, podés compartirla por WhatsApp desde el menú de compartir.</p>
    </section>
  </main>`;
}
function shareOption(mode,label,icon){ return `<button class="share-card ${state.shareMode===mode?'active':''}" onclick="state.shareMode='${mode}'; render()">${icon}<br>${label}</button>`; }
function stickerText(s){ const c = countryById(stickerCountry(s)); return `${c.flag} *${c.name}* · N° ${s.number}${s.player?` · *${s.player}*`:''}`; }
function listFor(status){
  const arr = state.stickers.filter(s=>s.status===status).sort(byNumber);
  if(status==='repeated') return arr.length ? arr.map(s=>`${stickerText(s)} x${s.repeatedCount||1}`).join('\n') : 'Sin figuritas cargadas';
  return arr.length ? arr.map(s=>stickerText(s)).join('\n') : 'Sin figuritas cargadas';
}

function buildShareMessage(mode){
  const header = `🏆 *FIGUSCAN MUNDIAL*
━━━━━━━━━━━━━━━━━━━━`;
  const footer = `

Checkeá mi álbum acá:
${APP_URL}`;
  if(mode==='have') return `${header}

✅ *TENGO PARA CAMBIAR O MOSTRAR:*
${listFor('have')}

¿Te sirve alguna? Avisame y cambiamos. ⚽${footer}`;
  if(mode==='missing') return `${header}

❌ *ME FALTAN ESTAS PARA COMPLETAR:*
${listFor('missing')}

¿Tenés alguna repetida? Avisame y hacemos cambio. 🏟️${footer}`;
  if(mode==='repeated') return `${header}

🔁 *MIS REPETIDAS PARA CAMBIAR:*
${listFor('repeated')}

¿Necesitás alguna? Vamos que llenamos el álbum. ⚽${footer}`;
  return `${header}

✅ *TENGO:*
${listFor('have')}

❌ *ME FALTAN:*
${listFor('missing')}

🔁 *REPETIDAS:*
${listFor('repeated')}

Organizado con *FiguScan Mundial*.${footer}`;
}

function buildSingleStickerMessage(s){
  const c = countryById(stickerCountry(s));
  const head = `🏆 *FiguScan Mundial*
━━━━━━━━━━━━━━━━━━━━`;
  const figu = `${c.flag} *${c.name}* · N° ${s.number}${s.player?` · *${s.player}*`:''}`;
  const footer = `

Mi álbum está en FiguScan:
${APP_URL}`;
  if(s.status==='missing') return `${head}
¡Che! Me falta esta para el álbum:
${figu}

¿La tenés repetida? Avisame y cambiamos. ⚽${footer}`;
  if(s.status==='repeated') return `${head}
Tengo repetida esta figurita:
${figu} x${s.repeatedCount||1}

¿La necesitás? Hagamos cambio. 🏆${footer}`;
  return `${head}
Tengo esta figurita:
${figu}

¿Te sirve para cambiar? ⚽${footer}`;
}

function openWhatsApp(){ window.open(`https://wa.me/?text=${encodeURIComponent(buildShareMessage(state.shareMode))}`,'_blank'); }
async function shareSingle(id){
  const s = state.stickers.find(x=>x.id===id); if(!s) return;
  const text = buildSingleStickerMessage(s);
  if(s.image){
    try{
      const file = dataUrlToFile(s.image, `figuscan-${s.number || 'figurita'}.jpg`);
      if(navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({ title:'FiguScan Mundial', text, files:[file] });
        return;
      }
    }catch(e){}
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
  if(s.image) toast('Si WhatsApp no adjunta la imagen, usá Compartir desde la galería.', 'warn');
}
function dataUrlToFile(dataUrl, filename){
  const arr = dataUrl.split(',');
  const mime = (arr[0].match(/:(.*?);/) || [,'image/jpeg'])[1];
  const bin = atob(arr[1]);
  const u8 = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
  return new File([u8], filename, {type:mime});
}
async function copyMessage(){
  await navigator.clipboard?.writeText(buildShareMessage(state.shareMode));
  toast('Mensaje copiado.');
}
async function shareImage(){
  const blob = await makeShareImage(state.shareMode);
  const file = new File([blob], 'figuscan-resumen.png', {type:'image/png'});
  const text = buildShareMessage(state.shareMode);
  try{
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({title:'FiguScan Mundial', text:'Mi álbum FiguScan', files:[file]});
      return;
    }
  }catch(e){}
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='figuscan-resumen.png'; a.click();
  toast('Descargué la imagen. Si no abre WhatsApp, enviá la imagen desde tu galería.', 'warn');
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}
function makeShareImage(mode){
  return new Promise(resolve=>{
    const c=document.createElement('canvas'); c.width=1080; c.height=1350;
    const ctx=c.getContext('2d');
    const grad=ctx.createLinearGradient(0,0,1080,1350); grad.addColorStop(0,'#061947'); grad.addColorStop(.55,'#0B2E78'); grad.addColorStop(1,'#18A957'); ctx.fillStyle=grad; ctx.fillRect(0,0,1080,1350);
    ctx.globalAlpha=.18; ctx.fillStyle='#FFD96A'; ctx.beginPath(); ctx.arc(880,180,260,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(160,1160,230,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    rounded(ctx,70,70,940,1210,48,'rgba(255,255,255,.94)');
    rounded(ctx,110,110,120,120,32,'#FFD96A');
    ctx.strokeStyle='#061947'; ctx.lineWidth=12; ctx.strokeRect(142,144,56,52); ctx.beginPath(); ctx.moveTo(170,196);ctx.lineTo(170,220);ctx.stroke();ctx.beginPath();ctx.moveTo(135,232);ctx.lineTo(205,232);ctx.stroke();
    ctx.fillStyle='#061947'; ctx.font='900 64px Arial'; ctx.fillText('FiguScan Mundial',260,160); ctx.font='700 34px Arial'; ctx.fillStyle='#526071'; ctx.fillText('Resumen para intercambiar figuritas',260,210);
    ctx.fillStyle='#061947'; ctx.font='900 48px Arial'; let y=310;
    const title = mode==='have'?'Tengo':mode==='missing'?'Me faltan':mode==='repeated'?'Repetidas':'Mi álbum'; ctx.fillText(title,110,y); y+=60;
    const lines = buildShareMessage(mode).replace(/╔.*?╝/s,'').trim().split('\n');
    ctx.font='700 34px Arial'; ctx.fillStyle='#1E293B';
    lines.slice(0,24).forEach(line=>{ if(!line.trim()){ y+=20; return; } ctx.fillText(line.slice(0,42),110,y); y+=46; });
    ctx.fillStyle='#0B2E78'; ctx.font='800 30px Arial'; ctx.fillText('Organizado con FiguScan Mundial',110,1240);
    c.toBlob(resolve,'image/png',.95);
  });
}
function rounded(ctx,x,y,w,h,r,fill){ ctx.fillStyle=fill; ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fill(); }

function bottomNav(){
  const item = (view,label,icon,extra='') => `<button class="nav-item ${extra} ${state.view===view?'active':''}" onclick="setView('${view}')">${icon}<span>${label}</span></button>`;
  return `<nav class="bottom-nav">
    ${item('home','Inicio',icons.home)}
    ${item('scanner','Escanear',icons.scan,'scan')}
    ${item('album','Álbum',icons.album)}
    ${item('friends','Amigos',icons.users)}
    ${item('share','Compartir',icons.share)}
  </nav>`;
}
function openStickerViewer(id){
  state.viewerId = id;
  render();
}
function closeStickerViewer(){
  state.viewerId = null;
  render();
}
function currentViewerList(){
  const list = filteredStickers();
  if(list.some(s=>s.id===state.viewerId)) return list;
  return state.stickers.slice().sort(byNumber);
}
function moveViewer(dir){
  const list = currentViewerList();
  if(!list.length) return;
  let idx = list.findIndex(s=>s.id===state.viewerId);
  if(idx < 0) idx = 0;
  idx = (idx + dir + list.length) % list.length;
  state.viewerId = list[idx].id;
  render();
}
function stickerViewerHtml(){
  if(!state.viewerId) return '';
  const list = currentViewerList();
  const s = list.find(x=>x.id===state.viewerId) || state.stickers.find(x=>x.id===state.viewerId);
  if(!s) return '';
  const idx = Math.max(0, list.findIndex(x=>x.id===s.id));
  const total = Math.max(1, list.length);
  return `<div class="viewer-back" onclick="closeStickerViewer()">
    <div class="viewer-card" onclick="event.stopPropagation()">
      <div class="viewer-top">
        <button class="viewer-close" onclick="closeStickerViewer()">×</button>
        <div><strong>Figurita #${escapeHtml(s.number)}</strong><small>${idx+1} de ${total} en esta sección</small></div>
      </div>
      <div class="viewer-image-wrap ${s.status}">
        ${s.image ? `<img src="${s.image}" alt="Figurita ${escapeHtml(s.number)}">` : `<div class="viewer-placeholder">${icons.trophy}<strong>Sin foto</strong></div>`}
        <button class="viewer-arrow left" onclick="moveViewer(-1)">${icons.chevron}</button>
        <button class="viewer-arrow right" onclick="moveViewer(1)">${icons.chevron}</button>
      </div>
      <div class="viewer-info">
        <span class="status-badge ${s.status}">${statusIcon(s.status)} ${STATUS[s.status].label}${s.status==='repeated'?` x${s.repeatedCount||1}`:''}</span>
        <h3>${escapeHtml(s.player || 'Sin jugador')}</h3>
        <p>${countryById(stickerCountry(s)).flag} ${escapeHtml(countryDisplayName(s))}</p>
      </div>
      <div class="viewer-actions">
        <button class="btn btn-primary" onclick="setView('manual',{editingId:'${s.id}'}); closeStickerViewer()">${icons.edit} Editar</button>
        <button class="btn btn-ghost" onclick="shareSingle('${s.id}')">${icons.whatsapp} WhatsApp</button>
        <button class="btn btn-danger" onclick="deleteSticker('${s.id}'); closeStickerViewer()">${icons.trash} Eliminar</button>
      </div>
    </div>
  </div>`;
}

function modalHtml(){
  if(!state.modal) return '';
  const m = state.modal;
  const extra = m.kind === 'deleteRepeated'
    ? `<div class="delete-qty-box"><span>Cantidad a borrar</span><div class="qty-picker danger"><button onclick="changeDeleteQty(-1)">−</button><strong>${Number(m.qty)||1}</strong><button onclick="changeDeleteQty(1)">+</button></div><button class="btn btn-line mini" onclick="setDeleteAllRepeated()">Borrar todas (${Number(m.maxQty)||1})</button></div>`
    : '';
  return `<div class="modal-back"><div class="modal"><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.text)}</p>${extra}<div class="modal-actions"><button class="btn btn-line" onclick="state.modal=null; render()">${escapeHtml(m.cancel||'Cancelar')}</button><button class="btn ${m.danger?'btn-danger':'btn-primary'}" onclick="confirmModal()">${escapeHtml(m.confirm||'Confirmar')}</button></div></div></div>`;
}
function confirmModal(){ const fn = state.modal?.onConfirm; if(fn) fn(); }
function toastHtml(){ return ''; }
function escapeHtml(str){ return String(str||'').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function render(){
  let screen = '';
  if(state.view==='home') screen = homeScreen();
  if(state.view==='manual') screen = manualScreen();
  if(state.view==='album') screen = albumScreen();
  if(state.view==='scanner') screen = scannerScreen();
  if(state.view==='friends') screen = friendsScreen();
  if(state.view==='share') screen = shareScreen();
  app.innerHTML = `<div class="app">${appTrophyBg()}${screen}${bottomNav()}${stickerViewerHtml()}${modalHtml()}${toastHtml()}</div>`;
  if(state.toast) setTimeout(paintToast, 0);
  if(state.view==='scanner') {
    setTimeout(()=>{
      centerScannerFrame();
      if(state.scannerStream) attachCameraStream();
      else if(!state.cameraError) startCamera(false);
    }, 80);
    setTimeout(centerScannerFrame, 420);
  }
}

window.changeDeleteQty=changeDeleteQty; window.setDeleteAllRepeated=setDeleteAllRepeated; window.confirmDeleteRepeated=confirmDeleteRepeated; window.handleScannerFrameTap=handleScannerFrameTap; window.attachCameraStream=attachCameraStream; window.openStickerViewer=openStickerViewer; window.closeStickerViewer=closeStickerViewer; window.moveViewer=moveViewer; window.removeScanPhoto=removeScanPhoto; window.stepDetectedNumber=stepDetectedNumber; window.selectCountry=selectCountry; window.haptic=haptic; window.setView=setView; window.chooseManualStatus=chooseManualStatus; window.changeQty=changeQty; window.submitManual=submitManual; window.toggleSelect=toggleSelect; window.bulkStatus=bulkStatus; window.bulkDelete=bulkDelete; window.deleteSticker=deleteSticker; window.quickCycle=quickCycle; window.shareSingle=shareSingle; window.openWhatsApp=openWhatsApp; window.copyMessage=copyMessage; window.shareImage=shareImage; window.scanFrame=scanFrame; window.saveDetected=saveDetected; window.saveBatchQuick=saveBatchQuick; window.toggleTorch=toggleTorch; window.startCamera=startCamera; window.retryCamera=retryCamera; window.confirmModal=confirmModal; window.state=state; window.render=render;

if('serviceWorker' in navigator){ navigator.serviceWorker.register('/service-worker.js').catch(()=>{}); }
render();
