import { ReactNode } from "react";
import { 
  Footer, Header,
} from "@/common/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us',
  alternates: {
    canonical: '/about',
  },
}

export default async function Layout ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
