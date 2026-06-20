import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const DataLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default DataLayout;

const styles = StyleSheet.create({});
