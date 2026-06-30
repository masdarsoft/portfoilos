import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا | حجز وتجهيز فوري 24 ساعة",
  description: "تواصل مباشرة مع خدمة عملاء مؤسسة ملك الحفلات بالرياض للاستفسار عن حجز وتأجير خيام المناسبات، بيوت الشعر، مكيفات التبريد، وجلسات الضيافة. متواجدون لخدمتكم 24 ساعة.",
  keywords: [
    "اتصل بنا ملك الحفلات",
    "رقم ملك الحفلات للمناسبات",
    "تجهيز حفلات الرياض واتساب",
    "موقع مؤسسة ملك الحفلات"
  ],
  alternates: {
    canonical: "https://najdalzian.com/contact",
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
