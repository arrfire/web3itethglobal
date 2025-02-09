import { ReactNode } from "react";
import { Header } from "@/common/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Accelerate your Dreams',
  alternates: {
    canonical: '/review-plan',
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
    </div>
  )
}
