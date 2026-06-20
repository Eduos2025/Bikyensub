import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "./login";

export const updatePassword = async (
  email: string,
  password: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    // 1️⃣ First Verify Current Password (this will give us a fresh token)

    const res = await login(email, password);

    if (res.error) {
      return false;
    }

    // ✅ Update fresh session tokens locally
    await AsyncStorage.setItem("user", JSON.stringify(res.data));
    await AsyncStorage.setItem("userToken", res.data.token);
    // await AsyncStorage.setItem("finger", loginData.finger);

    // 2️⃣ Now Update to New Password using the FRESH token
    const response = await fetch(endPoints.setPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: res.data.token,
        type: "loginPassword",
        value: newPassword,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!data.success) return false;

    return true;
  } catch (error) {
    return false;
  }
};
