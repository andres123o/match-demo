import type { Campana, Entrega, Influencer, EstadoSolicitud } from "./types";

// "Base de datos" del prototipo: vive en localStorage del navegador.
// Cada función es async y simula latencia de red a propósito: el objetivo
// es que estas firmas sean intercambiables por llamadas fetch() reales el
// día que exista un backend, sin tocar ninguna pantalla.

const DB_KEY = "match_prototype_db_v3";
const LATENCY_MS = 350;

interface DB {
  influencers: Influencer[];
  campanas: Campana[];
  entregas: Entrega[];
}

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function seed(): DB {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * 86400000).toISOString();

  const influencers: Influencer[] = [
    {
      id: "inf_1",
      representacion: "DIRECTO",
      nombreCompleto: "Valentina Rojas",
      genero: "Femenino",
      paisId: "CO",
      ciudadId: "Bogotá",
      correo: "valentina.rojas@example.com",
      telefono: "3011234567",
      whatsapp: "3011234567",
      biografia: "Creadora de contenido de moda y lifestyle en Bogotá.",
      categorias: ["Moda", "Lifestyle"],
      nichos: ["Streetwear", "Minimalismo"],
      documentos: [],
      banco: { bancoId: "bancolombia", bancoNombre: "Bancolombia", tipoCuenta: "AHORROS", numeroCuenta: "1234567890" },
      redesSociales: [
        { id: "rs_1", plataforma: "instagram", usuario: "@valerojas", perfilUrl: "https://instagram.com/valerojas", seguidores: 128000, engagement: 4.2, alcancePromedio: 45000, viewsPromedio: 60000, verificado: true, fechaActualizacion: iso(5) },
        { id: "rs_2", plataforma: "tiktok", usuario: "@valerojas", perfilUrl: "https://tiktok.com/@valerojas", seguidores: 210000, engagement: 6.1, alcancePromedio: 90000, viewsPromedio: 150000, verificado: false, fechaActualizacion: iso(5) },
      ],
      estado: "ACTIVO",
      creadoEn: iso(40),
    },
    {
      id: "inf_2",
      representacion: "MANAGER",
      entidadId: "ent_mgr_1",
      nombreCompleto: "Kevin Torres",
      genero: "Masculino",
      paisId: "MX",
      ciudadId: "Guadalajara",
      correo: "kevin.torres@example.com",
      telefono: "3312345678",
      biografia: "Gaming y tecnología, streams diarios.",
      categorias: ["Gaming", "Tecnología"],
      nichos: ["Mobile gaming", "Inteligencia artificial"],
      documentos: [],
      banco: { bancoId: "bbva_mx", bancoNombre: "BBVA México", tipoCuenta: "CORRIENTE", numeroCuenta: "0987654321" },
      redesSociales: [
        { id: "rs_3", plataforma: "youtube", usuario: "KevinPlays", perfilUrl: "https://youtube.com/@kevinplays", seguidores: 340000, engagement: 3.5, alcancePromedio: 80000, viewsPromedio: 120000, verificado: true, fechaActualizacion: iso(2) },
      ],
      estado: "ACTIVO",
      creadoEn: iso(25),
    },
    {
      id: "inf_3",
      representacion: "AGENCIA",
      entidadId: "ent_ag_1",
      nombreCompleto: "Camila Fuentes",
      genero: "Femenino",
      paisId: "CL",
      ciudadId: "Santiago",
      correo: "camila.fuentes@example.com",
      biografia: "Fitness y bienestar.",
      categorias: ["Fitness", "Salud y bienestar"],
      nichos: ["Crossfit", "Yoga"],
      documentos: [],
      banco: { bancoId: "chile", bancoNombre: "Banco de Chile", tipoCuenta: "AHORROS", numeroCuenta: "5647382910" },
      redesSociales: [
        { id: "rs_4", plataforma: "instagram", usuario: "@camifit", perfilUrl: "https://instagram.com/camifit", seguidores: 95000, engagement: 5.8, alcancePromedio: 30000, viewsPromedio: 40000, verificado: false, fechaActualizacion: iso(10) },
      ],
      estado: "PENDIENTE_REVISION",
      creadoEn: iso(3),
    },
  ];

  const campanas: Campana[] = [
    { id: "camp_1", influencerId: "inf_1", marca: "Aurelia Cosmetics", nombre: "Lanzamiento colección verano", montoAcordado: 3500000, moneda: "COP", fechaInicio: iso(20), fechaEntrega: iso(5), estado: "COMPLETADA" },
    { id: "camp_2", influencerId: "inf_1", marca: "Urbana Sportswear", nombre: "Serie de reels ropa deportiva", montoAcordado: 2200000, moneda: "COP", fechaInicio: iso(10), estado: "ACTIVA" },
    { id: "camp_3", influencerId: "inf_2", marca: "NeoTech Gaming", nombre: "Integración de producto en stream", montoAcordado: 12000, moneda: "MXN", fechaInicio: iso(8), estado: "EN_REVISION" },
    { id: "camp_4", influencerId: "inf_2", marca: "ChipEnergy", nombre: "Video reseña de auriculares", montoAcordado: 8000, moneda: "MXN", fechaInicio: iso(2), estado: "ACTIVA" },
    { id: "camp_5", influencerId: "inf_3", marca: "VitalFit Suplementos", nombre: "Rutina fitness patrocinada", montoAcordado: 450000, moneda: "CLP", fechaInicio: iso(18), fechaEntrega: iso(15), estado: "ACTIVA" },
    { id: "camp_6", influencerId: "inf_3", marca: "Yoga Calma Studio", nombre: "Serie de bienestar mental", montoAcordado: 300000, moneda: "CLP", fechaInicio: iso(4), estado: "ACTIVA" },
  ];

  // Cada Entrega empaqueta la factura y la evidencia de resultados de una
  // misma campaña: es lo que Match revisa y aprueba para poder pagarle al
  // creador por esa campaña.
  const entregas: Entrega[] = [
    {
      id: "ent_1",
      influencerId: "inf_1",
      campanaId: "camp_1",
      numeroFactura: "F-0001",
      monto: 3500000,
      moneda: "COP",
      fechaEmision: iso(6),
      archivoFacturaNombre: "factura_f0001.pdf",
      archivoFacturaUrl: "",
      tipoEvidencia: "METRICAS",
      tituloEvidencia: "Resultados campaña verano - Instagram",
      redSocialId: "rs_1",
      alcance: 42000,
      impresiones: 61000,
      engagement: 4.1,
      estado: "APROBADA",
      enviadoPor: "INFLUENCER",
      enviadoEn: iso(6),
      comentarioAdmin: "Pago procesado.",
    },
    {
      id: "ent_2",
      influencerId: "inf_2",
      campanaId: "camp_3",
      numeroFactura: "F-0002",
      monto: 12000,
      moneda: "MXN",
      fechaEmision: iso(1),
      archivoFacturaNombre: "factura_f0002.pdf",
      archivoFacturaUrl: "",
      tipoEvidencia: "EVIDENCIA",
      tituloEvidencia: "Evidencia integración en vivo",
      linkContenido: "https://youtube.com/watch?v=demo",
      estado: "PENDIENTE",
      enviadoPor: "REPRESENTANTE",
      enviadoEn: iso(1),
    },
    {
      id: "ent_3",
      influencerId: "inf_3",
      campanaId: "camp_5",
      numeroFactura: "F-0003",
      monto: 450000,
      moneda: "CLP",
      fechaEmision: iso(15),
      archivoFacturaNombre: "factura_f0003.pdf",
      archivoFacturaUrl: "",
      tipoEvidencia: "LIBRE",
      tituloEvidencia: "Reporte mensual de actividad",
      descripcionEvidencia: "Resumen de publicaciones del mes.",
      estado: "RECHAZADA",
      enviadoPor: "REPRESENTANTE",
      enviadoEn: iso(15),
      comentarioAdmin: "Falta orden de compra asociada.",
    },
  ];

  return { influencers, campanas, entregas };
}

function readDB(): DB {
  if (typeof window === "undefined") return seed();
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const initial = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const initial = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
}

function writeDB(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDB() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DB_KEY);
}

// --- Influencers ---

export async function listInfluencers(): Promise<Influencer[]> {
  return delay(readDB().influencers);
}

export async function getInfluencer(id: string): Promise<Influencer | undefined> {
  return delay(readDB().influencers.find((i) => i.id === id));
}

export async function createInfluencer(data: Omit<Influencer, "id" | "creadoEn" | "estado">): Promise<Influencer> {
  const db = readDB();
  const nuevo: Influencer = {
    ...data,
    id: uid(),
    estado: "PENDIENTE_REVISION",
    creadoEn: new Date().toISOString(),
  };
  db.influencers.push(nuevo);
  writeDB(db);
  return delay(nuevo);
}

export async function updateInfluencer(id: string, patch: Partial<Omit<Influencer, "id">>): Promise<Influencer | undefined> {
  const db = readDB();
  const influencer = db.influencers.find((i) => i.id === id);
  if (!influencer) return delay(undefined);
  Object.assign(influencer, patch);
  writeDB(db);
  return delay(influencer);
}

// --- Campañas ---

export async function listCampanas(filter?: { influencerId?: string }): Promise<Campana[]> {
  const items = readDB().campanas;
  const filtered = filter?.influencerId ? items.filter((c) => c.influencerId === filter.influencerId) : items;
  return delay([...filtered].sort((a, b) => (a.fechaInicio < b.fechaInicio ? 1 : -1)));
}

export async function getCampana(id: string): Promise<Campana | undefined> {
  return delay(readDB().campanas.find((c) => c.id === id));
}

// --- Entregas (factura + evidencia, por campaña) ---

export async function listEntregas(filter?: { influencerId?: string }): Promise<Entrega[]> {
  const items = readDB().entregas;
  const filtered = filter?.influencerId ? items.filter((e) => e.influencerId === filter.influencerId) : items;
  return delay([...filtered].sort((a, b) => (a.enviadoEn < b.enviadoEn ? 1 : -1)));
}

export async function createEntrega(data: Omit<Entrega, "id" | "estado" | "enviadoEn">): Promise<Entrega> {
  const db = readDB();
  const nueva: Entrega = { ...data, id: uid(), estado: "PENDIENTE", enviadoEn: new Date().toISOString() };
  db.entregas.push(nueva);
  writeDB(db);
  return delay(nueva);
}

export async function updateEntregaEstado(id: string, estado: EstadoSolicitud, comentarioAdmin?: string): Promise<Entrega | undefined> {
  const db = readDB();
  const entrega = db.entregas.find((e) => e.id === id);
  if (!entrega) return delay(undefined);
  entrega.estado = estado;
  if (comentarioAdmin !== undefined) entrega.comentarioAdmin = comentarioAdmin;
  writeDB(db);
  return delay(entrega);
}
