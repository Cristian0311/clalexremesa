export interface FAQ {
  id: string;
  q: string;
  a: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
}

export interface AppConfig {
  companyName: string;
  description: string;
  whatsapp: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
  };
  promoBannerActive?: boolean;
  promoBannerText?: string;
  rates: {
    transferCUP: number;
    cashCUP: number;
    cashUSD: number;
  };
  deliveryMethods: {
    transferCUP: boolean;
    cashCUP: boolean;
    cashUSD: boolean;
  };
  faqs: FAQ[];
  heroText: {
    title: string;
    subtitle: string;
  };
  benefits: Benefit[];
  schedules: string;
  promotions: string;
}
