import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 12,
        },
        headerShown: false,
      }}
    >
      {/* Aba 1: Fase 1 (CRUD Local) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fase 1: Local',
        }}
      />

      {/* Aba 2: Fase 2 (CRUD com API HTTP) */}
      <Tabs.Screen
        name="api"
        options={{
          title: 'Fase 2: API HTTP',
        }}
      />
    </Tabs>
  );
}