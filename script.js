// ===========================
// RATING CATEGORIES
// ===========================

var skiRatingCategories = [
    { id: 'size', name: 'Grootte skigebied', icon: '🏔️' },
    { id: 'descent', name: 'Afdaling naar dal', icon: '⬇️' },
    { id: 'atmosphere', name: 'Sfeer', icon: '🎉' },
    { id: 'pricing', name: 'Prijs skigebied', icon: '💰' },
    { id: 'touring', name: 'Geschikt voor toeren', icon: '🎿' }
];

var accommodationRatingCategories = [
    { id: 'accPrice', name: 'Prijs accommodatie', icon: '💶' },
    { id: 'accQuality', name: 'Kwaliteit accommodatie', icon: '✨' }
];

var allRatingCategories = skiRatingCategories.concat(accommodationRatingCategories);

var accommodationTypes = {
    hotel: { name: 'Hotel', icon: '🏨' },
    appartement: { name: 'Appartement', icon: '🏢' },
    house: { name: 'Huis', icon: '🏠' }
};

// Edit mode tracking
var editingVisitId = null;

// Temporary photo storage for current form
var pendingPhotos = [];

// Map variables
var map = null;
var markers = {};
var mapInitialized = false;

// Filter variables
var currentCountryFilter = 'all';
var currentSearchText = '';


// ===========================
// DATA: ALL SKI REGIONS (Fluid shapes)
// ===========================

var skiRegions = [
    // ==================== AUSTRIA ====================
    { 
        name: "Ski Arlberg", 
        color: "#e91e63", 
        country: "AT",
        area: [
            [47.28, 10.12], [47.26, 10.20], [47.24, 10.28], [47.20, 10.32], 
            [47.14, 10.30], [47.10, 10.28], [47.08, 10.22], [47.10, 10.14], 
            [47.14, 10.10], [47.18, 10.12], [47.22, 10.14], [47.28, 10.12]
        ], 
        info: "Grootste skigebied van Oostenrijk (300+ km piste)" 
    },
    { 
        name: "Zillertal", 
        color: "#9c27b0", 
        country: "AT",
        area: [
            [47.26, 11.62], [47.24, 11.75], [47.22, 11.88], [47.20, 12.02],
            [47.16, 12.06], [47.10, 12.04], [47.04, 11.95], [47.02, 11.80],
            [47.04, 11.65], [47.10, 11.60], [47.18, 11.60], [47.26, 11.62]
        ], 
        info: "Vier grote skigebieden in één dal" 
    },
    { 
        name: "Ötztal", 
        color: "#ff9800", 
        country: "AT",
        area: [
            [47.14, 10.80], [47.12, 10.90], [47.08, 11.00], [47.00, 11.08],
            [46.92, 11.06], [46.84, 11.04], [46.82, 10.95], [46.84, 10.82],
            [46.92, 10.78], [47.02, 10.78], [47.10, 10.80], [47.14, 10.80]
        ], 
        info: "Hoogste skigebieden van Oostenrijk met gletsjers" 
    },
    { 
        name: "Skicircus Saalbach", 
        color: "#00bcd4", 
        country: "AT",
        area: [
            [47.48, 12.52], [47.46, 12.62], [47.44, 12.72], [47.40, 12.78],
            [47.36, 12.76], [47.34, 12.68], [47.35, 12.54], [47.38, 12.50],
            [47.42, 12.48], [47.48, 12.52]
        ], 
        info: "Saalbach-Hinterglemm-Leogang-Fieberbrunn" 
    },
    { 
        name: "Kitzbüheler Alpen", 
        color: "#8bc34a", 
        country: "AT",
        area: [
            [47.48, 12.28], [47.46, 12.36], [47.46, 12.42], [47.44, 12.46],
            [47.40, 12.44], [47.42, 12.36], [47.42, 12.28], [47.44, 12.26],
            [47.48, 12.28]
        ], 
        info: "Legendarische Hahnenkamm afdaling" 
    },
    { 
        name: "Silvretta Arena", 
        color: "#ff5722", 
        country: "AT",
        area: [
            [47.02, 10.24], [47.00, 10.32], [46.98, 10.38], [46.94, 10.42],
            [46.90, 10.38], [46.88, 10.30], [46.90, 10.22], [46.94, 10.20],
            [46.98, 10.22], [47.02, 10.24]
        ], 
        info: "Ischgl en Samnaun (Zwitserland)" 
    },
    { 
        name: "Stubaital", 
        color: "#795548", 
        country: "AT",
        area: [
            [47.12, 11.28], [47.10, 11.38], [47.06, 11.44], [47.00, 11.42],
            [46.96, 11.36], [46.98, 11.26], [47.02, 11.22], [47.08, 11.24],
            [47.12, 11.28]
        ], 
        info: "Stubaier Gletsjer - hoogste van Oostenrijk" 
    },
    { 
        name: "Wilder Kaiser", 
        color: "#607d8b", 
        country: "AT",
        area: [
            [47.54, 12.08], [47.52, 12.18], [47.50, 12.26], [47.46, 12.28],
            [47.42, 12.24], [47.42, 12.14], [47.44, 12.06], [47.48, 12.04],
            [47.54, 12.08]
        ], 
        info: "SkiWelt Wilder Kaiser - Brixental" 
    },
    { 
        name: "Zell am See-Kaprun", 
        color: "#9e9e9e", 
        country: "AT",
        area: [
            [47.36, 12.74], [47.34, 12.82], [47.30, 12.86], [47.24, 12.84],
            [47.20, 12.78], [47.18, 12.68], [47.22, 12.62], [47.28, 12.64],
            [47.34, 12.70], [47.36, 12.74]
        ], 
        info: "Kitzsteinhorn gletsjer" 
    },
    { 
        name: "Gasteinertal", 
        color: "#e91e63", 
        country: "AT",
        area: [
            [47.18, 13.02], [47.16, 13.12], [47.14, 13.20], [47.08, 13.22],
            [47.02, 13.18], [47.00, 13.08], [47.04, 13.00], [47.10, 12.98],
            [47.18, 13.02]
        ], 
        info: "Bad Gastein - historisch kuuroord" 
    },
    { 
        name: "Schladming-Dachstein", 
        color: "#3f51b5", 
        country: "AT",
        area: [
            [47.42, 13.62], [47.40, 13.72], [47.38, 13.82], [47.34, 13.86],
            [47.30, 13.82], [47.28, 13.70], [47.30, 13.60], [47.34, 13.56],
            [47.38, 13.58], [47.42, 13.62]
        ], 
        info: "4 bergen - 1 skipass" 
    },
    { 
        name: "Obertauern", 
        color: "#009688", 
        country: "AT",
        area: [
            [47.28, 13.52], [47.26, 13.58], [47.24, 13.62], [47.20, 13.60],
            [47.18, 13.54], [47.20, 13.48], [47.24, 13.48], [47.28, 13.52]
        ], 
        info: "Sneeuwzekere kom" 
    },
    { 
        name: "Nassfeld", 
        color: "#ff9800", 
        country: "AT",
        area: [
            [46.60, 13.22], [46.58, 13.30], [46.56, 13.36], [46.52, 13.34],
            [46.50, 13.26], [46.52, 13.18], [46.56, 13.18], [46.60, 13.22]
        ], 
        info: "Grootste skigebied van Karinthië" 
    },
    { 
        name: "Montafon", 
        color: "#4caf50", 
        country: "AT",
        area: [
            [47.10, 9.82], [47.08, 9.92], [47.04, 10.00], [46.98, 9.98],
            [46.94, 9.90], [46.96, 9.80], [47.00, 9.76], [47.06, 9.78],
            [47.10, 9.82]
        ], 
        info: "Silvretta Montafon & Golm" 
    },
    { 
        name: "Bregenzerwald", 
        color: "#673ab7", 
        country: "AT",
        area: [
            [47.36, 9.82], [47.34, 9.92], [47.30, 9.98], [47.26, 9.94],
            [47.24, 9.84], [47.26, 9.78], [47.30, 9.76], [47.36, 9.82]
        ], 
        info: "Damüls-Mellau - meest sneeuwzeker" 
    },
    { 
        name: "Serfaus-Fiss-Ladis", 
        color: "#e040fb", 
        country: "AT",
        area: [
            [47.08, 10.58], [47.06, 10.66], [47.02, 10.70], [46.98, 10.68],
            [46.96, 10.60], [46.98, 10.52], [47.02, 10.50], [47.06, 10.52],
            [47.08, 10.58]
        ], 
        info: "Familievriendelijk skigebied (214 km piste)" 
    },
    { 
        name: "Salzburger Sportwelt", 
        color: "#00bfa5", 
        country: "AT",
        area: [
            [47.38, 13.38], [47.36, 13.48], [47.32, 13.52], [47.28, 13.50],
            [47.26, 13.42], [47.28, 13.34], [47.32, 13.32], [47.36, 13.34],
            [47.38, 13.38]
        ], 
        info: "Ski Amadé - Flachau, Wagrain, St. Johann" 
    },

    // ==================== SWITZERLAND ====================
    { 
        name: "Zermatt-Matterhorn", 
        color: "#d32f2f", 
        country: "CH",
        area: [
            [46.08, 7.68], [46.06, 7.76], [46.04, 7.82], [46.00, 7.84],
            [45.96, 7.80], [45.94, 7.72], [45.96, 7.64], [46.00, 7.62],
            [46.04, 7.64], [46.08, 7.68]
        ], 
        info: "Hoogste skigebied van de Alpen met Matterhorn" 
    },
    { 
        name: "Verbier 4 Vallées", 
        color: "#1976d2", 
        country: "CH",
        area: [
            [46.14, 7.18], [46.12, 7.28], [46.08, 7.36], [46.04, 7.38],
            [46.00, 7.34], [45.98, 7.24], [46.00, 7.14], [46.04, 7.10],
            [46.10, 7.12], [46.14, 7.18]
        ], 
        info: "Grootste skigebied van Zwitserland (410+ km)" 
    },
    { 
        name: "St. Moritz-Engadin", 
        color: "#7b1fa2", 
        country: "CH",
        area: [
            [46.56, 9.78], [46.54, 9.88], [46.50, 9.96], [46.44, 9.98],
            [46.40, 9.92], [46.38, 9.82], [46.40, 9.72], [46.46, 9.68],
            [46.52, 9.72], [46.56, 9.78]
        ], 
        info: "Luxueus skigebied met 350 km piste" 
    },
    { 
        name: "Jungfrau Region", 
        color: "#0097a7", 
        country: "CH",
        area: [
            [46.62, 7.88], [46.60, 7.98], [46.56, 8.06], [46.52, 8.04],
            [46.50, 7.96], [46.52, 7.86], [46.56, 7.82], [46.60, 7.84],
            [46.62, 7.88]
        ], 
        info: "Grindelwald, Wengen, Mürren - 213 km piste" 
    },
    { 
        name: "Davos-Klosters", 
        color: "#388e3c", 
        country: "CH",
        area: [
            [46.88, 9.78], [46.86, 9.88], [46.82, 9.94], [46.78, 9.92],
            [46.76, 9.84], [46.78, 9.74], [46.82, 9.70], [46.86, 9.72],
            [46.88, 9.78]
        ], 
        info: "Grootste skigebied van Graubünden (300 km)" 
    },
    { 
        name: "Laax-Flims", 
        color: "#f57c00", 
        country: "CH",
        area: [
            [46.88, 9.22], [46.86, 9.30], [46.82, 9.36], [46.78, 9.34],
            [46.76, 9.26], [46.78, 9.18], [46.82, 9.14], [46.86, 9.16],
            [46.88, 9.22]
        ], 
        info: "Freestyle paradijs met 224 km piste" 
    },
    { 
        name: "Saas-Fee", 
        color: "#c2185b", 
        country: "CH",
        area: [
            [46.14, 7.88], [46.12, 7.94], [46.08, 7.98], [46.04, 7.96],
            [46.02, 7.90], [46.04, 7.84], [46.08, 7.82], [46.12, 7.84],
            [46.14, 7.88]
        ], 
        info: "Autovrij dorp met gletsjerskiën" 
    },
    { 
        name: "Crans-Montana", 
        color: "#512da8", 
        country: "CH",
        area: [
            [46.34, 7.42], [46.32, 7.50], [46.28, 7.54], [46.24, 7.52],
            [46.22, 7.44], [46.24, 7.36], [46.28, 7.34], [46.32, 7.36],
            [46.34, 7.42]
        ], 
        info: "Zonnig plateau met 140 km piste" 
    },
    { 
        name: "Arosa-Lenzerheide", 
        color: "#00796b", 
        country: "CH",
        area: [
            [46.82, 9.64], [46.80, 9.72], [46.76, 9.76], [46.72, 9.74],
            [46.70, 9.66], [46.72, 9.58], [46.76, 9.56], [46.80, 9.58],
            [46.82, 9.64]
        ], 
        info: "225 km piste verbonden door gondel" 
    },
    { 
        name: "Andermatt-Sedrun", 
        color: "#455a64", 
        country: "CH",
        area: [
            [46.68, 8.56], [46.66, 8.64], [46.62, 8.68], [46.58, 8.66],
            [46.56, 8.58], [46.58, 8.50], [46.62, 8.48], [46.66, 8.50],
            [46.68, 8.56]
        ], 
        info: "Grootste skigebied van Centraal-Zwitserland" 
    },

    // ==================== FRANCE ====================
    { 
        name: "Les 3 Vallées", 
        color: "#1565c0", 
        country: "FR",
        area: [
            [45.44, 6.50], [45.42, 6.62], [45.38, 6.72], [45.32, 6.74],
            [45.26, 6.68], [45.24, 6.56], [45.28, 6.44], [45.34, 6.40],
            [45.40, 6.44], [45.44, 6.50]
        ], 
        info: "Grootste skigebied ter wereld (600+ km)" 
    },
    { 
        name: "Paradiski", 
        color: "#c62828", 
        country: "FR",
        area: [
            [45.58, 6.78], [45.56, 6.88], [45.52, 6.94], [45.46, 6.92],
            [45.42, 6.84], [45.44, 6.74], [45.48, 6.70], [45.54, 6.72],
            [45.58, 6.78]
        ], 
        info: "Les Arcs & La Plagne (425 km)" 
    },
    { 
        name: "Espace Killy", 
        color: "#6a1b9a", 
        country: "FR",
        area: [
            [45.48, 6.94], [45.46, 7.02], [45.42, 7.06], [45.38, 7.04],
            [45.36, 6.96], [45.38, 6.88], [45.42, 6.86], [45.46, 6.88],
            [45.48, 6.94]
        ], 
        info: "Tignes & Val d'Isère (300 km)" 
    },
    { 
        name: "Portes du Soleil", 
        color: "#ef6c00", 
        country: "FR",
        area: [
            [46.24, 6.68], [46.22, 6.80], [46.18, 6.88], [46.12, 6.86],
            [46.08, 6.78], [46.10, 6.66], [46.14, 6.60], [46.20, 6.62],
            [46.24, 6.68]
        ], 
        info: "Frankrijk-Zwitserland grensoverschrijdend (650 km)" 
    },
    { 
        name: "Chamonix-Mont Blanc", 
        color: "#2e7d32", 
        country: "FR",
        area: [
            [46.00, 6.82], [45.98, 6.92], [45.94, 6.98], [45.88, 6.96],
            [45.84, 6.88], [45.86, 6.78], [45.90, 6.74], [45.96, 6.76],
            [46.00, 6.82]
        ], 
        info: "Legendarisch off-piste & Vallée Blanche" 
    },
    { 
        name: "Les 2 Alpes", 
        color: "#ad1457", 
        country: "FR",
        area: [
            [45.04, 6.08], [45.02, 6.16], [44.98, 6.20], [44.94, 6.18],
            [44.92, 6.10], [44.94, 6.02], [44.98, 5.98], [45.02, 6.00],
            [45.04, 6.08]
        ], 
        info: "Groot gletsjergebied met 200 km piste" 
    },
    { 
        name: "Alpe d'Huez", 
        color: "#00838f", 
        country: "FR",
        area: [
            [45.14, 6.02], [45.12, 6.12], [45.08, 6.16], [45.02, 6.14],
            [45.00, 6.06], [45.02, 5.96], [45.06, 5.94], [45.12, 5.96],
            [45.14, 6.02]
        ], 
        info: "Zonnigste skigebied van Frankrijk (250 km)" 
    },
    { 
        name: "Serre Chevalier", 
        color: "#5d4037", 
        country: "FR",
        area: [
            [45.00, 6.48], [44.98, 6.58], [44.94, 6.64], [44.88, 6.62],
            [44.84, 6.54], [44.86, 6.44], [44.90, 6.40], [44.96, 6.42],
            [45.00, 6.48]
        ], 
        info: "Grootste skigebied Zuid-Franse Alpen (250 km)" 
    },
    { 
        name: "La Clusaz-Grand Massif", 
        color: "#827717", 
        country: "FR",
        area: [
            [46.00, 6.40], [45.98, 6.50], [45.94, 6.56], [45.88, 6.54],
            [45.84, 6.46], [45.86, 6.36], [45.90, 6.32], [45.96, 6.34],
            [46.00, 6.40]
        ], 
        info: "Flaine & Grand Massif (265 km)" 
    },
    { 
        name: "Megève-Évasion Mont Blanc", 
        color: "#4527a0", 
        country: "FR",
        area: [
            [45.90, 6.58], [45.88, 6.66], [45.84, 6.70], [45.80, 6.68],
            [45.78, 6.60], [45.80, 6.52], [45.84, 6.50], [45.88, 6.52],
            [45.90, 6.58]
        ], 
        info: "Chique skigebied met 445 km piste" 
    },

    // ==================== ITALY ====================
    { 
        name: "Dolomiti Superski", 
        color: "#f44336", 
        country: "IT",
        area: [
            [46.62, 11.72], [46.58, 11.88], [46.52, 12.02], [46.44, 12.06],
            [46.36, 11.98], [46.32, 11.80], [46.36, 11.64], [46.44, 11.58],
            [46.54, 11.62], [46.62, 11.72]
        ], 
        info: "Grootste skikarousel ter wereld (1200+ km)" 
    },
    { 
        name: "Alta Badia", 
        color: "#880e4f", 
        country: "IT",
        area: [
            [46.58, 11.82], [46.56, 11.90], [46.52, 11.94], [46.48, 11.92],
            [46.46, 11.84], [46.48, 11.76], [46.52, 11.74], [46.56, 11.76],
            [46.58, 11.82]
        ], 
        info: "Onderdeel Sella Ronda (130 km)" 
    },
    { 
        name: "Val Gardena", 
        color: "#311b92", 
        country: "IT",
        area: [
            [46.58, 11.68], [46.56, 11.76], [46.52, 11.78], [46.48, 11.76],
            [46.46, 11.68], [46.48, 11.60], [46.52, 11.58], [46.56, 11.60],
            [46.58, 11.68]
        ], 
        info: "Sella Ronda circuit (175 km)" 
    },
    { 
        name: "Madonna di Campiglio", 
        color: "#0d47a1", 
        country: "IT",
        area: [
            [46.26, 10.78], [46.24, 10.86], [46.20, 10.90], [46.16, 10.88],
            [46.14, 10.80], [46.16, 10.72], [46.20, 10.70], [46.24, 10.72],
            [46.26, 10.78]
        ], 
        info: "Skirama Dolomiti (150 km)" 
    },
    { 
        name: "Livigno", 
        color: "#1b5e20", 
        country: "IT",
        area: [
            [46.58, 10.08], [46.56, 10.16], [46.52, 10.20], [46.48, 10.18],
            [46.46, 10.10], [46.48, 10.02], [46.52, 9.98], [46.56, 10.00],
            [46.58, 10.08]
        ], 
        info: "Belastingvrij skiën (115 km)" 
    },
    { 
        name: "Cortina d'Ampezzo", 
        color: "#bf360c", 
        country: "IT",
        area: [
            [46.58, 12.08], [46.56, 12.16], [46.52, 12.20], [46.48, 12.18],
            [46.46, 12.10], [46.48, 12.02], [46.52, 11.98], [46.56, 12.00],
            [46.58, 12.08]
        ], 
        info: "Olympische stad 2026 (120 km)" 
    },
    { 
        name: "Bormio", 
        color: "#4a148c", 
        country: "IT",
        area: [
            [46.50, 10.34], [46.48, 10.42], [46.44, 10.46], [46.40, 10.44],
            [46.38, 10.36], [46.40, 10.28], [46.44, 10.26], [46.48, 10.28],
            [46.50, 10.34]
        ], 
        info: "Stelvio WK piste (50 km)" 
    },
    { 
        name: "Cervinia-Valtournenche", 
        color: "#e65100", 
        country: "IT",
        area: [
            [45.98, 7.58], [45.96, 7.66], [45.92, 7.70], [45.88, 7.68],
            [45.86, 7.60], [45.88, 7.52], [45.92, 7.50], [45.96, 7.52],
            [45.98, 7.58]
        ], 
        info: "Verbonden met Zermatt (360 km totaal)" 
    },
    { 
        name: "Courmayeur", 
        color: "#006064", 
        country: "IT",
        area: [
            [45.82, 6.92], [45.80, 7.00], [45.76, 7.04], [45.72, 7.02],
            [45.70, 6.94], [45.72, 6.86], [45.76, 6.84], [45.80, 6.86],
            [45.82, 6.92]
        ], 
        info: "Aan voet Mont Blanc (100 km)" 
    },
    { 
        name: "La Thuile", 
        color: "#33691e", 
        country: "IT",
        area: [
            [45.74, 6.92], [45.72, 6.98], [45.68, 7.02], [45.64, 7.00],
            [45.62, 6.94], [45.64, 6.86], [45.68, 6.84], [45.72, 6.86],
            [45.74, 6.92]
        ], 
        info: "Verbonden met La Rosière (160 km)" 
    },
    { 
        name: "Sestriere-Via Lattea", 
        color: "#263238", 
        country: "IT",
        area: [
            [44.98, 6.82], [44.96, 6.92], [44.92, 6.98], [44.86, 6.96],
            [44.82, 6.88], [44.84, 6.78], [44.88, 6.74], [44.94, 6.76],
            [44.98, 6.82]
        ], 
        info: "Melkweg - Italië-Frankrijk (400 km)" 
    },
    { 
        name: "Kronplatz", 
        color: "#b71c1c", 
        country: "IT",
        area: [
            [46.78, 11.88], [46.76, 11.96], [46.72, 12.00], [46.68, 11.98],
            [46.66, 11.90], [46.68, 11.82], [46.72, 11.80], [46.76, 11.82],
            [46.78, 11.88]
        ], 
        info: "Nr. 1 skigebied van Zuid-Tirol (119 km)" 
    }
];


// ===========================
// DATA: ALL SKI RESORTS
// ===========================

var skiResorts = [
    // ==================== AUSTRIA ====================
    
    // Ski Arlberg
    { name: "St. Anton am Arlberg", region: "Ski Arlberg", country: "AT", lat: 47.1297, lng: 10.2685, pisteKm: 305, skiMapUrl: "https://www.wintersport.nl/skigebieden/arlberg/kaarten" },
    { name: "Lech-Zürs", region: "Ski Arlberg", country: "AT", lat: 47.2078, lng: 10.1419, pisteKm: 305, skiMapUrl: "https://www.wintersport.nl/dorpen/lech/kaarten" },
    { name: "Stuben", region: "Ski Arlberg", country: "AT", lat: 47.1300, lng: 10.1900, pisteKm: 305, skiMapUrl: "https://www.wintersport.nl/dorpen/stuben/kaarten" },
    { name: "Warth-Schröcken", region: "Ski Arlberg", country: "AT", lat: 47.2500, lng: 10.1833, pisteKm: 305, skiMapUrl: "https://www.wintersport.nl/dorpen/warth/kaarten" },
    
    // Zillertal
    { name: "Mayrhofen", region: "Zillertal", country: "AT", lat: 47.1667, lng: 11.8667, pisteKm: 136, skiMapUrl: "https://www.wintersport.nl/skigebieden/mayrhofen/kaarten" },
    { name: "Zillertal Arena", region: "Zillertal", country: "AT", lat: 47.2333, lng: 11.8833, pisteKm: 150, skiMapUrl: "https://www.wintersport.nl/skigebieden/zillertalarena/kaarten" },
    { name: "Hochzillertal-Hochfügen", region: "Zillertal", country: "AT", lat: 47.2000, lng: 11.8500, pisteKm: 91, skiMapUrl: "https://www.wintersport.nl/skigebieden/hochzillertal/kaarten" },
    { name: "Hintertux Gletscher", region: "Zillertal", country: "AT", lat: 47.0667, lng: 11.6667, pisteKm: 60, skiMapUrl: "https://www.wintersport.nl/skigebieden/hintertux/kaarten" },
    
    // Ötztal
    { name: "Sölden", region: "Ötztal", country: "AT", lat: 46.9667, lng: 10.8667, pisteKm: 144, skiMapUrl: "https://www.wintersport.nl/skigebieden/solden/kaarten" },
    { name: "Obergurgl-Hochgurgl", region: "Ötztal", country: "AT", lat: 46.8667, lng: 11.0167, pisteKm: 112, skiMapUrl: "https://www.wintersport.nl/skigebieden/obergurgl/kaarten" },
    { name: "Kühtai", region: "Ötztal", country: "AT", lat: 47.2167, lng: 11.0167, pisteKm: 44, skiMapUrl: "https://www.wintersport.nl/skigebieden/kuhtai/kaarten" },
    
    // Skicircus Saalbach
    { name: "Saalbach", region: "Skicircus Saalbach", country: "AT", lat: 47.3833, lng: 12.6333, pisteKm: 270, skiMapUrl: "https://www.wintersport.nl/skigebieden/saalbach/kaarten" },
    { name: "Hinterglemm", region: "Skicircus Saalbach", country: "AT", lat: 47.3833, lng: 12.5500, pisteKm: 270, skiMapUrl: "https://www.wintersport.nl/dorpen/hinterglemm/kaarten" },
    { name: "Leogang", region: "Skicircus Saalbach", country: "AT", lat: 47.4333, lng: 12.7500, pisteKm: 270, skiMapUrl: "https://www.wintersport.nl/dorpen/leogang/kaarten" },
    { name: "Fieberbrunn", region: "Skicircus Saalbach", country: "AT", lat: 47.4667, lng: 12.5500, pisteKm: 270, skiMapUrl: "https://www.wintersport.nl/dorpen/fieberbrunn/kaarten" },
    
    // Kitzbüheler Alpen
    { name: "Kitzbühel", region: "Kitzbüheler Alpen", country: "AT", lat: 47.4500, lng: 12.3833, pisteKm: 188, skiMapUrl: "https://www.wintersport.nl/skigebieden/kitzbuhel/kaarten" },
    { name: "Kirchberg", region: "Kitzbüheler Alpen", country: "AT", lat: 47.4500, lng: 12.3167, pisteKm: 188, skiMapUrl: "https://www.wintersport.nl/dorpen/kirchberg/kaarten" },
    
    // Silvretta Arena
    { name: "Ischgl", region: "Silvretta Arena", country: "AT", lat: 46.9667, lng: 10.2833, pisteKm: 239, skiMapUrl: "https://www.wintersport.nl/skigebieden/ischgl/kaarten" },
    { name: "Galtür", region: "Silvretta Arena", country: "AT", lat: 46.9667, lng: 10.1833, pisteKm: 43, skiMapUrl: "https://www.wintersport.nl/skigebieden/galtur/kaarten" },
    { name: "Kappl", region: "Silvretta Arena", country: "AT", lat: 47.0500, lng: 10.3667, pisteKm: 42, skiMapUrl: "https://www.wintersport.nl/skigebieden/kappl/kaarten" },
    { name: "See", region: "Silvretta Arena", country: "AT", lat: 47.0833, lng: 10.4667, pisteKm: 41, skiMapUrl: "https://www.wintersport.nl/skigebieden/see/kaarten" },
    
    // Stubaital
    { name: "Stubaier Gletscher", region: "Stubaital", country: "AT", lat: 47.0000, lng: 11.3167, pisteKm: 65, skiMapUrl: "https://www.wintersport.nl/skigebieden/stubaiergletsjer/kaarten" },
    { name: "Schlick 2000", region: "Stubaital", country: "AT", lat: 47.1500, lng: 11.3000, pisteKm: 25, skiMapUrl: "https://www.wintersport.nl/skigebieden/schlick2000/kaarten" },
    { name: "Serles", region: "Stubaital", country: "AT", lat: 47.1000, lng: 11.3333, pisteKm: 8, skiMapUrl: "https://www.wintersport.nl/skigebieden/serles/kaarten" },
    
    // Wilder Kaiser
    { name: "Ellmau", region: "Wilder Kaiser", country: "AT", lat: 47.5167, lng: 12.2833, pisteKm: 284, skiMapUrl: "https://www.wintersport.nl/skigebieden/skiwelt/kaarten" },
    { name: "Söll", region: "Wilder Kaiser", country: "AT", lat: 47.5000, lng: 12.1833, pisteKm: 284, skiMapUrl: "https://www.wintersport.nl/dorpen/soll/kaarten" },
    { name: "Scheffau", region: "Wilder Kaiser", country: "AT", lat: 47.5333, lng: 12.2500, pisteKm: 284, skiMapUrl: "https://www.wintersport.nl/dorpen/scheffau/kaarten" },
    { name: "Going", region: "Wilder Kaiser", country: "AT", lat: 47.5167, lng: 12.3167, pisteKm: 284, skiMapUrl: "https://www.wintersport.nl/dorpen/going/kaarten" },
    { name: "Westendorf", region: "Wilder Kaiser", country: "AT", lat: 47.4333, lng: 12.2000, pisteKm: 284, skiMapUrl: "https://www.wintersport.nl/dorpen/westendorf/kaarten" },
    
    // Zell am See-Kaprun
    { name: "Zell am See", region: "Zell am See-Kaprun", country: "AT", lat: 47.3167, lng: 12.8000, pisteKm: 138, skiMapUrl: "https://www.wintersport.nl/skigebieden/zellamsee-kaprun/kaarten" },
    { name: "Kitzsteinhorn", region: "Zell am See-Kaprun", country: "AT", lat: 47.2000, lng: 12.6833, pisteKm: 138, skiMapUrl: "https://www.wintersport.nl/dorpen/kaprun/kaarten" },
    
    // Gasteinertal
    { name: "Bad Gastein", region: "Gasteinertal", country: "AT", lat: 47.1167, lng: 13.1333, pisteKm: 200, skiMapUrl: "https://www.wintersport.nl/skigebieden/gastein/kaarten" },
    { name: "Bad Hofgastein", region: "Gasteinertal", country: "AT", lat: 47.1667, lng: 13.1000, pisteKm: 200, skiMapUrl: "https://www.wintersport.nl/dorpen/bad_hofgastein/kaarten" },
    { name: "Sportgastein", region: "Gasteinertal", country: "AT", lat: 47.0500, lng: 13.0833, pisteKm: 200, skiMapUrl: "https://www.wintersport.nl/dorpen/sportgastein/kaarten" },
    
    // Schladming-Dachstein
    { name: "Schladming", region: "Schladming-Dachstein", country: "AT", lat: 47.3833, lng: 13.6833, pisteKm: 123, skiMapUrl: "https://www.wintersport.nl/skigebieden/schladming/kaarten" },
    { name: "Planai", region: "Schladming-Dachstein", country: "AT", lat: 47.3667, lng: 13.7167, pisteKm: 123, skiMapUrl: "https://www.wintersport.nl/dorpen/schladming/kaarten" },
    { name: "Ramsau Dachstein", region: "Schladming-Dachstein", country: "AT", lat: 47.4167, lng: 13.8167, pisteKm: 123, skiMapUrl: "https://www.wintersport.nl/dorpen/ramsau_am_dachstein/kaarten" },
    
    // Obertauern
    { name: "Obertauern", region: "Obertauern", country: "AT", lat: 47.2500, lng: 13.5667, pisteKm: 100, skiMapUrl: "https://www.wintersport.nl/skigebieden/obertauern/kaarten" },
    
    // Nassfeld
    { name: "Nassfeld", region: "Nassfeld", country: "AT", lat: 46.5667, lng: 13.2833, pisteKm: 110, skiMapUrl: "https://www.wintersport.nl/skigebieden/nassfeld/kaarten" },
    
    // Montafon
    { name: "Gargellen", region: "Montafon", country: "AT", lat: 46.9667, lng: 9.9167, pisteKm: 40, skiMapUrl: "https://www.wintersport.nl/skigebieden/gargellen/kaarten" },
    { name: "Silvretta Montafon", region: "Montafon", country: "AT", lat: 47.0167, lng: 9.9833, pisteKm: 140, skiMapUrl: "https://www.wintersport.nl/skigebieden/silvrettamontafon/kaarten" },
    { name: "Golm", region: "Montafon", country: "AT", lat: 47.0500, lng: 9.8333, pisteKm: 44, skiMapUrl: "https://www.wintersport.nl/skigebieden/golm/kaarten" },
    { name: "Brandnertal", region: "Montafon", country: "AT", lat: 47.1000, lng: 9.7500, pisteKm: 55, skiMapUrl: "https://www.wintersport.nl/skigebieden/brandnertal/kaarten" },
    
    // Bregenzerwald
    { name: "Damüls-Mellau", region: "Bregenzerwald", country: "AT", lat: 47.2833, lng: 9.8833, pisteKm: 109, skiMapUrl: "https://www.wintersport.nl/skigebieden/damuls/kaarten" },
    { name: "Au-Schoppernau", region: "Bregenzerwald", country: "AT", lat: 47.3333, lng: 10.0667, pisteKm: 40, skiMapUrl: "https://www.wintersport.nl/dorpen/au/kaarten" },
    { name: "Schwarzenberg-Bödele", region: "Bregenzerwald", country: "AT", lat: 47.4167, lng: 9.8500, pisteKm: 12, skiMapUrl: "https://www.wintersport.nl/skigebieden/bregenzerwald/kaarten" },
    
    // Serfaus-Fiss-Ladis
    { name: "Serfaus", region: "Serfaus-Fiss-Ladis", country: "AT", lat: 47.0394, lng: 10.6039, pisteKm: 214, skiMapUrl: "https://www.wintersport.nl/skigebieden/serfaus-fiss-ladis/kaarten" },
    { name: "Fiss", region: "Serfaus-Fiss-Ladis", country: "AT", lat: 47.0567, lng: 10.6167, pisteKm: 214, skiMapUrl: "https://www.wintersport.nl/dorpen/fiss/kaarten" },
    { name: "Ladis", region: "Serfaus-Fiss-Ladis", country: "AT", lat: 47.0728, lng: 10.6397, pisteKm: 214, skiMapUrl: "https://www.wintersport.nl/dorpen/ladis/kaarten" },
    
    // Salzburger Sportwelt
    { name: "Flachau", region: "Salzburger Sportwelt", country: "AT", lat: 47.3431, lng: 13.3908, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/skigebieden/flachau/kaarten" },
    { name: "Wagrain", region: "Salzburger Sportwelt", country: "AT", lat: 47.3333, lng: 13.3000, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/dorpen/wagrain/kaarten" },
    { name: "St. Johann im Pongau", region: "Salzburger Sportwelt", country: "AT", lat: 47.3500, lng: 13.2000, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/dorpen/st_johann_im_pongau/kaarten" },

    // ==================== SWITZERLAND ====================
    
    // Zermatt-Matterhorn
    { name: "Zermatt", region: "Zermatt-Matterhorn", country: "CH", lat: 46.0207, lng: 7.7491, pisteKm: 360, skiMapUrl: "https://www.wintersport.nl/skigebieden/zermatt/kaarten" },
    { name: "Klein Matterhorn", region: "Zermatt-Matterhorn", country: "CH", lat: 45.9386, lng: 7.7167, pisteKm: 360, skiMapUrl: "https://www.wintersport.nl/skigebieden/zermatt/kaarten" },
    
    // Verbier 4 Vallées
    { name: "Verbier", region: "Verbier 4 Vallées", country: "CH", lat: 46.0963, lng: 7.2286, pisteKm: 410, skiMapUrl: "https://www.wintersport.nl/skigebieden/quatrevallees/kaarten" },
    { name: "Nendaz", region: "Verbier 4 Vallées", country: "CH", lat: 46.1872, lng: 7.3047, pisteKm: 410, skiMapUrl: "https://www.wintersport.nl/dorpen/nendaz/kaarten" },
    { name: "Veysonnaz", region: "Verbier 4 Vallées", country: "CH", lat: 46.1986, lng: 7.3361, pisteKm: 410, skiMapUrl: "https://www.wintersport.nl/dorpen/veysonnaz/kaarten" },
    { name: "Thyon", region: "Verbier 4 Vallées", country: "CH", lat: 46.1833, lng: 7.3667, pisteKm: 410, skiMapUrl: "https://www.wintersport.nl/dorpen/thyon/kaarten" },
    
    // St. Moritz-Engadin
    { name: "St. Moritz", region: "St. Moritz-Engadin", country: "CH", lat: 46.4908, lng: 9.8355, pisteKm: 350, skiMapUrl: "https://www.wintersport.nl/skigebieden/sankt_moritz/kaarten" },
    { name: "Corviglia", region: "St. Moritz-Engadin", country: "CH", lat: 46.5000, lng: 9.8333, pisteKm: 350, skiMapUrl: "https://www.wintersport.nl/skigebieden/sankt_moritz/kaarten" },
    { name: "Corvatsch", region: "St. Moritz-Engadin", country: "CH", lat: 46.4167, lng: 9.8167, pisteKm: 350, skiMapUrl: "https://www.wintersport.nl/skigebieden/sankt_moritz/kaarten" },
    { name: "Diavolezza", region: "St. Moritz-Engadin", country: "CH", lat: 46.4128, lng: 9.9706, pisteKm: 350, skiMapUrl: "https://www.wintersport.nl/skigebieden/sankt_moritz/kaarten" },
    
    // Jungfrau Region
    { name: "Grindelwald", region: "Jungfrau Region", country: "CH", lat: 46.6244, lng: 8.0413, pisteKm: 213, skiMapUrl: "https://www.wintersport.nl/skigebieden/jungfrauregio/kaarten" },
    { name: "Wengen", region: "Jungfrau Region", country: "CH", lat: 46.6083, lng: 7.9225, pisteKm: 213, skiMapUrl: "https://www.wintersport.nl/dorpen/wengen/kaarten" },
    { name: "Mürren", region: "Jungfrau Region", country: "CH", lat: 46.5592, lng: 7.8925, pisteKm: 213, skiMapUrl: "https://www.wintersport.nl/dorpen/murren/kaarten" },
    { name: "Kleine Scheidegg", region: "Jungfrau Region", country: "CH", lat: 46.5853, lng: 7.9611, pisteKm: 213, skiMapUrl: "https://www.wintersport.nl/skigebieden/jungfrauregio/kaarten" },
    
    // Davos-Klosters
    { name: "Davos", region: "Davos-Klosters", country: "CH", lat: 46.8027, lng: 9.8360, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/skigebieden/davos/kaarten" },
    { name: "Klosters", region: "Davos-Klosters", country: "CH", lat: 46.8689, lng: 9.8797, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/dorpen/klosters/kaarten" },
    { name: "Parsenn", region: "Davos-Klosters", country: "CH", lat: 46.8333, lng: 9.8167, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/skigebieden/davos/kaarten" },
    { name: "Jakobshorn", region: "Davos-Klosters", country: "CH", lat: 46.7833, lng: 9.8500, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/skigebieden/davos/kaarten" },
    
    // Laax-Flims
    { name: "Laax", region: "Laax-Flims", country: "CH", lat: 46.8094, lng: 9.2575, pisteKm: 224, skiMapUrl: "https://www.wintersport.nl/skigebieden/laax/kaarten" },
    { name: "Flims", region: "Laax-Flims", country: "CH", lat: 46.8372, lng: 9.2833, pisteKm: 224, skiMapUrl: "https://www.wintersport.nl/dorpen/flims/kaarten" },
    { name: "Falera", region: "Laax-Flims", country: "CH", lat: 46.7978, lng: 9.2339, pisteKm: 224, skiMapUrl: "https://www.wintersport.nl/skigebieden/laax/kaarten" },
    
    // Saas-Fee
    { name: "Saas-Fee", region: "Saas-Fee", country: "CH", lat: 46.1081, lng: 7.9275, pisteKm: 100, skiMapUrl: "https://www.wintersport.nl/skigebieden/saasfee/kaarten" },
    { name: "Saas-Grund", region: "Saas-Fee", country: "CH", lat: 46.1236, lng: 7.9369, pisteKm: 100, skiMapUrl: "https://www.wintersport.nl/dorpen/saas_grund/kaarten" },
    
    // Crans-Montana
    { name: "Crans-Montana", region: "Crans-Montana", country: "CH", lat: 46.3073, lng: 7.4808, pisteKm: 140, skiMapUrl: "https://www.wintersport.nl/skigebieden/cransmontana/kaarten" },
    { name: "Aminona", region: "Crans-Montana", country: "CH", lat: 46.2833, lng: 7.5167, pisteKm: 140, skiMapUrl: "https://www.wintersport.nl/skigebieden/cransmontana/kaarten" },
    
    // Arosa-Lenzerheide
    { name: "Arosa", region: "Arosa-Lenzerheide", country: "CH", lat: 46.7833, lng: 9.6778, pisteKm: 225, skiMapUrl: "https://www.wintersport.nl/skigebieden/arosa/kaarten" },
    { name: "Lenzerheide", region: "Arosa-Lenzerheide", country: "CH", lat: 46.7333, lng: 9.5500, pisteKm: 225, skiMapUrl: "https://www.wintersport.nl/skigebieden/lenzerheide/kaarten" },
    
    // Andermatt-Sedrun
    { name: "Andermatt", region: "Andermatt-Sedrun", country: "CH", lat: 46.6361, lng: 8.5944, pisteKm: 180, skiMapUrl: "https://www.wintersport.nl/skigebieden/andermatt/kaarten" },
    { name: "Sedrun", region: "Andermatt-Sedrun", country: "CH", lat: 46.6817, lng: 8.7714, pisteKm: 180, skiMapUrl: "https://www.wintersport.nl/dorpen/sedrun/kaarten" },
    { name: "Disentis", region: "Andermatt-Sedrun", country: "CH", lat: 46.7044, lng: 8.8531, pisteKm: 180, skiMapUrl: "https://www.wintersport.nl/skigebieden/disentis/kaarten" },

    // ==================== FRANCE ====================
    
    // Les 3 Vallées
    { name: "Courchevel", region: "Les 3 Vallées", country: "FR", lat: 45.4153, lng: 6.6347, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/skigebieden/courchevel/kaarten" },
    { name: "Méribel", region: "Les 3 Vallées", country: "FR", lat: 45.3967, lng: 6.5656, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/skigebieden/meribel/kaarten" },
    { name: "Val Thorens", region: "Les 3 Vallées", country: "FR", lat: 45.2981, lng: 6.5803, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/skigebieden/valthorens/kaarten" },
    { name: "Les Menuires", region: "Les 3 Vallées", country: "FR", lat: 45.3231, lng: 6.5339, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/skigebieden/lesmenuires/kaarten" },
    { name: "La Tania", region: "Les 3 Vallées", country: "FR", lat: 45.4333, lng: 6.5833, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/dorpen/la_tania/kaarten" },
    { name: "Brides-les-Bains", region: "Les 3 Vallées", country: "FR", lat: 45.4528, lng: 6.5700, pisteKm: 600, skiMapUrl: "https://www.wintersport.nl/dorpen/brides_les_bains/kaarten" },
    
    // Paradiski
    { name: "Les Arcs", region: "Paradiski", country: "FR", lat: 45.5719, lng: 6.8283, pisteKm: 425, skiMapUrl: "https://www.wintersport.nl/skigebieden/lesarcs/kaarten" },
    { name: "La Plagne", region: "Paradiski", country: "FR", lat: 45.5069, lng: 6.6772, pisteKm: 425, skiMapUrl: "https://www.wintersport.nl/skigebieden/laplagne/kaarten" },
    { name: "Peisey-Vallandry", region: "Paradiski", country: "FR", lat: 45.5500, lng: 6.7500, pisteKm: 425, skiMapUrl: "https://www.wintersport.nl/dorpen/peisey_vallandry/kaarten" },
    
    // Espace Killy
    { name: "Val d'Isère", region: "Espace Killy", country: "FR", lat: 45.4481, lng: 6.9797, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/skigebieden/valdisere/kaarten" },
    { name: "Tignes", region: "Espace Killy", country: "FR", lat: 45.4692, lng: 6.9069, pisteKm: 300, skiMapUrl: "https://www.wintersport.nl/skigebieden/tignes/kaarten" },
    
    // Portes du Soleil
    { name: "Avoriaz", region: "Portes du Soleil", country: "FR", lat: 46.1933, lng: 6.7739, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/skigebieden/avoriaz/kaarten" },
    { name: "Morzine", region: "Portes du Soleil", country: "FR", lat: 46.1797, lng: 6.7089, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/skigebieden/morzine/kaarten" },
    { name: "Les Gets", region: "Portes du Soleil", country: "FR", lat: 46.1583, lng: 6.6697, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/skigebieden/lesgets/kaarten" },
    { name: "Châtel", region: "Portes du Soleil", country: "FR", lat: 46.2669, lng: 6.8411, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/skigebieden/chatel/kaarten" },
    { name: "Champéry", region: "Portes du Soleil", country: "CH", lat: 46.1750, lng: 6.8697, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/skigebieden/champery/kaarten" },
    { name: "Morgins", region: "Portes du Soleil", country: "CH", lat: 46.2386, lng: 6.8519, pisteKm: 650, skiMapUrl: "https://www.wintersport.nl/dorpen/morgins/kaarten" },
    
    // Chamonix-Mont Blanc
    { name: "Chamonix", region: "Chamonix-Mont Blanc", country: "FR", lat: 45.9237, lng: 6.8694, pisteKm: 155, skiMapUrl: "https://www.wintersport.nl/skigebieden/chamonix/kaarten" },
    { name: "Les Grands Montets", region: "Chamonix-Mont Blanc", country: "FR", lat: 45.9583, lng: 6.9583, pisteKm: 155, skiMapUrl: "https://www.wintersport.nl/skigebieden/chamonix/kaarten" },
    { name: "Brévent-Flégère", region: "Chamonix-Mont Blanc", country: "FR", lat: 45.9333, lng: 6.8333, pisteKm: 155, skiMapUrl: "https://www.wintersport.nl/skigebieden/chamonix/kaarten" },
    { name: "Le Tour", region: "Chamonix-Mont Blanc", country: "FR", lat: 46.0261, lng: 6.9500, pisteKm: 155, skiMapUrl: "https://www.wintersport.nl/skigebieden/chamonix/kaarten" },
    
    // Les 2 Alpes
    { name: "Les Deux Alpes", region: "Les 2 Alpes", country: "FR", lat: 45.0167, lng: 6.1222, pisteKm: 200, skiMapUrl: "https://www.wintersport.nl/skigebieden/les2alpes/kaarten" },
    
    // Alpe d'Huez
    { name: "Alpe d'Huez", region: "Alpe d'Huez", country: "FR", lat: 45.0919, lng: 6.0653, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/skigebieden/alpedhuez/kaarten" },
    { name: "Vaujany", region: "Alpe d'Huez", country: "FR", lat: 45.1500, lng: 6.0667, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/dorpen/vaujany/kaarten" },
    { name: "Oz-en-Oisans", region: "Alpe d'Huez", country: "FR", lat: 45.1261, lng: 6.0511, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/dorpen/oz_en_oisans/kaarten" },
    
    // Serre Chevalier
    { name: "Serre Chevalier", region: "Serre Chevalier", country: "FR", lat: 44.9417, lng: 6.5556, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/skigebieden/serrechevalier/kaarten" },
    { name: "Briançon", region: "Serre Chevalier", country: "FR", lat: 44.8964, lng: 6.6344, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/dorpen/briancon/kaarten" },
    { name: "Chantemerle", region: "Serre Chevalier", country: "FR", lat: 44.9333, lng: 6.5667, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/dorpen/chantemerle/kaarten" },
    { name: "Villeneuve", region: "Serre Chevalier", country: "FR", lat: 44.9500, lng: 6.5833, pisteKm: 250, skiMapUrl: "https://www.wintersport.nl/dorpen/villeneuve/kaarten" },
    
    // La Clusaz-Grand Massif
    { name: "La Clusaz", region: "La Clusaz-Grand Massif", country: "FR", lat: 45.9044, lng: 6.4228, pisteKm: 125, skiMapUrl: "https://www.wintersport.nl/skigebieden/laclusaz/kaarten" },
    { name: "Flaine", region: "La Clusaz-Grand Massif", country: "FR", lat: 46.0058, lng: 6.6889, pisteKm: 265, skiMapUrl: "https://www.wintersport.nl/skigebieden/flaine/kaarten" },
    { name: "Samoëns", region: "La Clusaz-Grand Massif", country: "FR", lat: 46.0833, lng: 6.7333, pisteKm: 265, skiMapUrl: "https://www.wintersport.nl/dorpen/samoens/kaarten" },
    { name: "Les Carroz", region: "La Clusaz-Grand Massif", country: "FR", lat: 46.0256, lng: 6.6411, pisteKm: 265, skiMapUrl: "https://www.wintersport.nl/dorpen/les_carroz/kaarten" },
    { name: "Morillon", region: "La Clusaz-Grand Massif", country: "FR", lat: 46.0833, lng: 6.6833, pisteKm: 265, skiMapUrl: "https://www.wintersport.nl/dorpen/morillon/kaarten" },
    
    // Megève-Évasion Mont Blanc
    { name: "Megève", region: "Megève-Évasion Mont Blanc", country: "FR", lat: 45.8567, lng: 6.6175, pisteKm: 445, skiMapUrl: "https://www.wintersport.nl/skigebieden/megeve/kaarten" },
    { name: "Saint-Gervais", region: "Megève-Évasion Mont Blanc", country: "FR", lat: 45.8919, lng: 6.7128, pisteKm: 445, skiMapUrl: "https://www.wintersport.nl/dorpen/saint_gervais/kaarten" },
    { name: "Les Contamines", region: "Megève-Évasion Mont Blanc", country: "FR", lat: 45.8208, lng: 6.7278, pisteKm: 445, skiMapUrl: "https://www.wintersport.nl/skigebieden/lescontamines/kaarten" },
    { name: "Combloux", region: "Megève-Évasion Mont Blanc", country: "FR", lat: 45.8944, lng: 6.6444, pisteKm: 445, skiMapUrl: "https://www.wintersport.nl/dorpen/combloux/kaarten" },

    // ==================== ITALY ====================
    
    // Dolomiti Superski
    { name: "Selva Val Gardena", region: "Dolomiti Superski", country: "IT", lat: 46.5578, lng: 11.7581, pisteKm: 1200, skiMapUrl: "https://www.wintersport.nl/skigebieden/valgardena/kaarten" },
    { name: "Ortisei", region: "Dolomiti Superski", country: "IT", lat: 46.5742, lng: 11.6722, pisteKm: 1200, skiMapUrl: "https://www.wintersport.nl/dorpen/ortisei/kaarten" },
    { name: "Santa Cristina", region: "Dolomiti Superski", country: "IT", lat: 46.5611, lng: 11.7167, pisteKm: 1200, skiMapUrl: "https://www.wintersport.nl/dorpen/santa_cristina/kaarten" },
    
    // Alta Badia
    { name: "Corvara", region: "Alta Badia", country: "IT", lat: 46.5497, lng: 11.8747, pisteKm: 130, skiMapUrl: "https://www.wintersport.nl/skigebieden/altabadia/kaarten" },
    { name: "La Villa", region: "Alta Badia", country: "IT", lat: 46.5878, lng: 11.8933, pisteKm: 130, skiMapUrl: "https://www.wintersport.nl/dorpen/la_villa/kaarten" },
    { name: "San Cassiano", region: "Alta Badia", country: "IT", lat: 46.5728, lng: 11.9042, pisteKm: 130, skiMapUrl: "https://www.wintersport.nl/dorpen/san_cassiano/kaarten" },
    { name: "Colfosco", region: "Alta Badia", country: "IT", lat: 46.5375, lng: 11.8417, pisteKm: 130, skiMapUrl: "https://www.wintersport.nl/dorpen/colfosco/kaarten" },
    
    // Val Gardena
    { name: "Seceda", region: "Val Gardena", country: "IT", lat: 46.6028, lng: 11.7250, pisteKm: 175, skiMapUrl: "https://www.wintersport.nl/skigebieden/valgardena/kaarten" },
    { name: "Alpe di Siusi", region: "Val Gardena", country: "IT", lat: 46.5417, lng: 11.6250, pisteKm: 175, skiMapUrl: "https://www.wintersport.nl/skigebieden/alpedisiusi/kaarten" },
    
    // Madonna di Campiglio
    { name: "Madonna di Campiglio", region: "Madonna di Campiglio", country: "IT", lat: 46.2292, lng: 10.8267, pisteKm: 150, skiMapUrl: "https://www.wintersport.nl/skigebieden/madonnadicampiglio/kaarten" },
    { name: "Pinzolo", region: "Madonna di Campiglio", country: "IT", lat: 46.1597, lng: 10.7658, pisteKm: 150, skiMapUrl: "https://www.wintersport.nl/dorpen/pinzolo/kaarten" },
    { name: "Folgarida-Marilleva", region: "Madonna di Campiglio", country: "IT", lat: 46.2833, lng: 10.8667, pisteKm: 150, skiMapUrl: "https://www.wintersport.nl/skigebieden/folgarida/kaarten" },
    
    // Livigno
    { name: "Livigno", region: "Livigno", country: "IT", lat: 46.5389, lng: 10.1358, pisteKm: 115, skiMapUrl: "https://www.wintersport.nl/skigebieden/livigno/kaarten" },
    { name: "Carosello 3000", region: "Livigno", country: "IT", lat: 46.5167, lng: 10.1000, pisteKm: 115, skiMapUrl: "https://www.wintersport.nl/skigebieden/livigno/kaarten" },
    { name: "Mottolino", region: "Livigno", country: "IT", lat: 46.5333, lng: 10.1667, pisteKm: 115, skiMapUrl: "https://www.wintersport.nl/skigebieden/livigno/kaarten" },
    
    // Cortina d'Ampezzo
    { name: "Cortina d'Ampezzo", region: "Cortina d'Ampezzo", country: "IT", lat: 46.5369, lng: 12.1358, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/skigebieden/cortina/kaarten" },
    { name: "Tofana", region: "Cortina d'Ampezzo", country: "IT", lat: 46.5500, lng: 12.0833, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/skigebieden/cortina/kaarten" },
    { name: "Faloria-Cristallo", region: "Cortina d'Ampezzo", country: "IT", lat: 46.5333, lng: 12.1667, pisteKm: 120, skiMapUrl: "https://www.wintersport.nl/skigebieden/cortina/kaarten" },
    
    // Bormio
    { name: "Bormio", region: "Bormio", country: "IT", lat: 46.4689, lng: 10.3703, pisteKm: 50, skiMapUrl: "https://www.wintersport.nl/skigebieden/bormio/kaarten" },
    { name: "Santa Caterina Valfurva", region: "Bormio", country: "IT", lat: 46.4167, lng: 10.5000, pisteKm: 50, skiMapUrl: "https://www.wintersport.nl/skigebieden/altavaltellina/kaarten" },
    
    // Cervinia-Valtournenche
    { name: "Cervinia", region: "Cervinia-Valtournenche", country: "IT", lat: 45.9339, lng: 7.6319, pisteKm: 360, skiMapUrl: "https://www.wintersport.nl/skigebieden/cervinia/kaarten" },
    { name: "Valtournenche", region: "Cervinia-Valtournenche", country: "IT", lat: 45.8797, lng: 7.6247, pisteKm: 360, skiMapUrl: "https://www.wintersport.nl/dorpen/valtournenche/kaarten" },
    
    // Courmayeur
    { name: "Courmayeur", region: "Courmayeur", country: "IT", lat: 45.7967, lng: 6.9686, pisteKm: 100, skiMapUrl: "https://www.wintersport.nl/skigebieden/courmayeur/kaarten" },
    
    // La Thuile
    { name: "La Thuile", region: "La Thuile", country: "IT", lat: 45.7167, lng: 6.9500, pisteKm: 160, skiMapUrl: "https://www.wintersport.nl/skigebieden/lathuile/kaarten" },
    { name: "La Rosière", region: "La Thuile", country: "FR", lat: 45.6264, lng: 6.8486, pisteKm: 160, skiMapUrl: "https://www.wintersport.nl/skigebieden/larosiere/kaarten" },
    
    // Sestriere-Via Lattea
    { name: "Sestriere", region: "Sestriere-Via Lattea", country: "IT", lat: 44.9583, lng: 6.8794, pisteKm: 400, skiMapUrl: "https://www.wintersport.nl/skigebieden/sestriere/kaarten" },
    { name: "Sauze d'Oulx", region: "Sestriere-Via Lattea", country: "IT", lat: 45.0292, lng: 6.8583, pisteKm: 400, skiMapUrl: "https://www.wintersport.nl/dorpen/sauze-d-oulx/kaarten" },
    { name: "San Sicario", region: "Sestriere-Via Lattea", country: "IT", lat: 44.9500, lng: 6.8000, pisteKm: 400, skiMapUrl: "https://www.wintersport.nl/skigebieden/vialattea/kaarten" },
    { name: "Claviere", region: "Sestriere-Via Lattea", country: "IT", lat: 44.9375, lng: 6.7500, pisteKm: 400, skiMapUrl: "https://www.wintersport.nl/dorpen/claviere/kaarten" },
    { name: "Montgenèvre", region: "Sestriere-Via Lattea", country: "FR", lat: 44.9317, lng: 6.7264, pisteKm: 400, skiMapUrl: "https://www.wintersport.nl/skigebieden/montgenevre/kaarten" },
    
    // Kronplatz
    { name: "Kronplatz", region: "Kronplatz", country: "IT", lat: 46.7381, lng: 11.9597, pisteKm: 119, skiMapUrl: "https://www.wintersport.nl/skigebieden/kronplatz/kaarten" },
    { name: "Brunico", region: "Kronplatz", country: "IT", lat: 46.7961, lng: 11.9364, pisteKm: 119, skiMapUrl: "https://www.wintersport.nl/dorpen/brunico/kaarten" },
    { name: "San Vigilio", region: "Kronplatz", country: "IT", lat: 46.6972, lng: 11.9250, pisteKm: 119, skiMapUrl: "https://www.wintersport.nl/dorpen/san_vigilio/kaarten" }
];
// ===========================
// DATA STORAGE (Firebase/Local)
// ===========================

var visitData = {};
var currentResort = null;


// ===========================
// MARKER COLORS
// ===========================

var visitedColor = '#4caf50';

function getRegionColor(regionName) {
    var region = skiRegions.find(function(r) { return r.name === regionName; });
    return region ? region.color : '#2196f3';
}

function getMarkerColor(resortName) {
    var visits = visitData[resortName] || [];
    if (visits.length > 0) {
        return visitedColor;
    }
    var resort = skiResorts.find(function(r) { return r.name === resortName; });
    return resort ? getRegionColor(resort.region) : '#2196f3';
}


// ===========================
// APP INITIALIZATION (Called after login)
// ===========================

async function initializeApp() {
    showLoading();
    
    try {
        // Load user's visits from Firestore
        await loadVisitsFromFirestore();
        
        // Initialize map if not already done
        if (!mapInitialized) {
            initializeMap();
            mapInitialized = true;
        } else {
            // Update all markers with loaded data
            updateAllMarkers();
        }
        
        // Update UI
        updateList();
        updateTimeline();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Fout bij laden van gegevens. Probeer het opnieuw.');
    }
    
    hideLoading();
}

// Load visits from Firestore
async function loadVisitsFromFirestore() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('visits').get();
        
        visitData = {};
        
        snapshot.forEach(function(doc) {
            const data = doc.data();
            const resortName = data.resortName;
            
            if (!visitData[resortName]) {
                visitData[resortName] = [];
            }
            
            visitData[resortName].push({
                id: doc.id,
                startDate: data.startDate,
                endDate: data.endDate,
                companions: data.companions,
                ratings: data.ratings || {},
                accommodation: data.accommodation || {},
                notes: data.notes || '',
                photos: data.photos || []
            });
        });
        
    } catch (error) {
        console.error('Error loading visits:', error);
        throw error;
    }
}

// Save visit to Firestore
async function saveVisitToFirestore(resortName, visitData) {
    if (!currentUser) return;
    
    const visitRef = db.collection('users').doc(currentUser.uid)
        .collection('visits');
    
    const data = {
        resortName: resortName,
        startDate: visitData.startDate,
        endDate: visitData.endDate,
        companions: visitData.companions,
        ratings: visitData.ratings,
        accommodation: visitData.accommodation,
        notes: visitData.notes,
        photos: visitData.photos || [],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    if (visitData.id && !visitData.id.startsWith('local_')) {
        // Update existing visit
        await visitRef.doc(visitData.id).update(data);
        return visitData.id;
    } else {
        // Create new visit
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const docRef = await visitRef.add(data);
        return docRef.id;
    }
}

// Delete visit from Firestore
async function deleteVisitFromFirestore(visitId) {
    if (!currentUser) return;
    
    await db.collection('users').doc(currentUser.uid)
        .collection('visits').doc(visitId).delete();
}


// ===========================
// MAP INITIALIZATION
// ===========================

function initializeMap() {
    map = L.map('map').setView([46.2, 9.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Draw regions
    skiRegions.forEach(function(region) {
        L.polygon(region.area, {
            color: region.color,
            fillColor: region.color,
            fillOpacity: 0.15,
            weight: 2,
            smoothFactor: 1.5
        }).addTo(map).bindPopup("<b>" + region.name + "</b><br>" + region.info);
        
        var legendHtml = '<div class="legend-item">';
        legendHtml += '<div class="square" style="background-color: ' + region.color + ';"></div>';
        legendHtml += '<span>' + region.name + '</span></div>';
        document.getElementById('region-legend').innerHTML += legendHtml;
    });
    
    // Create markers
    skiResorts.forEach(function(resort) {
        var markerColor = getMarkerColor(resort.name);
        var visits = visitData[resort.name] || [];
        
        var marker = L.circleMarker([resort.lat, resort.lng], {
            radius: visits.length > 0 ? 10 : 8,
            fillColor: markerColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(map);
        
        markers[resort.name] = marker;
        bindMarkerPopup(resort.name);
    });
}

function updateAllMarkers() {
    skiResorts.forEach(function(resort) {
        updateMarkerIcon(resort.name);
        updatePopup(resort.name);
    });
}


// ===========================
// HELPER FUNCTIONS
// ===========================

function generateVisitId() {
    return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    return parts[2] + '-' + parts[1] + '-' + parts[0];
}

function formatDateRangeShort(startDate, endDate) {
    if (!startDate) return '';
    var start = formatDate(startDate);
    if (!endDate || endDate === startDate) return start;
    return start + ' t/m ' + formatDate(endDate);
}

function getYear(dateStr) {
    return dateStr ? dateStr.split('-')[0] : '';
}

function getVisitCount(resortName) {
    return visitData[resortName] ? visitData[resortName].length : 0;
}

function getStarsText(count) {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
}

function calculateOverallAverage(ratings) {
    if (!ratings) return 0;
    var values = [];
    allRatingCategories.forEach(function(cat) {
        if (ratings[cat.id] > 0) values.push(ratings[cat.id]);
    });
    if (values.length === 0) return 0;
    var sum = values.reduce(function(a, b) { return a + b; }, 0);
    return (sum / values.length).toFixed(1);
}


// ===========================
// RATING FUNCTIONS
// ===========================

function getRatings() {
    var ratings = {};
    allRatingCategories.forEach(function(cat) {
        var checked = document.querySelector('input[name="rating-' + cat.id + '"]:checked');
        ratings[cat.id] = checked ? parseInt(checked.value) : 0;
    });
    return ratings;
}

function clearRatings() {
    allRatingCategories.forEach(function(cat) {
        var radios = document.querySelectorAll('input[name="rating-' + cat.id + '"]');
        radios.forEach(function(radio) { radio.checked = false; });
    });
}

function getAccommodationType() {
    var checked = document.querySelector('input[name="accommodation-type"]:checked');
    return checked ? checked.value : '';
}

function clearAccommodationType() {
    var radios = document.querySelectorAll('input[name="accommodation-type"]');
    radios.forEach(function(radio) { radio.checked = false; });
}

function getAccommodationUrl() {
    return document.getElementById('accommodation-url').value.trim();
}

function getNotes() {
    return document.getElementById('notes-editor').innerHTML;
}

function clearNotes() {
    document.getElementById('notes-editor').innerHTML = '';
}

function formatText(command) {
    document.execCommand(command, false, null);
}


// ===========================
// TIMELINE
// ===========================

function updateTimeline() {
    var timeline = document.getElementById('timeline');
    var timelineTotal = document.getElementById('timeline-total');
    
    var allVisits = [];
    for (var resortName in visitData) {
        var resort = skiResorts.find(function(r) { return r.name === resortName; });
        if (resort) {
            visitData[resortName].forEach(function(visit) {
                allVisits.push({
                    id: visit.id,
                    startDate: visit.startDate,
                    endDate: visit.endDate,
                    companions: visit.companions,
                    ratings: visit.ratings || {},
                    accommodation: visit.accommodation || {},
                    notes: visit.notes || '',
                    resortName: resortName,
                    region: resort.region
                });
            });
        }
    }
    
    timelineTotal.textContent = allVisits.length;
    
    if (allVisits.length === 0) {
        timeline.innerHTML = '<p class="no-visits-yet">Nog geen bezoeken geregistreerd.</p>';
        return;
    }
    
    allVisits.sort(function(a, b) {
        return new Date(b.startDate) - new Date(a.startDate);
    });
    
    var visitsByYear = {};
    allVisits.forEach(function(visit) {
        var year = getYear(visit.startDate);
        if (!visitsByYear[year]) visitsByYear[year] = [];
        visitsByYear[year].push(visit);
    });
    
    var html = '';
    Object.keys(visitsByYear).sort(function(a, b) { return b - a; }).forEach(function(year) {
        html += '<div class="timeline-year">🗓️ ' + year + '</div>';
        
        visitsByYear[year].forEach(function(visit) {
            var companionsHtml = visit.companions ? '<div class="timeline-item-companions">' + visit.companions + '</div>' : '';
            
            var accHtml = '';
            if (visit.accommodation && visit.accommodation.type) {
                var accType = accommodationTypes[visit.accommodation.type];
                if (accType) {
                    accHtml = '<div class="timeline-item-accommodation">' + accType.icon + ' ' + accType.name + '</div>';
                }
            }
            
            var avgRating = calculateOverallAverage(visit.ratings);
            var ratingHtml = '';
            if (avgRating > 0) {
                var fullStars = Math.round(parseFloat(avgRating));
                ratingHtml = '<div class="timeline-item-rating"><span class="avg-stars">' + getStarsText(fullStars) + '</span><span class="avg-score">(' + avgRating + ')</span></div>';
            }
            
            html += '<div class="timeline-item">';
            html += '<div class="timeline-item-content" data-resort="' + encodeURIComponent(visit.resortName) + '">';
            html += '<div class="timeline-item-date">' + formatDateRangeShort(visit.startDate, visit.endDate) + '</div>';
            html += '<div class="timeline-item-resort">' + visit.resortName + '</div>';
            html += '<div class="timeline-item-region">' + visit.region + '</div>';
            html += companionsHtml;
            html += accHtml;
            html += ratingHtml;
            html += '</div></div>';
        });
    });
    
    timeline.innerHTML = html;
    
    document.querySelectorAll('.timeline-item-content').forEach(function(item) {
        item.addEventListener('click', function() {
            openModal(decodeURIComponent(this.getAttribute('data-resort')));
        });
    });
}


// ===========================
// POPUP FUNCTIONS
// ===========================

function bindMarkerPopup(resortName) {
    var resort = skiResorts.find(function(r) { return r.name === resortName; });
    var marker = markers[resortName];
    var visits = visitData[resortName] || [];
    var visitText = visits.length === 0 ? "Nog niet bezocht" : 
                    visits.length === 1 ? "1 keer bezocht ✓" : 
                    visits.length + " keer bezocht ✓";
    var visitClass = visits.length > 0 ? 'visited' : '';
    
    var popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    var header = document.createElement('h4');
    header.textContent = resort.name;
    popupContent.appendChild(header);
    
    var regionEl = document.createElement('p');
    regionEl.className = 'popup-region';
    regionEl.innerHTML = '📍 ' + resort.region;
    popupContent.appendChild(regionEl);
    
    var pisteEl = document.createElement('p');
    pisteEl.className = 'popup-piste-km';
    pisteEl.innerHTML = '🎿 ' + resort.pisteKm + ' km piste';
    popupContent.appendChild(pisteEl);
    
    var visitsEl = document.createElement('p');
    visitsEl.className = 'popup-visits ' + visitClass;
    visitsEl.textContent = visitText;
    popupContent.appendChild(visitsEl);
    
    var buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'popup-buttons';
    
    var skiMapButton = document.createElement('a');
    skiMapButton.className = 'popup-button ski-map-button';
    skiMapButton.href = resort.skiMapUrl;
    skiMapButton.target = '_blank';
    skiMapButton.innerHTML = '🗺️ Bekijk Pistekaart';
    buttonsDiv.appendChild(skiMapButton);
    
    var manageButton = document.createElement('button');
    manageButton.className = 'popup-button';
    manageButton.textContent = '📅 Bezoeken beheren';
    manageButton.addEventListener('click', function() {
        openModal(resortName);
    });
    buttonsDiv.appendChild(manageButton);
    
    popupContent.appendChild(buttonsDiv);
    
    marker.bindPopup(popupContent, { minWidth: 220 });
}

function updatePopup(resortName) {
    bindMarkerPopup(resortName);
}


// ===========================
// MODAL FUNCTIONS
// ===========================

function openModal(resortName) {
    currentResort = resortName;
    var resort = skiResorts.find(function(r) { return r.name === resortName; });
    
    document.getElementById('modal-title').textContent = resort.name;
    document.getElementById('modal-region').textContent = "Regio: " + resort.region;
    
    editingVisitId = null;
    document.getElementById('save-visit-button').textContent = 'Bezoek toevoegen';
    document.getElementById('cancel-edit-button').style.display = 'none';
    
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('visit-start-date').value = today;
    document.getElementById('visit-end-date').value = today;
    document.getElementById('visit-companions').value = '';
    document.getElementById('accommodation-url').value = '';
    clearRatings();
    clearAccommodationType();
    clearNotes();
    pendingPhotos = [];
    updatePhotoPreview();
    
    updateModalVisitList();
    document.getElementById('visit-modal').style.display = 'block';
    if (map) map.closePopup();
}

function closeModal() {
    document.getElementById('visit-modal').style.display = 'none';
    currentResort = null;
}

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('visit-modal')) {
        closeModal();
    }
});

function updateModalVisitList() {
    var visits = visitData[currentResort] || [];
    var listElement = document.getElementById('visit-list');
    var noVisitsMessage = document.getElementById('no-visits-message');
    
    document.getElementById('visit-count').textContent = visits.length;
    
    if (visits.length === 0) {
        listElement.innerHTML = '';
        noVisitsMessage.style.display = 'block';
        return;
    }
    
    noVisitsMessage.style.display = 'none';
    listElement.innerHTML = '';
    
    visits.slice().sort(function(a, b) {
        return new Date(b.startDate) - new Date(a.startDate);
    }).forEach(function(visit) {
        var li = document.createElement('li');
        
        // Date
        var dateDiv = document.createElement('div');
        dateDiv.className = 'visit-date';
        dateDiv.textContent = formatDateRangeShort(visit.startDate, visit.endDate);
        li.appendChild(dateDiv);
        
        // Companions
        if (visit.companions) {
            var companionsDiv = document.createElement('div');
            companionsDiv.className = 'visit-companions';
            companionsDiv.textContent = '👥 ' + visit.companions;
            li.appendChild(companionsDiv);
        }
        
        // Ratings
        if (visit.ratings) {
            var ratingsContainer = document.createElement('div');
            ratingsContainer.className = 'visit-ratings';
            
            allRatingCategories.forEach(function(cat) {
                var value = visit.ratings[cat.id] || 0;
                if (value > 0) {
                    var ratingItem = document.createElement('div');
                    ratingItem.className = 'visit-rating-item';
                    ratingItem.innerHTML = '<span class="rating-name">' + cat.icon + ' ' + cat.name + '</span>' +
                                          '<span class="rating-stars">' + getStarsText(value) + '</span>';
                    ratingsContainer.appendChild(ratingItem);
                }
            });
            
            var avgRating = calculateOverallAverage(visit.ratings);
            if (avgRating > 0) {
                var avgDiv = document.createElement('div');
                avgDiv.className = 'visit-avg-rating';
                avgDiv.innerHTML = '<span class="avg-label">Gemiddelde:</span>' +
                                  '<span class="avg-value">' + getStarsText(Math.round(parseFloat(avgRating))) + ' (' + avgRating + ')</span>';
                ratingsContainer.appendChild(avgDiv);
            }
            
            li.appendChild(ratingsContainer);
        }
        
        // Accommodation
        if (visit.accommodation && visit.accommodation.type) {
            var accDiv = document.createElement('div');
            accDiv.className = 'visit-accommodation';
            
            var accTitle = document.createElement('div');
            accTitle.className = 'visit-accommodation-title';
            accTitle.textContent = '🏨 Accommodatie';
            accDiv.appendChild(accTitle);
            
            var accType = accommodationTypes[visit.accommodation.type];
            if (accType) {
                var typeDiv = document.createElement('div');
                typeDiv.className = 'visit-accommodation-type';
                typeDiv.textContent = accType.icon + ' ' + accType.name;
                accDiv.appendChild(typeDiv);
            }
            
            if (visit.accommodation.url) {
                var linkDiv = document.createElement('div');
                linkDiv.className = 'visit-accommodation-link';
                linkDiv.innerHTML = '<a href="' + visit.accommodation.url + '" target="_blank">🔗 Bekijk accommodatie</a>';
                accDiv.appendChild(linkDiv);
            }
            
            li.appendChild(accDiv);
        }
        
        // Notes
        if (visit.notes) {
            var notesDiv = document.createElement('div');
            notesDiv.className = 'visit-notes';
            
            var notesTitle = document.createElement('div');
            notesTitle.className = 'visit-notes-title';
            notesTitle.textContent = '📝 Notities';
            notesDiv.appendChild(notesTitle);
            
            var notesContent = document.createElement('div');
            notesContent.className = 'visit-notes-content';
            notesContent.innerHTML = visit.notes;
            notesDiv.appendChild(notesContent);
            
            li.appendChild(notesDiv);
        }
        
        // Photos
        if (visit.photos && visit.photos.length > 0) {
            var photosDiv = document.createElement('div');
            photosDiv.className = 'visit-photos';
            
            var photosTitle = document.createElement('div');
            photosTitle.className = 'visit-photos-title';
            photosTitle.textContent = '📷 Foto\'s (' + visit.photos.length + ')';
            photosDiv.appendChild(photosTitle);
            
            var photosGrid = document.createElement('div');
            photosGrid.className = 'visit-photos-grid';
            
            visit.photos.forEach(function(photo) {
                var photoDiv = document.createElement('div');
                photoDiv.className = 'visit-photo';
                photoDiv.innerHTML = '<img src="' + photo + '" alt="Foto" />';
                photoDiv.addEventListener('click', function() {
                    openLightbox(photo);
                });
                photosGrid.appendChild(photoDiv);
            });
            
            photosDiv.appendChild(photosGrid);
            li.appendChild(photosDiv);
        }
        
        // Buttons
        var buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'visit-buttons';
        
        var editButton = document.createElement('button');
        editButton.className = 'edit-visit';
        editButton.textContent = 'Bewerken';
        editButton.addEventListener('click', function() {
            editVisit(visit.id);
        });
        buttonsDiv.appendChild(editButton);
        
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-visit';
        deleteButton.textContent = 'Verwijderen';
        deleteButton.addEventListener('click', function() {
            removeVisit(visit.id);
        });
        buttonsDiv.appendChild(deleteButton);
        
        li.appendChild(buttonsDiv);
        listElement.appendChild(li);
    });
}


// ===========================
// VISIT MANAGEMENT
// ===========================

async function saveVisit() {
    var startDate = document.getElementById('visit-start-date').value;
    var endDate = document.getElementById('visit-end-date').value || startDate;
    var companions = document.getElementById('visit-companions').value.trim();
    var ratings = getRatings();
    var accommodationType = getAccommodationType();
    var accommodationUrl = getAccommodationUrl();
    var notes = getNotes();
    var photos = pendingPhotos.slice();
    
    if (!startDate) {
        alert('Selecteer een startdatum!');
        return;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
        alert('De einddatum kan niet voor de startdatum liggen!');
        return;
    }
    
    var hasSkiRating = skiRatingCategories.some(function(cat) { return ratings[cat.id] > 0; });
    if (!hasSkiRating) {
        alert('Geef minimaal één beoordeling voor het skigebied!');
        return;
    }
    
    if (!accommodationType) {
        alert('Selecteer een type accommodatie!');
        return;
    }
    
    showLoading();
    
    try {
        var visit = {
            id: editingVisitId || generateVisitId(),
            startDate: startDate,
            endDate: endDate,
            companions: companions,
            ratings: ratings,
            accommodation: {
                type: accommodationType,
                url: accommodationUrl
            },
            notes: notes,
            photos: photos
        };
        
        // Save to Firestore
        var savedId = await saveVisitToFirestore(currentResort, visit);
        visit.id = savedId;
        
        // Update local data
        if (!visitData[currentResort]) {
            visitData[currentResort] = [];
        }
        
        if (editingVisitId) {
            var visitIndex = visitData[currentResort].findIndex(function(v) {
                return v.id === editingVisitId;
            });
            if (visitIndex !== -1) {
                visitData[currentResort][visitIndex] = visit;
            }
            editingVisitId = null;
            document.getElementById('save-visit-button').textContent = 'Bezoek toevoegen';
            document.getElementById('cancel-edit-button').style.display = 'none';
        } else {
            visitData[currentResort].push(visit);
        }
        
        updateModalVisitList();
        updateMarkerIcon(currentResort);
        updatePopup(currentResort);
        updateList();
        updateTimeline();
        clearForm();
        
    } catch (error) {
        console.error('Error saving visit:', error);
        alert('Fout bij opslaan. Probeer het opnieuw.');
    }
    
    hideLoading();
}

function editVisit(visitId) {
    var visit = visitData[currentResort].find(function(v) {
        return v.id === visitId;
    });
    
    if (!visit) return;
    
    editingVisitId = visitId;
    document.getElementById('save-visit-button').textContent = 'Wijzigingen opslaan';
    document.getElementById('cancel-edit-button').style.display = 'block';
    
    document.getElementById('visit-start-date').value = visit.startDate;
    document.getElementById('visit-end-date').value = visit.endDate;
    document.getElementById('visit-companions').value = visit.companions || '';
    document.getElementById('accommodation-url').value = visit.accommodation ? visit.accommodation.url || '' : '';
    
    var ratings = visit.ratings || {};
    allRatingCategories.forEach(function(cat) {
        var value = ratings[cat.id] || 0;
        if (value > 0) {
            var radio = document.getElementById(cat.id + '-' + value);
            if (radio) radio.checked = true;
        }
    });
    
    if (visit.accommodation && visit.accommodation.type) {
        var accRadio = document.querySelector('input[name="accommodation-type"][value="' + visit.accommodation.type + '"]');
        if (accRadio) accRadio.checked = true;
    }
    
    document.getElementById('notes-editor').innerHTML = visit.notes || '';
    
    pendingPhotos = visit.photos ? visit.photos.slice() : [];
    updatePhotoPreview();
    
    document.querySelector('.add-visit-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingVisitId = null;
    document.getElementById('save-visit-button').textContent = 'Bezoek toevoegen';
    document.getElementById('cancel-edit-button').style.display = 'none';
    clearForm();
}

function clearForm() {
    document.getElementById('visit-start-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('visit-end-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('visit-companions').value = '';
    document.getElementById('accommodation-url').value = '';
    clearRatings();
    clearAccommodationType();
    clearNotes();
    pendingPhotos = [];
    updatePhotoPreview();
}

async function removeVisit(visitId) {
    if (!confirm('Weet je zeker dat je dit bezoek wilt verwijderen?')) {
        return;
    }
    
    showLoading();
    
    try {
        await deleteVisitFromFirestore(visitId);
        
        visitData[currentResort] = visitData[currentResort].filter(function(v) {
            return v.id !== visitId;
        });
        
        if (visitData[currentResort].length === 0) {
            delete visitData[currentResort];
        }
        
        updateModalVisitList();
        updateMarkerIcon(currentResort);
        updatePopup(currentResort);
        updateList();
        updateTimeline();
        
    } catch (error) {
        console.error('Error deleting visit:', error);
        alert('Fout bij verwijderen. Probeer het opnieuw.');
    }
    
    hideLoading();
}


// ===========================
// PHOTO FUNCTIONS
// ===========================

function handlePhotoUpload(event) {
    var files = event.target.files;
    
    if (pendingPhotos.length + files.length > 5) {
        alert('Je kunt maximaal 5 foto\'s per bezoek toevoegen.');
        return;
    }
    
    for (var i = 0; i < files.length; i++) {
        if (pendingPhotos.length >= 5) break;
        
        var file = files[i];
        if (!file.type.startsWith('image/')) continue;
        
        if (file.size > 2 * 1024 * 1024) {
            alert('Foto "' + file.name + '" is te groot. Max 2MB per foto.');
            continue;
        }
        
        (function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                resizeImage(e.target.result, 800, 800, function(resizedDataUrl) {
                    pendingPhotos.push(resizedDataUrl);
                    updatePhotoPreview();
                });
            };
            reader.readAsDataURL(file);
        })(file);
    }
    
    event.target.value = '';
}

function resizeImage(dataUrl, maxWidth, maxHeight, callback) {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        var width = img.width;
        var height = img.height;
        
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * maxHeight / height);
                height = maxHeight;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
}

function updatePhotoPreview() {
    var container = document.getElementById('photo-preview-container');
    container.innerHTML = '';
    
    pendingPhotos.forEach(function(photo, index) {
        var div = document.createElement('div');
        div.className = 'photo-preview';
        div.innerHTML = '<img src="' + photo + '" alt="Foto ' + (index + 1) + '" />' +
                       '<button type="button" class="remove-photo" onclick="removePhoto(' + index + ')">×</button>';
        container.appendChild(div);
    });
}

function removePhoto(index) {
    pendingPhotos.splice(index, 1);
    updatePhotoPreview();
}

function openLightbox(photoUrl) {
    var lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'photo-lightbox';
        lightbox.className = 'photo-lightbox';
        lightbox.innerHTML = '<span class="photo-lightbox-close" onclick="closeLightbox()">&times;</span>' +
                            '<img src="" alt="Foto" />';
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.body.appendChild(lightbox);
    }
    
    lightbox.querySelector('img').src = photoUrl;
    lightbox.classList.add('active');
}

function closeLightbox() {
    var lightbox = document.getElementById('photo-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

// Drag and drop support
document.addEventListener('DOMContentLoaded', function() {
    var uploadArea = document.getElementById('photo-upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            var files = e.dataTransfer.files;
            var input = document.getElementById('photo-input');
            
            var dataTransfer = new DataTransfer();
            for (var i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            input.files = dataTransfer.files;
            
            handlePhotoUpload({ target: input, files: files });
        });
    }
});


// ===========================
// MARKER & LIST UPDATES
// ===========================

function updateMarkerIcon(resortName) {
    var visits = visitData[resortName] || [];
    var markerColor = getMarkerColor(resortName);
    markers[resortName].setStyle({
        fillColor: markerColor,
        radius: visits.length > 0 ? 10 : 8
    });
}

function updateList() {
    var list = document.getElementById('resort-list');
    list.innerHTML = '';
    
    // Get search text
    var searchInput = document.getElementById('resort-search');
    currentSearchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Filter and sort resorts
    var filteredResorts = skiResorts.filter(function(resort) {
        // Country filter
        if (currentCountryFilter !== 'all' && resort.country !== currentCountryFilter) {
            return false;
        }
        
        // Search filter
        if (currentSearchText) {
            var searchableText = (resort.name + ' ' + resort.region).toLowerCase();
            return searchableText.indexOf(currentSearchText) !== -1;
        }
        
        return true;
    });
    
    // Sort: visited first, then alphabetically
    filteredResorts.sort(function(a, b) {
        var diff = getVisitCount(b.name) - getVisitCount(a.name);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
    
    // Render filtered list
    filteredResorts.forEach(function(resort) {
        var visitCount = getVisitCount(resort.name);
        var li = document.createElement('li');
        li.className = visitCount > 0 ? 'visited' : '';
        li.setAttribute('data-resort', encodeURIComponent(resort.name));
        
        // Add country flag
        var countryFlag = getCountryFlag(resort.country);
        
        li.innerHTML = '<div class="visit-badge ' + (visitCount > 0 ? '' : 'empty') + '">' + visitCount + '</div>' +
                      '<div><strong>' + resort.name + '</strong> ' + countryFlag + '<br><small>' + resort.region + '</small></div>';
        li.addEventListener('click', function() {
            openModal(decodeURIComponent(this.getAttribute('data-resort')));
        });
        list.appendChild(li);
    });
    
    // Update filter results text
    var filterResults = document.getElementById('filter-results');
    if (filterResults) {
        if (currentCountryFilter !== 'all' || currentSearchText) {
            filterResults.textContent = filteredResorts.length + ' van ' + skiResorts.length + ' skigebieden';
        } else {
            filterResults.textContent = '';
        }
    }
    
    // Update stats (total visits count)
    var totalVisits = 0;
    for (var key in visitData) {
        totalVisits += visitData[key].length;
    }
    
    document.getElementById('visited-count').textContent = Object.keys(visitData).length;
    document.getElementById('total-visits').textContent = totalVisits;
}

// Get country flag emoji
function getCountryFlag(countryCode) {
    var flags = {
        'AT': '🇦🇹',
        'CH': '🇨🇭',
        'FR': '🇫🇷',
        'IT': '🇮🇹'
    };
    return flags[countryCode] || '';
}

// Filter resort list (called on search input)
function filterResortList() {
    updateList();
}

// Set country filter
function setCountryFilter(country) {
    currentCountryFilter = country;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-country') === country) {
            btn.classList.add('active');
        }
    });
    
    updateList();
}


// ===========================
// RESET FUNCTION
// ===========================

async function resetAll() {
    if (!confirm('Weet je zeker dat je alle bezoeken wilt verwijderen? Dit kan niet ongedaan worden gemaakt!')) {
        return;
    }
    
    showLoading();
    
    try {
        // Delete all visits from Firestore
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('visits').get();
        
        const batch = db.batch();
        snapshot.docs.forEach(function(doc) {
            batch.delete(doc.ref);
        });
        await batch.commit();
        
        // Clear local data
        visitData = {};
        
        // Update UI
        skiResorts.forEach(function(resort) {
            var regionColor = getRegionColor(resort.region);
            markers[resort.name].setStyle({
                fillColor: regionColor,
                radius: 8
            });
            updatePopup(resort.name);
        });
        
        updateList();
        updateTimeline();
        
    } catch (error) {
        console.error('Error resetting data:', error);
        alert('Fout bij verwijderen. Probeer het opnieuw.');
    }
    
    hideLoading();
}
