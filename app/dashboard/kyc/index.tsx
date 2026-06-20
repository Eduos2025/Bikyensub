import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import Header from "../../components/header";
import IdentityVerification from "../../components/kyc-modal";
import useUserStore from "../../states/user";

const kyc = () => {
  const user = useUserStore((s) => s.user);
  return (
    <SafeAreaView style={{ marginHorizontal: 18, marginTop: 24 }}>
      <StatusBar barStyle={"light-content"} />
      <Header title="Identity Verification" />
      <IdentityVerification />
    </SafeAreaView>
  );
};

export default kyc;

const styles = StyleSheet.create({});
