import { Loader } from "@/common/components/atoms";
import { 
  Footer, 
  Header,
} from "@/common/components/organisms";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const UserIdeas = dynamic(() => import('./userIdeas').then(m => m.UserIdeas), { 
  ssr: false, 
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: 'View Your Dreams',
  alternates: {
    canonical: '/profile',
  },
}

export default function ProfilePage () {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <UserIdeas />
      </div>
      <Footer />
    </>
  )
}
