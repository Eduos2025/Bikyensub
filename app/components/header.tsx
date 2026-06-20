import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({
  title,
  showBack = true,
  showHelp = true,
}: {
  title: string;
  showBack?: boolean;
  showHelp?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerLink}>Back</Text>
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.headerTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>
      {showHelp && (
        <TouchableOpacity>
          <Text style={styles.headerLink}>Help</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "center",
  },
});
