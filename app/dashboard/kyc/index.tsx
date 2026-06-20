import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import useUserStore from "../../states/user";
import IdentityVerification from "../../components/kyc-modal";

const kyc = () => {
  const user = useUserStore((s) => s.user);
  return (
    <View>
      <StatusBar barStyle={"light-content"} />
      <Header title="Identity Verification" />
      <IdentityVerification />
    </View>
  );
};

export default kyc;

const styles = StyleSheet.create({});
