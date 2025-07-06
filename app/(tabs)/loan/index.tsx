import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";



export default function LoanScreen() {

  const buttonOptions = [
    { title: 'Listar Prestamossss', onPress: () => router.push('/loan/LoanListScreen') },
    { title: 'Crear Prestamo', onPress: () => router.push('/loan/CreateLoanScreen') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        buttonOptions.map((btn, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={btn.onPress}>
            <Text style={styles.buttonText}>{btn.title}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 25, // Increased vertical padding for height
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },


});