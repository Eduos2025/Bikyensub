export async function testPushNotification(token: string) {
  try {
    const message = {
      to: token,
      sound: "default",
      title: "Test Notification",
      body: "Push notifications are working!",
      priority: "high",
      data: {
        screen: "notification",
      },
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    console.log("Expo Push Response:", result);

    return result;
  } catch (error) {
    console.log("Push notification error:", error);
    throw error;
  }
}
