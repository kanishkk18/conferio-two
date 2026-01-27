import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';
import type { AppPropsWithLayout } from 'types/index';
import mixpanel from 'mixpanel-browser';
import '../pages/globals.css';
import { useEffect } from 'react';
import env from '@/lib/env';
import { AccountLayout } from '@/components/layouts';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import QueryProvider from 'contexts/query-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import BoardListContextProvider from 'store/BoardListContext';
import MusicProvider from '@/components/music-components/music-provider';
import { NextContext } from 'hooks/use-context';
import { SocketProvider } from '@/components/chat-components/providers/socket-provider';
import { useRouter } from "next/navigation";
import { useIsMobile } from "hooks/useIsMobile";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { session, ...props } = pageProps;
  const router = useRouter();
  const isMobile = useIsMobile();

  // Add mixpanel
  useEffect(() => {
    if (env.mixpanel.token) {
      mixpanel.init(env.mixpanel.token, {
        debug: true,
        ignore_dnt: true,
        track_pageview: true,
      });
    }
  }, []);

  useEffect(() => {
    if (isMobile && window.location.pathname !== "/mobile-development") {
      router.replace("/mobile-development");
    }
  }, [isMobile, router]);

  const getLayout =
    Component.getLayout || ((page) => <AccountLayout>{page}</AccountLayout>);

  return (
    <>
      <SessionProvider session={session}>
        <QueryProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <NextContext.Provider
                value={{ nextData: { id: 'O94kBTtw', name: 'Chuttamalle' } }}
              >
                <MusicProvider>
                  <BoardListContextProvider>
                    <SocketProvider>
                      <Toaster toastOptions={{ duration: 3000 }} />
                      {getLayout(<Component {...props} />)}
                    </SocketProvider>
                  </BoardListContextProvider>
                </MusicProvider>
              </NextContext.Provider>
            </ThemeProvider>
          </NuqsAdapter>
        </QueryProvider>
      </SessionProvider>
    </>
  );
}

export default appWithTranslation<never>(MyApp);
