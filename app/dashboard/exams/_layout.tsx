import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ExamsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="failed" />
      <Stack.Screen name="success" />
    </Stack>
  );
};

export default ExamsLayout;

const styles = StyleSheet.create({});
