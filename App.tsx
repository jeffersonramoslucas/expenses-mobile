import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabs } from './navigation/BottomTabs';


export default function App() {
  return (
    <View style={styles.root}>
      <View style={styles.appContainer}>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5', // fundo fora do app
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: '#FFF', 
  },
});
