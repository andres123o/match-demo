// Modelo de dominio del prototipo.
// Refleja los campos reales del sistema Match CRM actual (representación,
// datos del influencer, redes sociales) y agrega Facturas y Reportes.

export type TipoRepresentacion = "DIRECTO" | "MANAGER" | "AGENCIA";

export type Naturaleza = "N" | "J"; // Natural / Jurídica

export interface Documento {
  id: string;
  grupo: "IDENTIDAD" | "TRIBUTARIO" | "BANCARIO" | "LEGAL" | "CAMARA_COMERCIO";
  tipoDocumento: string;
  nombreArchivo: string;
  urlSimulada: string; // en el prototipo, un object URL local
  subidoEn: string;
}

export interface ReferenciaBancaria {
  bancoId: string;
  bancoNombre: string;
  tipoCuenta: "AHORROS" | "CORRIENTE";
  numeroCuenta: string;
}

export interface Entidad {
  id: string;
  tipo: "MANAGER" | "AGENCIA";
  paisId: string;
  tipoDocumentoId: string;
  numeroDocumento: string;
  nombre: string;
  nombreComercial?: string;
  contactoPrincipal?: string;
  correo: string;
  telefono?: string;
  whatsapp?: string;
  sitioWeb?: string;
  ciudadId?: string;
  condicionesComerciales?: string;
  observaciones?: string;
}

export interface RedSocial {
  id: string;
  plataforma: string; // Instagram, TikTok, YouTube, Facebook, X...
  usuario: string;
  perfilUrl: string;
  seguidores: number;
  engagement?: number;
  alcancePromedio?: number;
  viewsPromedio?: number;
  verificado: boolean;
  fechaActualizacion: string;
}

export interface Influencer {
  id: string;
  representacion: TipoRepresentacion;
  entidadId?: string; // si representacion !== DIRECTO
  nombreCompleto: string;
  genero: string;
  paisId: string;
  ciudadId?: string;
  correo: string;
  telefono?: string;
  whatsapp?: string;
  biografia?: string;
  fotoUrl?: string;
  categorias: string[];
  nichos: string[];
  documentos: Documento[];
  banco?: ReferenciaBancaria;
  redesSociales: RedSocial[];
  estado: "ACTIVO" | "PENDIENTE_REVISION";
  creadoEn: string;
}

export type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";

// Una campaña es el trato concreto entre una marca y el influencer: la unidad
// contra la que se rinde cuentas (se sube evidencia y se factura).
export type EstadoCampana = "ACTIVA" | "EN_REVISION" | "COMPLETADA" | "CANCELADA";

export interface Campana {
  id: string;
  influencerId: string;
  marca: string;
  nombre: string;
  descripcion?: string;
  montoAcordado: number;
  moneda: string;
  fechaInicio: string;
  fechaEntrega?: string;
  estado: EstadoCampana;
}

export type TipoEvidencia = "METRICAS" | "EVIDENCIA" | "LIBRE";

// Una Entrega es el paquete único que el creador envía por campaña: la
// factura y la evidencia de resultados van juntas, porque a Match le pagan
// (y le paga al creador) contra ese paquete completo, no por partes sueltas.
export interface Entrega {
  id: string;
  influencerId: string;
  campanaId: string;

  // Factura
  numeroFactura: string;
  monto: number;
  moneda: string;
  fechaEmision: string;
  archivoFacturaNombre: string;
  archivoFacturaUrl: string;
  notaFactura?: string;

  // Evidencia / reporte de resultados de la campaña
  tipoEvidencia: TipoEvidencia;
  tituloEvidencia: string;
  redSocialId?: string;
  alcance?: number;
  impresiones?: number;
  engagement?: number;
  linkContenido?: string;
  descripcionEvidencia?: string;
  archivoEvidenciaNombre?: string;
  archivoEvidenciaUrl?: string;

  // Estado compartido: se aprueba o rechaza el paquete completo
  estado: EstadoSolicitud;
  comentarioAdmin?: string;
  enviadoPor: "INFLUENCER" | "REPRESENTANTE";
  enviadoEn: string;
}

export type Rol = "INFLUENCER" | "REPRESENTANTE" | "ADMIN";

export interface Sesion {
  rol: Rol;
  influencerId?: string; // presente si rol es INFLUENCER o REPRESENTANTE
  nombre: string;
}
