import { APIResponse } from "@/constants/types";
import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDataTypes = async (networkID: string): Promise<APIResponse> => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) {
      return {
        error: true,
        success: false,
        data: null,
        statusCode: "401",
        message: "Session Expired",
      };
    }

    const response = await fetch(endPoints.getDataTypes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: userToken,
        serviceID: `${networkID}-data`,
      }),
    });

    const data = await response.json();

    if (data.status !== "success") {
      return {
        error: true,
        success: false,
        data: null,
        statusCode: "400",
        message: data.message,
      };
    }

    // Prepend "Data Bundle" as it's the standard type
    const formattedTypes = [
      { name: "DATA BUNDLE" },
      ...data.data.types.map((t: any) => ({
        name: t.name || t,
        id: t.id,
        plan_id: t.plan_id || t.id, // Support different ID aliases
      })),
    ];

    return {
      error: false,
      success: true,
      data: formattedTypes,
      statusCode: "200",
      message: "Successful",
    };
  } catch (error: any) {
    return {
      error: true,
      success: false,
      data: null,
      statusCode: "500",
      message: error.message,
    };
  }
};
