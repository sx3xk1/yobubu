import { champagneList, mixers, girlsDrink } from "./menu";

export type Club = {
  id: string;
  name: string;
  url: string;
  area: string;
  pricing: {
    set: number;          // セット料金（60分）
    extension: number;    // 延長（30分 or 60分）
    vipSet?: number;      // VIPセット（任意）
    vipExtension?: number;// VIP延長（任意）
    nomination: number;   // 指名料
    companion: number;    // 同伴料
    serviceCharge: number;// サービス料（小数で%）
    tax: number;          // 消費税（小数で%）
  };
  menus: {
    champagne: typeof champagneList;
    mixers: typeof mixers;
    girlsDrink: typeof girlsDrink;
  };
};

export const clubs: Club[] = [
  {
    id: "unjour",
    name: "クラブ アンジュール",
    url: "https://club-unjour.com",
    area: "北新地",
    pricing: {
      set: 10000,
      extension: 5000,
      vipSet: 11000,
      vipExtension: 11000,
      nomination: 3000,
      companion: 3000,
      serviceCharge: 0.25,
      tax: 0.1,
    },
    menus: {
      champagne: champagneList,
      mixers: mixers,
      girlsDrink: girlsDrink,
    },
  },
];
