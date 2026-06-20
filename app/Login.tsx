import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AlertModal from "./components/AlertModal";
import GradientButton from "./components/buttons";
import { authenticateFingerprint } from "./utils/authenticate-fingerprint";
import { checkFingerprintAvailabe } from "./utils/check-fingerprint-available";
import { login, loginWithFingerprint } from "./utils/login";
import { AppLogo } from "@/constants/images";


const Login = () => {
  const { isDark, colors } = useTheme();
  const [loggedinEmail, setLoggedinEmail] = useState("");

  useEffect(() => {
    const loadEmail = async () => {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        setEmail(user?.email || "");
      }
    };

    loadEmail();
  }, []);

  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [finger, setFinger] = useState<boolean>(false);

  useEffect(() => {
    const getFingerFromStorage = async () => {
      try {
        const storedFinger = await AsyncStorage.getItem("finger");

        if (storedFinger !== null) {
          setFinger(storedFinger === "1"); // convert string → boolean
        }
      } catch (error) {
        console.error("Error retrieving finger from storage:", error);
      }
    };

    getFingerFromStorage();
  }, []);

  const handleFingerprintLogin = async () => {
    try {
      const isAvailable = await checkFingerprintAvailabe();
      if (!isAvailable) {
        alert("Device does not support fingerprint");
        return;
      }

      const authenticate = await authenticateFingerprint(
        "Login with Fingerprint",
      );

      if (!authenticate) {
        alert("Cancelled");
        return;
      }
      const res = await loginWithFingerprint();

      if (!res) {
        alert("Fingerprint failed");
        return;
      }
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (res.success) {
        setAlertTitle("Success");
        setAlertMessage("Login successful");
        setAlertVisible(true);

        router.replace("/dashboard");
      }

      if (res.error) {
        setAlertTitle("Error");
        setAlertMessage(res.message);

        setAlertVisible(true);
        return;
      }
    } catch (err) {
      console.log(err);
      setAlertTitle("Error");
      setAlertMessage("Something went wrong. Please try again.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 3 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 40, marginBottom: 50 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <Image
              source={AppLogo}
              style={{ width: 150, height: 150, borderRadius: 10 }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              marginTop: 30,
              color: colors.primary,
              fontSize: 27,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Login
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            Welcome back! Kindly enter your details to Login!
          </Text>
        </View>

        {/* Email Input */}
        <View>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 12,
              marginBottom: 2,
              marginLeft: 3,
            }}
          >
            Enter Email Address
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={colors.textMuted}
            style={{
              height: 50,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              marginBottom: 20,
              color: colors.text,
              backgroundColor: colors.surface,
            }}
          />
        </View>

        {/* Password Input */}
        <View>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 12,
              marginBottom: 2,
              marginLeft: 3,
            }}
          >
            Enter Password
          </Text>
          <View
            style={{
              height: 50,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              backgroundColor: colors.surface,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, color: colors.text }}
            />
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.textMuted}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/ForgotPassword")}
            style={{ alignSelf: "flex-end", marginBottom: 20, marginTop: -10 }}
          >
            <Text
              style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <GradientButton
          loading={isLoading}
          title="Login"
          onPress={handleLogin}
        />

        {/* Fingerprint Login */}

        {finger && (
          <TouchableOpacity
            onPress={() => {
              setStateModalVisible(true);
              handleFingerprintLogin();
            }}
          >
            <Image
              source={require("@/assets/images/fingerprint.png")}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginTop: 60,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                marginBottom: 100,
                textAlign: "center",
                marginTop: 10,
                color: colors.primary,
              }}
            >
              Or Login with Fingerprint
            </Text>
          </TouchableOpacity>
        )}

        {/* Go to Register */}
        <TouchableOpacity onPress={() => router.push("/Register")}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginTop: 20,
              color: colors.primary,
            }}
          >
            Don't Have an Account?
          </Text>
        </TouchableOpacity>

        {/* Fingerprint Modal */}
        <Modal
          isVisible={stateModalVisible}
          onBackdropPress={() => setStateModalVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "60%",
              padding: 16,
            }}
          >
            <Image
              source={require("@/assets/images/fingerprint.png")}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginTop: 60,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                marginBottom: 30,
                textAlign: "center",
                marginTop: 10,
                color: colors.primary,
              }}
            >
              Place your finger on the fingerprint scanner to Login
            </Text>
          </View>
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          isVisible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
function fingerprintLogin() {
  throw new Error("Function not implemented.");
}
