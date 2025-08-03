import { FontAwesome6 } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "News Feed",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="submit"
        options={{
          title: "Submit News",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
