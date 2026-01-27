// import Link from 'next/link';
import { type ReactElement } from 'react';
import type { NextPageWithLayout } from 'types/index';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import { Hero } from '@/components/landingpage/Hero';
import Integration from '@/components/landingpage/integration';
import Phone from '@/components/ui/phone';
import Opportunity from '@/components/landingpage/opportunity';
import PromoCard from '@/components/landingpage/Promocard';
import Testimonials from '@/components/landingpage/testimonials';
import Cta from '@/components/landingpage/cta';
import FloatingNavbar from '@/components/ui/navbar';
import Footer from '@/components/landingpage/footer';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IntroDisclosureDemo } from '@/components/ui/IntroDisclosureDemo';
import MagicBento from '@/components/ui/MagicBento';
import CircularText from '@/components/ui/CircularTextLoader';
import Link from 'next/link';
import Keyboard from '@/components/ui/keyboard';
import { CardStack } from '@/components/ui/card-stack';
import ShaderHero from '@/components/ui/animated-shader-hero';
import ScrollExpansion from '@/components/ui/scroll-expension';
import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';

// const CARDS = [

//     {
//       id: 0,
//       name: "Satoshi Nakamoto",
//       designation: "Blockchain Pioneer",
//       content: (
//         <p>
//           The Proof of Transaction (POT) concept is a game-changer.
//           Transparent, secure, and lightning-fast transactions make this a must-have for the
//           crypto community.
//         </p>
//       ),
//     },
//     {
//       id: 1,
//       name: "Vitalik Buterin",
//       designation: "Ethereum Co-Founder",
//       content: (
//         <p>
//          POT is redefining crypto transparency. It's exactly what we need
//           for seamless and verifiable transactions across decentralized networks.
//         </p>
//       ),
//     },
//     {
//       id: 2,
//       name: "CZ Binance",
//       designation: "Crypto Exchange Mogul",
//       content: (
//         <p>
//           With POT integration, tracking transactions has never been easier.
//           This could be the future of verifiable and decentralized financial proof.
//         </p>
//       ),
//     },
//   ];

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);
  const { theme } = useTheme();

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const session = await getSession()
  //     if (session) {
  //       router.push('/maindashboard')
  //     }
  //   }
  //   checkSession()
  // }, [router])

  const handlePrimaryClick = () => {
    console.log('Get Started clicked!');
    // Add your logic here
  };

  const handleSecondaryClick = () => {
    console.log('Explore Features clicked!');
    // Add your logic here
  };
  return (
    <>
      <div className="dark">
        <FloatingNavbar />
        {/* <ScrollExpansion/> */}
        {/* <IntroDisclosureDemo/> */}
        {/* <Hero/> */}

        <div className="w-full">
          <ShaderHero
            trustBadge={{
              text: 'Trusted by forward-thinking teams.',
              icons: ['✨'],
            }}
            headline={{
              line1: 'Launch Your',
              line2: 'Workflow Into Orbit',
            }}
            subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
            buttons={{
              primary: {
                text: 'Get Started for Free',
                onClick: handlePrimaryClick,
              },
              secondary: {
                text: 'Explore Features',
                onClick: handleSecondaryClick,
              },
            }}
          />
        </div>

        <Integration />
        {/* <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        /> */}
        <Phone />
        <Opportunity />

        <div className="mx-16 my-20">
          <PromoCard />
        </div>
        <Testimonials />
        <Cta />

        {/* <Footer/> */}
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Redirect to login page if landing page is disabled
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;
