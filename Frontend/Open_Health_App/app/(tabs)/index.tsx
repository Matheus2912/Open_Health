import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
      <View style={styles.container}>
        <Feather name="check-circle" size={64} color="#0EA5E9" style={styles.icon} />
        <Text style={styles.title}>Login Realizado!</Text>
        <Text style={styles.subtitle}>Esta será a área logada (Dashboard) onde aparecerão os dados e exames do paciente.</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 24 },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center' }
});