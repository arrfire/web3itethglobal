import { ReactNode } from "react";
import { Header } from "@/common/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Launch Your Dream',
  alternates: {
    canonical: '/new',
  },
}

export default function Layout ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
