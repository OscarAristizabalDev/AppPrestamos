export type DeleteDialogState = "confirm" | "deleting" | "success";

export interface DialogConfig {
  title: string;
  message: string;
  icon: string;
  iconColor: string;
  confirmText: string;
  cancelText: string;
  confirmButtonColor: string;
  mode: "decision" | "info";
  disabled: boolean;
}

export const getDeleteDialogConfig = (
  state: DeleteDialogState,
  entityName: string,
): DialogConfig => {
  const configs: Record<DeleteDialogState, DialogConfig> = {
    confirm: {
      title: "Eliminar cliente",
      message: `¿Estás seguro de que deseas eliminar a ${entityName}? Esta acción no se puede deshacer.`,
      icon: "alert-circle",
      iconColor: "#FF453A",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      confirmButtonColor: "#FF453A",
      mode: "decision" as const,
      disabled: false,
    },
    deleting: {
      title: "Eliminando...",
      message: `Eliminando registro de ${entityName}.`,
      icon: "loading", // o "sync" si usás MaterialCommunityIcons
      iconColor: "#FF9500",
      confirmText: "Eliminando...",
      cancelText: "", // oculto durante carga
      confirmButtonColor: "#666",
      mode: "info" as const, // solo botón de cerrar/ninguno
      disabled: true,
    },
    success: {
      title: "¡Eliminado!",
      message: `${entityName} ha sido eliminado correctamente.`,
      icon: "check-circle",
      iconColor: "#34C759",
      confirmText: "Aceptar",
      cancelText: "",
      confirmButtonColor: "#34C759",
      mode: "info" as const,
      disabled: true,
    },
  };
  return configs[state];
};
