import Player from '../../components/music-components/cards/player';
import MusicProvider from '../../components/music-components/music-provider';
// import Footer from "./components/page/footer";
// import Header from "./components/page/header";
// import Search from "./components/page/search";
import MusicPage from './(root)/page';
import {
  // SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from '../../components/music-components/ui/sidebar';
import { AppSidebar } from '../../components/music-components/app-sidebar';
import Header from '../../components/music-components/page/header';
import ThinSidebar from '@/components/ui/thinSidebar';


export default function Index() {
  return (
  
    <div className="bg-black dark !overflow-hidden overflow-y-hidden h-screen">
     <Header /> 
     <SidebarProvider className="overflow-hidden">
        <AppSidebar />
        <MusicProvider>
          <MusicPage />
          <Player />
        </MusicProvider>
      </SidebarProvider>
    </div>
  );
}
