import { useForm, useWatch } from "react-hook-form";
import { Client, ClientSchema } from "../schemas/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultClientValues } from "../helpers/deafultValues";
import { useEffect } from "react";
import BaseModal from "./ClientModalBase";
import FormFields from "./ClientFormFields";

type CreateProps = {
  client?: never;
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: Client) => void;
  isSaving?: boolean;
};

const CreateModal = ({ isVisible, onClose, onSave, isSaving }: CreateProps) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<Client>({
    resolver: zodResolver(ClientSchema),
    mode: "onChange",
    defaultValues: getDefaultClientValues(),
  });

  const names = useWatch({ control, name: "names" });
  const surnames = useWatch({ control, name: "surnames" });

  // Auto-completar fullName
  useEffect(() => {
    const full = `${names || ""} ${surnames || ""}`.trim();
    setValue("fullName", full || undefined, { shouldValidate: true });
  }, [names, surnames, setValue]);

  useEffect(() => {
    if (isVisible) reset(getDefaultClientValues());
  }, [isVisible, reset]);

  return (
    <BaseModal
      mode="create"
      isVisible={isVisible}
      onClose={onClose}
      isSaving={isSaving}
      isValid={isValid}
      onSubmit={handleSubmit(onSave)}
    >
      <FormFields control={control} errors={errors} isSaving={isSaving} />
    </BaseModal>
  );
};

export default CreateModal;
