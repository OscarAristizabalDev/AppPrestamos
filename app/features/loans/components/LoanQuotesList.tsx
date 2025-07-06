
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Quote } from "../interfaces/quote.interface";

type LoanQuotesListProps = {
    quotes: Quote[],
    onBack?: () => void;
}

const LoanQuotesList = ({ quotes, onBack }: LoanQuotesListProps) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de Cuotas</Text>
            <FlatList
                data={quotes}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.quoteItem}>
                        <Text style={styles.quoteText}>Cuota {item.number}</Text>
                        <Text style={styles.quoteText}>Fecha de Pago: ${item.expirationDate.toString()}</Text>
                        <Text style={styles.quoteText}>Valor Cuota: ${item.value.toFixed(2)}</Text>
                        <Text style={styles.quoteText}>Interés: ${item.interestValue.toFixed(2)}</Text>
                        <Text style={styles.quoteText}>Total a Pagar: ${item.totalValue.toFixed(2)}</Text>
                    </View>
                )}
            />
            {onBack && <Button title="Volver" onPress={onBack} />}
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, // This is crucial for FlatList to scroll
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    quoteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    quoteText: {
        fontSize: 14,
        color: '#333',
    },
});


export default LoanQuotesList;