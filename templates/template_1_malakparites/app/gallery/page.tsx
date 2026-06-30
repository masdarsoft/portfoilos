import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "معرض أعمالنا | صور تجهيزات فاخرة واقعية",
  description: "تصفح ألبوم أعمال ومشاريع تجهيز الحفلات لمؤسسة ملك الحفلات بالرياض. صور واقعية لتصميم وتركيب الخيام الملكية، بيوت الشعر، الجلسات الخارجية الفخمة، ومكيفات القاعات.",
  keywords: [
    "معرض صور ملك الحفلات",
    "صور خيام ملكية بالرياض",
    "صور جلسات خارجية الرياض",
    "مشاريع تجهيز حفلات الرياض"
  ],
  alternates: {
    canonical: "https://najdalzian.com/gallery",
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
