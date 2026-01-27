import { Loading } from '@/components/shared';
import useTeams from 'hooks/useTeams';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { NextPageWithLayout } from 'types/next';

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { teams, isLoading } = useTeams();

  useEffect(() => {
    if (isLoading || !teams) {
      return;
    }

    if (teams.length > 0) {
      router.push(`/teams/${teams[0].slug}/settings`);
    } else {
      router.push('teams?newTeam=true');
    }
  }, [isLoading, router, teams]);

  return( <div>
    <video autoPlay loop muted className='h-screen w-screen max-h-screen max-w-screen object-cover ' src="https://res.cloudinary.com/kanishkkcloud18/video/upload/v1763123553/rocket_launch_keimtd.mp4"/>
  </div>)
  ;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
