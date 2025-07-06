import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { LoanFormData, loanSchema } from '../schemas/loan.schema';



type CalculateLoanQuoteProps = {
    initialValues?: Partial<LoanFormData>;
    onSubmit: (data: LoanFormData) => void;
    mode?: 'create' | 'edit';
};

const frequencyPayments = [
    {
        label: "Diario",
        value: 4
    },
    {
        label: "Semanal",
        value: 3
    },
    {
        label: "Quincenal",
        value: 2
    },
    {
        label: "Mensual",
        value: 1
    }
]


const CalculateLoanQuoteForm = ({ initialValues = {}, onSubmit, mode = 'create' }: CalculateLoanQuoteProps) => {


    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoanFormData>({
        resolver: zodResolver(loanSchema),
        mode: 'onChange',
        defaultValues: {
            amount: 0,
            frequency: 4,
            numberQuotes: 0,
            interestRate: 5,
            ...initialValues,
        },
    });


    return (
        <View style={styles.container}>


            <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Valor del Prestamo:</Text>
                        <View style={styles.inputWithIcon}>
                            <MaterialIcons name="attach-money" size={20} color="gray" style={styles.icon} />
                            <TextInput
                                placeholder="Amount"
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(value) => field.onChange(Number(value))}
                                value={field.value.toString()}
                            />
                        </View>
                    </View>
                )}
            />
            {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>}

            <Controller
                control={control}
                name="frequency"
                render={({ field }) => (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Frecuencia de Pagos:</Text>
                        <View style={styles.inputWithIcon}>
                            <MaterialIcons name="money" size={20} color="gray" style={styles.icon} />
                            <Picker
                                onValueChange={(itemValue, itemIndex) => {
                                    field.onChange(Number(itemValue))
                                }}
                                style={styles.picker}
                            >

                                {
                                    frequencyPayments.map((frequency) => (
                                        <Picker.Item key={frequency.value} label={frequency.label} value={frequency.value} />
                                    ))
                                }

                            </Picker>
                        </View>

                    </View>
                )}
            />
            {errors.frequency && <Text style={styles.error}>{errors.frequency.message}</Text>}

            <Controller
                control={control}
                name="numberQuotes"
                render={({ field }) => (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Cantidad de Cuotas:</Text>
                        <View style={styles.inputWithIcon}>
                            <MaterialIcons name="numbers" size={20} color="gray" style={styles.icon} />
                            <TextInput
                                placeholder="Cantidad de cuotas"
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(value) => field.onChange(Number(value))}
                                value={field.value.toString()}
                            />
                        </View>
                    </View>
                )}
            />
            {errors.numberQuotes && <Text style={styles.error}>{errors.numberQuotes.message}</Text>}

            <Controller
                control={control}
                name="interestRate"
                render={({ field }) => (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Porcentaje de Interés:</Text>
                        <View style={styles.inputWithIcon}>
                            <MaterialIcons name="percent" size={20} color="gray" style={styles.icon} />
                            <TextInput
                                placeholder="Interest Rate (%)"
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(value) => field.onChange(Number(value))}
                                value={field.value.toString()}
                            />
                        </View>
                    </View>
                )}
            />
            {errors.interestRate && <Text style={styles.error}>{errors.interestRate.message}</Text>}

            <Button title={mode === 'edit' ? 'Actualizar Prestamo' : 'Crear Prestamo'} onPress={handleSubmit(onSubmit)} disabled={!isValid} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fieldContainer: {
        marginBottom: 12,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16

    },
    error: { color: 'red', marginBottom: 10 },
    label: { fontWeight: 'bold', marginBottom: 4, fontSize: 14, color: '#333' },
    picker: {
        height: 50,
        width: '100%',
    },

    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },

    icon: {
        marginRight: 8,
    },


});


export default CalculateLoanQuoteForm;