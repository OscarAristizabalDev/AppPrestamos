import {
  Client,
  UpdateClient,
  UpdateClientSchema,
} from "../schemas/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import BaseModal from "./ClientModalBase";
import FormFields from "./ClientFormFields";

type EditProps = {
  client: Client;
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: UpdateClient) => void;
  isSaving?: boolean;
};

const EditModal = ({
  client,
  isVisible,
  onClose,
  onSave,
  isSaving,
}: EditProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateClient>({
    resolver: zodResolver(UpdateClientSchema),
    mode: "onChange",
    defaultValues: client,
  });

  useEffect(() => {
    if (isVisible && client) reset({ ...client });
  }, [isVisible, client, reset]);

  return (
    <BaseModal
      mode="edit"
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

export default EditModal;
