import { APIResponse } from "@/constants/types";
import { endPoints } from "@/constants/urls";

export const register = async ({
  fullName,
  email,
  phone,
  password,
  state,
  referal,
}: {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  password: string;
  referal?: string;
}): Promise<APIResponse> => {
  const data = {
    fullName,
    email,
    phone,
    state,
    password,
    referal,
  };

  try {
    const response = await fetch(endPoints.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    console.log(json);

    if (json.status !== "success")
      return {
        statusCode: "401",
        message: json.message,
        data: null,
        success: false,
        error: true,
      };

    return {
      statusCode: "201",
      message: "Successful",
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
