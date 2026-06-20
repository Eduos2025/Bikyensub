import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="airtime" />
      <Stack.Screen name="cac" />
      <Stack.Screen name="data" />
      <Stack.Screen name="electricity" />
      <Stack.Screen name="exam" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="referral" />
      <Stack.Screen name="set-pin" />
      <Stack.Screen name="transfer" />
      <Stack.Screen name="tv" />
    </Stack>
  );
}
