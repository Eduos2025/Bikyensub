import { APIResponse } from "@/constants/types";
import { endPoints } from "@/constants/urls";

export const fetchAllDataPlans = async (
  networkId: string,
): Promise<APIResponse> => {
  try {
    const res = await fetch(
      `${endPoints.getDataPlans}?network=${networkId}-data`,
    );

    const data = await res.json();

    if (data.status !== "success") {
      return {
        error: true,
        success: false,
        statusCode: "400",
        message: "Something went wrong",

        data: null,
      };
    }

    return {
      error: false,
      success: true,
      statusCode: "200",
      message: "Successful",
      data: data.data.plans,
    };
  } catch (err: any) {
    return {
      error: true,
      success: false,
      statusCode: "500",
      message: err.message,
      data: null,
    };
  }
};

export const fetchPlansByType = async (
  planId: string,
): Promise<APIResponse> => {
  try {
    const res = await fetch(`${endPoints.getOtherData}&plan_id=${planId}`);

    const data = await res.json();

    if (data.status !== "success") {
      return {
        error: true,
        success: false,
        statusCode: "400",
        message: "Something went wrong",
        data: null,
      };
    }

    return {
      error: false,
      success: true,
      statusCode: "200",
      message: "Successful",
      data: data.data.plans,
    };
  } catch (error: any) {
    return {
      error: true,
      success: false,
      statusCode: "500",
      message: error.message,
      data: null,
    };
  }
};
