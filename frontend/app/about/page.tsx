'use client'
import { useState } from 'react';
import { 
  Users, Code, Shield, RocketIcon,
} from 'lucide-react';
import { AnimatedText } from '@/common/components/atoms';
import Link from 'next/link';
import { routes } from '@/common/routes';
import dynamic from 'next/dynamic';

const MagicLottie = dynamic(() => import('@/app/home/magicLottie').then(m => m.MagicLottie), { 
  ssr: false, 
});

const GlobeLottie = dynamic(() => import('@/app/home/globeLottie').then(m => m.GlobeLottie), {
  ssr: false,
});

const AboutPage = () => {
  const [enableMagicAnim, setEnableMagicAnim] = useState(false)
  const [enableGlobeAnim, setEnableGlobeAnim] = useState(false)
    
  const features = [
    {
      icon: <RocketIcon className="w-8 h-8 text-violets-are-blue" />,
      title: "Dream Tokens",
      description: "Unique digital assets that represent innovative projects and ideas, allowing creators to tokenize their dreams and share them with the world.",
    },
    {
      icon: <Users className="w-8 h-8 text-violets-are-blue" />,
      title: "Community Support",
      description: "A global network of supporters who can directly back projects they believe in, creating a democratic funding ecosystem.",
    },
    {
      icon: <Code className="w-8 h-8 text-violets-are-blue" />,
      title: "Developer Integration",
      description: "Seamless connection between visionary projects and skilled developers, fostering collaboration and innovation.",
    },
    {
      icon: <Shield className="w-8 h-8 text-violets-are-blue" />,
      title: "Blockchain Security",
      description: "Built on the Arbitrum network, ensuring transparent, secure, and efficient project funding and development.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-32">
      <div className="container mx-auto px-4 mb-10">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mt-8 md:mt-0 mb-16">
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Transforming Dreams into Reality
            </h1>
            <p className="md:text-xl text-gray-300">
            Web3It.AI is a decentralized platform that empowers innovators, creators, 
            and dreamers to bring their visions to life through blockchain technology 
            and community support.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Our Vision</h2>
            <div className="bg-white/5 border-white/15 border rounded-3xl p-6 md:p-8">
              <p className="text-gray-300 mb-4">
                We believe that great ideas should have the opportunity to thrive, 
                regardless of traditional barriers. Through blockchain technology 
                and community-driven support, we're creating a new paradigm for 
                turning innovative ideas into reality.
              </p>
              <p className="text-gray-300">
                Our platform combines the power of decentralized finance with social 
                collaboration, enabling transparent funding, accountable development, 
                and meaningful connections between creators, supporters, and developers.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 border-white/15 border rounded-3xl p-6">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Platform Benefits</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border-white/15 border rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  <AnimatedText text="For Creators" />
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Launch and fund innovative projects through Dream Tokens</li>
                  <li>• Connect with skilled developers and supporters</li>
                  <li>• Maintain project ownership and creative control</li>
                  <li>• Leverage blockchain for transparent funding</li>
                </ul>
              </div>
            
              <div className="bg-white/5 border-white/15 border rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  <AnimatedText text="For Supporters" />
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Back innovative projects early</li>
                  <li>• Track project progress transparently</li>
                  <li>• Participate in project governance</li>
                  <li>• Build a portfolio of Dream Tokens</li>
                </ul>
              </div>

              <div className="bg-white/5 border-white/15 border rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  <AnimatedText text="For Developers" />
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Find exciting projects to contribute to</li>
                  <li>• Showcase skills and experience</li>
                  <li>• Collaborate with innovative creators</li>
                  <li>• Earn through smart contract milestones</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Built on Innovation</h2>
            <div className="bg-white/5 border-white/15 border rounded-3xl p-6">
              <p className="text-gray-300 mb-4">
                Web3It.AI leverages cutting-edge blockchain technology through the 
                Arbitrum network, ensuring fast, secure, and cost-effective transactions. 
                Our platform integrates elizaOS for social engagement, smart contracts 
                for transparent funding, and advanced security measures to protect our 
                community.
              </p>
            </div>
          </section>

          <section className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">
            Ready to Start Your Journey?
            </h2>
            <p className="md:text-xl text-gray-300 mb-8">
            Join our community of dreamers, supporters, and developers in building 
            the future of innovation.
            </p>
            <div className="flex gap-2 flex-col justify-center md:flex-row">
              <Link
                href={routes.createProjectPath}
                prefetch={true}
                onMouseEnter={() => setEnableMagicAnim(true)}
                onMouseLeave={() => setEnableMagicAnim(false)}
                className={`flex items-center justify-center text-white rounded-2xl md:w-auto w-full outline-none px-6 py-2 text-base
                disabled:cursor-not-allowed ease-in-out transition-all gap-2 duration-150 hover:from-han-purple/70
                hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium`}
              >
                Generate Dream
                <MagicLottie enableMagicAnim={enableMagicAnim} />
              </Link>
              <Link
                href={routes.viewProjectsPath}
                prefetch={true}
                onMouseEnter={() => setEnableGlobeAnim(true)}
                onMouseLeave={() => setEnableGlobeAnim(false)}
                className={`flex items-center justify-center text-white md:w-auto w-full rounded-2xl outline-none
                transition-all duration-150 ease-in-out px-6 py-2 font-medium text-base ring-1 ring-white
                gap-2 ring-inset hover:bg-white/15`}
              >
                Dreams Gallery
                <GlobeLottie enableGlobeAnim={enableGlobeAnim} />
              </Link>
             
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;