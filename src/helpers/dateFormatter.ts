type DateFormat =
  | "short" // 08/05/2026
  | "long" // 8 de mayo de 2026
  | "datetime" // 08/05/2026, 14:37
  | "full" // 8 de mayo de 2026, 14:37:44
  | "time" // 14:37
  | "relative"; // Hace 2 minutos

export const formatDate = (
  isoString?: string | Date | null,
  format: DateFormat = "short",
): string => {
  if (!isoString) return "—";

  const date = typeof isoString === "string" ? new Date(isoString) : isoString;

  if (isNaN(date.getTime())) return "Fecha inválida";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Formato relativo (hace X tiempo)
  if (format === "relative") {
    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 30) return `Hace ${diffDays} d`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  }

  // Intl para respetar locale del dispositivo
  const locale = "es-CO"; // o detectar del dispositivo con expo-localization

  /**
   * Detectar el idioma del dispositivo automáticamente
   import * as Localization from "expo-localization";
   const locale = Localization.locale; // "es-CO", "en-US", etc.
   */

  switch (format) {
    case "short":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

    case "long":
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

    case "datetime":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

    case "full":
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);

    case "time":
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

    default:
      return date.toISOString();
  }
};

// Helper específico para mostrar fechas de cliente (registrationDate, birthdate, etc.)
export const formatClientDate = (
  isoString?: string | null,
  includeTime: boolean = false,
): string => {
  if (!isoString) return "No registrada";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Fecha inválida";

  // Si es birthdate (sin hora, empieza a medianoche UTC), mostrar solo fecha
  const isMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0;

  if (isMidnight && !includeTime) {
    return formatDate(isoString, "short"); // 08/05/2026
  }

  return formatDate(isoString, "datetime"); // 08/05/2026, 14:37
};
