import { etisalatLogo, gloLogo, mtnLogo } from "./images";
import { NetworkType } from "./types";

export const networks: Array<NetworkType> = [
  { id: "mtn", label: "MTN", logo: mtnLogo },
  {
    id: "airtel",
    label: "Airtel",
    logo: require("@/assets/images/airtel.png"),
  },
  { id: "glo", label: "Glo", logo: gloLogo },
  {
    id: "etisalat",
    label: "9mobile",
    logo: etisalatLogo,
  },
];
