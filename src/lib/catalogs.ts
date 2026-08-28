// Catálogos del prototipo. En el sistema real estos vienen de endpoints
// (?controller=lista&method=...). Aquí viven como datos estáticos tipados,
// pero las funciones de acceso (getCiudades, getTiposDocumento, getBancos...)
// tienen la misma forma que tendría un cliente de API real, para que el día
// de mañana solo haya que reemplazar su implementación interna por un fetch.

export interface Pais {
  id: string;
  nombre: string;
  indicativo: string;
}

export const PAISES: Pais[] = [
  { id: "CO", nombre: "Colombia", indicativo: "+57" },
  { id: "MX", nombre: "México", indicativo: "+52" },
  { id: "PE", nombre: "Perú", indicativo: "+51" },
  { id: "CL", nombre: "Chile", indicativo: "+56" },
  { id: "AR", nombre: "Argentina", indicativo: "+54" },
];

export const CIUDADES_POR_PAIS: Record<string, string[]> = {
  CO: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira"],
  MX: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Mérida"],
  PE: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco", "Piura"],
  CL: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "La Serena", "Temuco"],
  AR: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata"],
};

export function getCiudades(paisId: string): string[] {
  return CIUDADES_POR_PAIS[paisId] ?? [];
}

export interface TipoDocumentoConfig {
  id: string;
  nombre: string;
  naturaleza: "N" | "J";
  regex: string;
  minLength: number;
  maxLength: number;
  ejemplo: string;
}

// Tipos de documento por país, separados por naturaleza (N=persona natural, J=persona jurídica).
// El regex/longitud imita `obtenerConfiguracionTipoDocumento` del sistema actual,
// que valida el formato en vivo según país + tipo de documento.
export const TIPOS_DOCUMENTO_POR_PAIS: Record<string, TipoDocumentoConfig[]> = {
  CO: [
    { id: "CC", nombre: "Cédula de ciudadanía", naturaleza: "N", regex: "^[0-9]{6,10}$", minLength: 6, maxLength: 10, ejemplo: "1020304050" },
    { id: "CE", nombre: "Cédula de extranjería", naturaleza: "N", regex: "^[0-9]{6,10}$", minLength: 6, maxLength: 10, ejemplo: "500123456" },
    { id: "PPT", nombre: "Permiso por Protección Temporal", naturaleza: "N", regex: "^[A-Z0-9]{6,15}$", minLength: 6, maxLength: 15, ejemplo: "PPT0012345" },
    { id: "PAS_CO", nombre: "Pasaporte", naturaleza: "N", regex: "^[A-Z0-9]{6,12}$", minLength: 6, maxLength: 12, ejemplo: "AB123456" },
    { id: "NIT", nombre: "NIT", naturaleza: "J", regex: "^[0-9]{9}-[0-9]$", minLength: 11, maxLength: 11, ejemplo: "900123456-7" },
  ],
  MX: [
    { id: "CURP", nombre: "CURP", naturaleza: "N", regex: "^[A-Z0-9]{18}$", minLength: 18, maxLength: 18, ejemplo: "GORP800101HDFRRD09" },
    { id: "INE", nombre: "Credencial INE", naturaleza: "N", regex: "^[0-9]{13}$", minLength: 13, maxLength: 13, ejemplo: "1234567890123" },
    { id: "PAS_MX", nombre: "Pasaporte", naturaleza: "N", regex: "^[A-Z0-9]{6,12}$", minLength: 6, maxLength: 12, ejemplo: "G01234567" },
    { id: "RFC", nombre: "RFC (persona moral)", naturaleza: "J", regex: "^[A-Z0-9]{12}$", minLength: 12, maxLength: 12, ejemplo: "ABC010101AB1" },
  ],
  PE: [
    { id: "DNI", nombre: "DNI", naturaleza: "N", regex: "^[0-9]{8}$", minLength: 8, maxLength: 8, ejemplo: "45678912" },
    { id: "CE_PE", nombre: "Carné de extranjería", naturaleza: "N", regex: "^[0-9]{9}$", minLength: 9, maxLength: 9, ejemplo: "001234567" },
    { id: "PAS_PE", nombre: "Pasaporte", naturaleza: "N", regex: "^[A-Z0-9]{6,12}$", minLength: 6, maxLength: 12, ejemplo: "PE1234567" },
    { id: "RUC", nombre: "RUC", naturaleza: "J", regex: "^20[0-9]{9}$", minLength: 11, maxLength: 11, ejemplo: "20123456789" },
  ],
  CL: [
    { id: "RUT", nombre: "RUT", naturaleza: "N", regex: "^[0-9]{7,8}-[0-9K]$", minLength: 9, maxLength: 10, ejemplo: "12345678-9" },
    { id: "PAS_CL", nombre: "Pasaporte", naturaleza: "N", regex: "^[A-Z0-9]{6,12}$", minLength: 6, maxLength: 12, ejemplo: "CL1234567" },
    { id: "RUT_EMPRESA", nombre: "RUT de empresa", naturaleza: "J", regex: "^[0-9]{7,8}-[0-9K]$", minLength: 9, maxLength: 10, ejemplo: "76123456-K" },
  ],
  AR: [
    { id: "DNI_AR", nombre: "DNI", naturaleza: "N", regex: "^[0-9]{7,8}$", minLength: 7, maxLength: 8, ejemplo: "34567890" },
    { id: "PAS_AR", nombre: "Pasaporte", naturaleza: "N", regex: "^[A-Z0-9]{6,12}$", minLength: 6, maxLength: 12, ejemplo: "AAB123456" },
    { id: "CUIT", nombre: "CUIT", naturaleza: "J", regex: "^30-[0-9]{8}-[0-9]$", minLength: 13, maxLength: 13, ejemplo: "30-71234567-3" },
  ],
};

export function getTiposDocumento(paisId: string, naturaleza: "N" | "J"): TipoDocumentoConfig[] {
  return (TIPOS_DOCUMENTO_POR_PAIS[paisId] ?? []).filter((t) => t.naturaleza === naturaleza);
}

export function getConfigDocumento(paisId: string, tipoDocumentoId: string): TipoDocumentoConfig | undefined {
  return (TIPOS_DOCUMENTO_POR_PAIS[paisId] ?? []).find((t) => t.id === tipoDocumentoId);
}

export function validarFormatoDocumento(paisId: string, tipoDocumentoId: string, valor: string): boolean {
  const config = getConfigDocumento(paisId, tipoDocumentoId);
  if (!config) return false;
  return new RegExp(config.regex).test(valor.trim().toUpperCase());
}

export interface Banco {
  id: string;
  nombre: string;
}

export const BANCOS_POR_PAIS: Record<string, Banco[]> = {
  CO: [
    { id: "bancolombia", nombre: "Bancolombia" },
    { id: "bogota", nombre: "Banco de Bogotá" },
    { id: "davivienda", nombre: "Davivienda" },
    { id: "bbva_co", nombre: "BBVA Colombia" },
    { id: "occidente", nombre: "Banco de Occidente" },
    { id: "popular_co", nombre: "Banco Popular" },
    { id: "nequi", nombre: "Nequi" },
    { id: "otro", nombre: "Otro" },
  ],
  MX: [
    { id: "bbva_mx", nombre: "BBVA México" },
    { id: "citibanamex", nombre: "Citibanamex" },
    { id: "santander_mx", nombre: "Santander México" },
    { id: "banorte", nombre: "Banorte" },
    { id: "hsbc_mx", nombre: "HSBC México" },
    { id: "otro", nombre: "Otro" },
  ],
  PE: [
    { id: "bcp", nombre: "BCP" },
    { id: "bbva_pe", nombre: "BBVA Perú" },
    { id: "interbank", nombre: "Interbank" },
    { id: "scotiabank_pe", nombre: "Scotiabank Perú" },
    { id: "nacion_pe", nombre: "Banco de la Nación" },
    { id: "otro", nombre: "Otro" },
  ],
  CL: [
    { id: "chile", nombre: "Banco de Chile" },
    { id: "estado", nombre: "BancoEstado" },
    { id: "santander_cl", nombre: "Santander Chile" },
    { id: "bci", nombre: "BCI" },
    { id: "scotiabank_cl", nombre: "Scotiabank Chile" },
    { id: "otro", nombre: "Otro" },
  ],
  AR: [
    { id: "nacion_ar", nombre: "Banco Nación" },
    { id: "galicia", nombre: "Banco Galicia" },
    { id: "santander_ar", nombre: "Santander Río" },
    { id: "bbva_ar", nombre: "BBVA Argentina" },
    { id: "macro", nombre: "Banco Macro" },
    { id: "otro", nombre: "Otro" },
  ],
};

export function getBancos(paisId: string): Banco[] {
  return BANCOS_POR_PAIS[paisId] ?? [];
}

export const TIPOS_CUENTA = [
  { id: "AHORROS", nombre: "Ahorros" },
  { id: "CORRIENTE", nombre: "Corriente" },
] as const;

export const GENEROS = ["Femenino", "Masculino", "No binario", "Prefiero no decir"];

export const CATEGORIAS = [
  "Moda", "Belleza", "Fitness", "Gaming", "Tecnología", "Viajes",
  "Gastronomía", "Familia y maternidad", "Finanzas personales", "Educación",
  "Música", "Humor y entretenimiento", "Deportes", "Salud y bienestar", "Lifestyle",
];

export const NICHOS = [
  "Skincare", "Streetwear", "Crossfit", "Mobile gaming", "Inteligencia artificial",
  "Turismo de aventura", "Cocina saludable", "Crianza respetuosa", "Inversión y trading",
  "Idiomas", "Producción musical", "Stand-up comedy", "Running", "Yoga", "Minimalismo",
  "Emprendimiento", "Mascotas", "Sostenibilidad",
];

export interface RedSocialCatalogo {
  id: string;
  nombre: string;
  dominios: string[];
  placeholderUsuario: string;
}

export const REDES_SOCIALES: RedSocialCatalogo[] = [
  { id: "instagram", nombre: "Instagram", dominios: ["instagram.com"], placeholderUsuario: "@usuario" },
  { id: "tiktok", nombre: "TikTok", dominios: ["tiktok.com"], placeholderUsuario: "@usuario" },
  { id: "youtube", nombre: "YouTube", dominios: ["youtube.com", "youtu.be"], placeholderUsuario: "Nombre del canal" },
  { id: "facebook", nombre: "Facebook", dominios: ["facebook.com", "fb.com"], placeholderUsuario: "Nombre de página" },
  { id: "x", nombre: "X (Twitter)", dominios: ["x.com", "twitter.com"], placeholderUsuario: "@usuario" },
  { id: "twitch", nombre: "Twitch", dominios: ["twitch.tv"], placeholderUsuario: "Nombre del canal" },
  { id: "linkedin", nombre: "LinkedIn", dominios: ["linkedin.com"], placeholderUsuario: "Nombre de perfil" },
];

export function validarUrlRedSocial(redSocialId: string, url: string): boolean {
  const red = REDES_SOCIALES.find((r) => r.id === redSocialId);
  if (!red) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return red.dominios.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

// --- Documentos requeridos según tipo de representación (grupos 1-5 del sistema actual) ---

export interface DocumentoRequerido {
  grupo: "IDENTIDAD" | "TRIBUTARIO" | "BANCARIO" | "LEGAL" | "CAMARA_COMERCIO";
  nombre: string;
  obligatorio: boolean;
  formatosPermitidos: string[];
  tamanoMaximoMb: number;
}

const DOC_IDENTIDAD: DocumentoRequerido = {
  grupo: "IDENTIDAD",
  nombre: "Documento de identidad (frente y reverso)",
  obligatorio: true,
  formatosPermitidos: ["pdf", "jpg", "png"],
  tamanoMaximoMb: 5,
};

const DOC_BANCARIO: DocumentoRequerido = {
  grupo: "BANCARIO",
  nombre: "Certificación bancaria",
  obligatorio: true,
  formatosPermitidos: ["pdf"],
  tamanoMaximoMb: 5,
};

const DOC_TRIBUTARIO: DocumentoRequerido = {
  grupo: "TRIBUTARIO",
  nombre: "Documento tributario (RUT/RFC/NIT/RUC/CUIT)",
  obligatorio: true,
  formatosPermitidos: ["pdf"],
  tamanoMaximoMb: 5,
};

const DOC_CAMARA: DocumentoRequerido = {
  grupo: "CAMARA_COMERCIO",
  nombre: "Cámara de comercio o registro de sociedad",
  obligatorio: true,
  formatosPermitidos: ["pdf"],
  tamanoMaximoMb: 8,
};

const DOC_LEGAL: DocumentoRequerido = {
  grupo: "LEGAL",
  nombre: "Poder o contrato de representación",
  obligatorio: false,
  formatosPermitidos: ["pdf"],
  tamanoMaximoMb: 8,
};

export function getDocumentosRequeridos(representacion: "DIRECTO" | "MANAGER" | "AGENCIA"): DocumentoRequerido[] {
  switch (representacion) {
    case "DIRECTO":
      return [DOC_IDENTIDAD, DOC_BANCARIO];
    case "MANAGER":
      return [DOC_IDENTIDAD, DOC_TRIBUTARIO, DOC_BANCARIO];
    case "AGENCIA":
      return [DOC_IDENTIDAD, DOC_TRIBUTARIO, DOC_CAMARA, DOC_LEGAL, DOC_BANCARIO];
  }
}

export const MONEDAS = [
  { id: "COP", nombre: "COP - Peso colombiano" },
  { id: "MXN", nombre: "MXN - Peso mexicano" },
  { id: "PEN", nombre: "PEN - Sol peruano" },
  { id: "CLP", nombre: "CLP - Peso chileno" },
  { id: "ARS", nombre: "ARS - Peso argentino" },
  { id: "USD", nombre: "USD - Dólar estadounidense" },
];
