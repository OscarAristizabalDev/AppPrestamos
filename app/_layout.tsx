import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>

                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerTitle: "Title",
                        headerShown: true,
                        // headerRight: () => (
                        //     <Button
                        //         onPress={() => alert('Button pressed!')}
                        //         title="Press me"
                        //         color="#000"
                        //     />
                        // ),
                        // headerLeft: () => (
                        //     <Button
                        //         onPress={() => alert('Button pressed!')}
                        //         title="Press me"
                        //         color="#000"
                        //     />
                        // ),
                        // headerSearchBarOptions: {
                        //     placeholder: 'Search...',
                        //     onChangeText: (event) => {
                        //         console.log('Search text:', event.nativeEvent.text);
                        //     },
                        //     onCancelButtonPress: () => {
                        //         console.log('Search canceled');
                        //     },
                        //     onSearchButtonPress: (event) => {
                        //         console.log('Search submitted:', event.nativeEvent.text);
                        //     },
                        // },
                    }} />
            </Stack>
        </>

    );
}