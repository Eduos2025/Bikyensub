import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const generateAccount = async (): Promise<boolean> => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");

    if (!userToken) return false;

    const response = await fetch(endPoints.generateAccount, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: userToken }),
    });

    const data = await response.json();

    console.log(data);

    if (data.status === "error") return false;

    return true;
  } catch (error) {
    console.error("Account fetch error:", error);
    return false;
  }
};
