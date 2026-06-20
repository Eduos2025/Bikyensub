import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useNotificationStore from "../states/notifications";

const NotificationIcon = () => {
  const { colors } = useTheme();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  return (
    <TouchableOpacity
      style={{
        alignSelf: "flex-end",

        margin: 8,
        position: "relative",
      }}
      onPress={() => router.push("/dashboard/notifications")}
    >
      <Ionicons
        name="notifications"
        style={{
          color: colors.text,
          fontSize: 32,
        }}
      />
      <View
        style={{
          backgroundColor: colors.error,
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          width: 16,
          height: 16,
          position: "absolute",
          right: 0,
        }}
      >
        <Text
          style={{
            color: colors.surface,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {unreadCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationIcon;

const styles = StyleSheet.create({});
