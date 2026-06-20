import { endPoints } from "@/constants/urls";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import useUserStore from "../states/user";
import { generateAccount } from "../utils/generate-account";
import AlertModal from "./AlertModal";
import GradientButton from "./buttons";

const IdentityVerification = () => {
  const { isDark, colors } = useTheme();
  const [isBVN, setIsBVN] = useState(true);
  const [nin, setNIN] = useState("");
  const [bvn, setBVN] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [buttonTitle, setButtonTitle] = useState("Proceed");

  const submit = async () => {
    if (!nin && !bvn) {
      setAlertVisible(true);
      setAlertTitle("Warning");
      setAlertMessage("Please enter your BVN or NIN");
      return;
    }
    setisLoading(true);
    setButtonTitle("Processing KYC...");
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      if (!userToken) return;

      const response = await fetch(endPoints.kyc, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Token": userToken,
        },
        body: JSON.stringify({
          nin,
          bvn,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setAlertVisible(true);
        setAlertTitle("Failed");
        setAlertMessage(data.message);
        setButtonTitle("Proceed");
        return;
      }

      setButtonTitle("Generating account...");

      const res = await generateAccount();

      if (!res) {
        setAlertVisible(true);
        setAlertTitle("Failed");
        setAlertMessage("Something went wrong");
        setButtonTitle("Proceed");

        return;
      }

      await useUserStore.getState().refreshDashboard();
      setAlertVisible(true);
      setAlertTitle("Successful");
      setAlertMessage("Generating account, It might take a few minutes");
    } catch (error) {
      console.error("Account fetch error:", error);
    } finally {
      setisLoading(false);
      setButtonTitle("Proceed");
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={[{ backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ padding: 32 }}>
          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: colors.accent }]}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.surface}
              />
            </View>

            <Text style={styles.infoText}>
              Please provide valid information. Note that information
              verification is limited to 3 attempts per day. Continuous attempts
              with invalid information may result in your account being blocked.
            </Text>
          </View>

          {/* Full Name */}
          {/* <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>

                <TextInput
                  placeholder={user?.name ?? "Full Name"}
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                />
              </View> */}

          {/* Identity Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Identity Type</Text>

            <View style={styles.identityRow}>
              <TouchableOpacity
                style={[
                  styles.identityButton,
                  { backgroundColor: isBVN ? colors.accent : undefined },
                ]}
                onPress={() => {
                  setIsBVN(true);
                }}
              >
                <Text
                  style={[
                    styles.identityText,
                    { color: isBVN ? colors.surface : undefined },
                  ]}
                >
                  BVN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.identityButton,
                  { backgroundColor: !isBVN ? colors.accent : undefined },
                ]}
                onPress={() => {
                  setIsBVN(false);
                }}
              >
                <Text
                  style={[
                    styles.identityText,
                    { color: !isBVN ? colors.surface : undefined },
                  ]}
                >
                  NIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Identity Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Identity Number</Text>

            <TextInput
              placeholder="Identity Number"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              keyboardType="numeric"
              onChangeText={(val) => {
                isBVN ? setBVN(val) : setNIN(val);
              }}
            />
          </View>

          {/* Date of Birth */}
          {/* <View style={styles.formGroup}>
              <Text style={styles.label}>Date of birth</Text>

              <TextInput
                placeholder="Date of birth"
                placeholderTextColor="#A9A9A9"
                style={styles.input}
              />
            </View> */}

          {/* Proceed Button */}

          <GradientButton title={buttonTitle} onPress={submit} />
        </View>

        <AlertModal
          isVisible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default IdentityVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContainer: {
    backgroundColor: "#3a3838",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    marginTop: "auto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  infoBox: {
    backgroundColor: "#2643C4",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  infoText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "500",

    marginBottom: 10,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111111",
    backgroundColor: "#FFFFFF",
  },

  identityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  identityButton: {
    width: "48%",
    height: 56,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  identityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222222",
  },

  proceedButton: {
    marginTop: 14,
    height: 58,
    backgroundColor: "#B6B6B6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  proceedText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
