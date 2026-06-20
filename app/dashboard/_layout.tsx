import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import LockOverlay from "../components/LockOverlay";
import { usePushNotifications } from "../hooks/push-notification";
import useUserStore from "../states/user";
import { testPushNotification } from "../utils/test-push-notification";

export default function DashboardLayout() {
  const [isLocked, setIsLocked] = useState(false);
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  const token = useUserStore((s) => s.user?.token) || "";

  console.log(token);

  usePushNotifications(token);

  testPushNotification("ExponentPushToken[yZgXysM_EcUk44f8LJR6o6]");

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/active/) &&
          nextAppState.match(/inactive|background/)
        ) {
          // App went to background
          backgroundTime.current = Date.now();
        }

        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App came to foreground
          if (backgroundTime.current) {
            const timeElapsed = Date.now() - backgroundTime.current;
            if (timeElapsed > 5000) {
              // App locked - show overlay
              setIsLocked(true);
            }
          }
          backgroundTime.current = null;
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="set-pin" />
      </Stack>

      {isLocked && <LockOverlay onUnlock={() => setIsLocked(false)} />}
    </>
  );
}
