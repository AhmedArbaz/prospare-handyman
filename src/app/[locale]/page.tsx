import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import RecentWork from "@/components/RecentWork";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import ContactBand from "@/components/ContactBand";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <RecentWork />
      <Services />
      <HowItWorks />
      <ContactBand />
    </>
  );
}
