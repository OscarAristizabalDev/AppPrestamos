import { DatePickerField } from "@/src/components/ui/DatePickerField";
import { SimpleDropdown } from "@/src/components/ui/Dropdown";
import { InputField } from "@/src/components/ui/InputField";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useDocTypes } from "../hooks/useDocTypes";
import { DocumentType } from "../interfaces/typedocument";
import { TextArea } from "@/src/components/ui/TextArea";
import { useDocTypeStore } from "../store/docType.store";

const FormFields = ({
  control,
  errors,
  isSaving,
}: {
  control: any;
  errors: any;
  isSaving?: boolean;
}) => {
  const documentTypes = useDocTypeStore((state) => state.items);
  const isLoaded = useDocTypeStore((state) => state.isLoaded);
  return (
    <>
      <Controller
        control={control}
        name="names"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Nombres"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.names && (
              <Text style={styles.error}>{String(errors.names?.message)}</Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="surnames"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Apellidos"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.surnames && (
              <Text style={styles.error}>
                {String(errors.surnames?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Correo Electrónico"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.email && (
              <Text style={styles.error}>{String(errors.email?.message)}</Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Teléfono"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.phoneNumber && (
              <Text style={styles.error}>
                {String(errors.phoneNumber?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Dirección"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.address && (
              <Text style={styles.error}>
                {String(errors.address?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="birthdate"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <DatePickerField
              label="Fecha Nacimiento"
              onChange={onChange}
              value={value}
            />
            {errors.birthdate && (
              <Text style={styles.error}>
                {String(errors.birthdate?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="typeDocument"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <SimpleDropdown
              data={documentTypes}
              disabled={isSaving || !isLoaded}
              labelKey="description"
              valueKey="id"
              value={value || null}
              onSelect={onChange}
              label="Tipo de documento"
              placeholder="Seleccione"
            />
            {errors.typeDocument && (
              <Text style={styles.error}>
                {String(errors.typeDocument?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="documentNumber"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Número Documento"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.documentNumber && (
              <Text style={styles.error}>
                {String(errors.documentNumber?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="employmentStatus"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Estado Empleo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.employmentStatus && (
              <Text style={styles.error}>
                {String(errors.employmentStatus?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="employerName"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Nombre Empresa"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.employerName && (
              <Text style={styles.error}>
                {String(errors.employerName?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="monthlyIncome"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Ingreso Mensual"
              value={value?.toString() ?? ""}
              onChangeText={(text) => {
                const numeric = text === "" ? undefined : Number(text);
                onChange(isNaN(numeric as number) ? undefined : numeric);
              }}
              onBlur={onBlur}
              isSaving={isSaving}
              keyboardType="numeric"
            />
            {errors.monthlyIncome && (
              <Text style={styles.error}>
                {String(errors.monthlyIncome?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="creditScore"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Puntuación Crediticia"
              value={value?.toString() ?? ""}
              onChangeText={(text) => {
                const numeric = text === "" ? undefined : Number(text);
                onChange(isNaN(numeric as number) ? undefined : numeric);
              }}
              onBlur={onBlur}
              isSaving={isSaving}
              keyboardType="numeric"
            />
            {errors.creditScore && (
              <Text style={styles.error}>
                {String(errors.creditScore?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="riskCategory"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <InputField
              label="Categoria riesgo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isSaving={isSaving}
            />
            {errors.riskCategory && (
              <Text style={styles.error}>
                {String(errors.riskCategory?.message)}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="notes"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.fieldContainer}>
            <TextArea
              label="Notas"
              value={value}
              onChangeText={onChange}
              placeholder="Escribe aquí..."
              resizable
              minHeight={80}
              maxHeight={150}
            />
            {errors.notes?.message && (
              <Text style={styles.error}>{String(errors.notes?.message)}</Text>
            )}
          </View>
        )}
      />
    </>
  );
};

export default FormFields;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 12,
  },
  error: { color: "red", marginBottom: 10 },
});
