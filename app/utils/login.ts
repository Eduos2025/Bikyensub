import { APIResponse } from "@/constants/types";
import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyToken } from "./verify-token";

export const loginWithFingerprint = async (): Promise<APIResponse> => {
  await AsyncStorage.setItem("finger", "1");

  try {
    // ✅ Get stored token
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      alert("No saved login session");
      return {
        statusCode: "400",
        message: "No Token Saved",
        data: null,
        success: false,
        error: true,
      };
    }

    const isVerified = await verifyToken(token);

    if (!isVerified) {
      alert("Session expired. Please login again.");
      return {
        statusCode: "401",
        message: "Session expired. Please login again.",
        data: null,
        success: false,
        error: true,
      };
    }

    return {
      statusCode: "200",
      message: "Login Successful",
      data: [],
      success: true,
      error: false,
    };
  } catch (err: any) {
    console.log(err);
    alert("Error verifying session");
    return {
      statusCode: "500",
      message: err.message,
      data: null,
      success: false,
      error: true,
    };
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<APIResponse> => {
  try {
    const response = await fetch(endPoints.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (json.status !== "success")
      return {
        statusCode: "401",
        message: json.message,
        data: null,
        success: false,
        error: true,
      };

    // ✅ STORE TOKEN
    await AsyncStorage.setItem("user", JSON.stringify(json.data));
    await AsyncStorage.setItem("userToken", json.data.token);

    return {
      statusCode: "200",
      message: "Login Successful",
      data: json.data,
      success: true,
      error: false,
    };
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: "500",
      message: err.message,
      data: null,
      success: false,
      error: true,
    };
  }
};
