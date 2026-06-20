import { beneficiaryType, User } from "@/constants/types";
import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { getFingerFromStorage } from "../utils/get-fingerprint-from-storage";

type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  negative: boolean;
  fullReceipt?: any;
};

type UserStore = {
  user: User | null;
  transactions: Array<Transaction>;
  beneficiaries: Array<beneficiaryType>;
  loading: boolean;
  fingerPrintEnabled: boolean;
  updateBalance: (amount: number) => void;
  logout: () => void;
  setBeneficiaries: (beneficiaries: Array<beneficiaryType>) => Promise<void>;
  loadBeneficiaries: () => Promise<void>;
  updateBeneficiaries: (beneficiary: beneficiaryType) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  setFingerPrintStatus: () => Promise<void>;
};

const timeRequest = async (label: string, request: Promise<Response>) => {
  const start = Date.now();

  const response = await request;

  console.log(` ${label}: ${Date.now() - start}ms`);

  return response;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  transactions: [],
  beneficiaries: [
    // { network: { id: "1", label: "MTN", logo: mtnLogo }, phone: "08105311007" },
  ],
  loading: false,
  fingerPrintEnabled: false,
  setFingerPrintStatus: async () => {
    const isEnabled = await getFingerFromStorage();

    set({
      fingerPrintEnabled: isEnabled,
    });
  },

  setBeneficiaries: async (beneficiaries: Array<beneficiaryType>) => {
    await AsyncStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
  },
  loadBeneficiaries: async () => {
    const rawBeneficiaries = await AsyncStorage.getItem("beneficiaries");

    if (!rawBeneficiaries) return;

    let beneficiaries = JSON.parse(rawBeneficiaries);

    if (beneficiaries.length > 4) {
      beneficiaries = beneficiaries.slice(0, 3);
    }

    set({
      beneficiaries,
    });
  },
  updateBeneficiaries: async (beneficiary: beneficiaryType) => {
    set((state) => ({
      beneficiaries: [beneficiary, ...state.beneficiaries, beneficiary],
    }));
  },
  refreshDashboard: async () => {
    const start = Date.now();

    console.log(`Start call ${Date.now() - start}ms`);
    try {
      set({ loading: true });

      const userData = await AsyncStorage.getItem("user");

      if (!userData) return;

      const localUser = JSON.parse(userData);

      const {
        admin_role: adminRole,
        email,
        id,
        phone,
        oname,
        sname,
        token,
      } = localUser;

      const [profileRes, referralRes, trxRes] = await Promise.all([
        timeRequest(
          "Profile",
          fetch(endPoints.profile, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // "X-API-Token": token,
            },
            body: JSON.stringify({ token }),
          }),
        ),

        timeRequest(
          "Referral",
          fetch(endPoints.getReferralStats, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // "X-API-Token": token,
            },
            body: JSON.stringify({ token }),
          }),
        ),

        timeRequest(
          "Transactions",
          fetch(endPoints.getTransactions, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // "X-API-Token": token,
            },
            body: JSON.stringify({ token }),
          }),
        ),
      ]);

      console.log("Network:", Date.now() - start);

      const [profile, referral, trx] = await Promise.all([
        profileRes.json(),
        referralRes.json(),
        trxRes.json(),
      ]);

      console.log("JSON Parse:", Date.now() - start);

      console.log(` Dashboard loaded in ${Date.now() - start}ms`);

      const {
        acc_no: accNo,
        acc_name: accName,
        bank_name: bankName,
        wallet_balance: walletBalance,
      } = profile.data;

      const {
        referral_code: referralCode,
        referral_link: referralLink,
        referred_users: referredUsers,
        total_earnings: referralEarnings,
        total_referred: totalReferrals,
        share_message: shareMessage,
      } = referral.data;

      set({
        user: {
          id,
          email,
          name: `${oname + " " + sname}`,
          phone,
          token,
          haspin: localUser.haspin,

          accName,
          accNo,
          bankName,
          walletBalance,

          referralCode,
          referralLink,
          totalReferrals,
          referralEarnings,
          referredUsers,
          shareMessage,

          adminRole,
          state: "",
        },

        transactions: trx.data.transactions.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          subtitle: item.subtitle,
          amount: item.amount,
          negative: item.negative,
          fullReceipt: item.fullReceipt,
        })),

        loading: false,
      });

      console.log(`⚡ Dashboard finished loaded in ${Date.now() - start}ms`);
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },

  updateBalance: (amount: number) => {
    set((state) => ({
      user: {
        ...state.user!,
        walletBalance: Number(state.user!.walletBalance) - amount,
      },
    }));
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "user", "finger"]);
      router.replace("/Login");
      set({
        user: null,
        beneficiaries: [],
        transactions: [],
      });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserStore;
