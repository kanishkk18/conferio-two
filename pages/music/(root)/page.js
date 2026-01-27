'use client';

import AlbumCard from '../../../components/music-components/cards/album';
import ArtistCard from '../../../components/music-components/cards/artist';
import SongCard from '../../../components/music-components/cards/song';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getSongsByQuery, searchAlbumByQuery } from '../../../lib/fetch';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlbumCarousel } from '../../../components/music-components/ui/MusicCarousel';

export default function Page() {
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  const getSongs = async (query, setter) => {
    try {
      const res = await getSongsByQuery(query);
      const data = await res.json();
      setter(data?.data?.results || []);
    } catch (err) {
      setError('Failed to load songs');
    }
  };

  const getAlbums = async () => {
    try {
      const res = await searchAlbumByQuery('latest');
      const data = await res.json();
      setAlbums(data?.data?.results || []);
    } catch (err) {
      setError('Failed to load albums');
    }
  };

  useEffect(() => {
    getSongs('latest', setLatest);
    getSongs('bollywood', setPopular);
    getAlbums();
  }, []);

  /* ---------------- TRENDING (frontend-based) ---------------- */
  const trending = useMemo(() => {
    return [...popular]
      .sort(
        (a, b) =>
          (b.playCount || b.listeners || 0) -
          (a.playCount || a.listeners || 0)
      )
      .slice(0, 15);
  }, [popular]);

  /* ---------------- UNIQUE ARTISTS (optimized) ---------------- */
  const uniqueArtists = useMemo(() => {
    const map = new Map();
    latest.forEach((song) => {
      const artist = song?.artists?.primary?.[0];
      if (artist && !map.has(artist.id)) {
        map.set(artist.id, artist);
      }
    });
    return Array.from(map.values());
  }, [latest]);

  return (
    <main className="pl-4 dark !overflow-hidden w-full">
      <div className="bg-[#121212] w-full rounded-lg pt-10 px-6 md:h-[81.5svh] lg:h-[82svh] lg:max-h-[82svh] scrollbar-thin2 overflow-y-scroll">

        <AlbumCarousel />

        {/* FEATURED GRID */}
        {/* <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex rounded-sm overflow-hidden h-[3.2rem] bg-slate-500/20 justify-start gap-3 items-center"
            >
              <img
                className="h-full w-[56px] object-cover"
                src="https://i.pinimg.com/736x/2b/0d/6c/2b0d6c71a0a6e9ffe42f384fccc6ab67.jpg"
                alt="Album Art"
              />
              <h1 className="text-base font-semibold">Featured Album</h1>
            </div>
          ))}
        </div> */}

        <div className="space-y-10">

          {/* LATEST */}
          <div>
            <div className="px-2">
              <h1 className="font-bold text-2xl font-jakarta">
                Today's biggest hits
              </h1>
            </div>

            <ScrollArea className="rounded-md mt-1">
              <div className="flex">
                {latest.length
                  ? latest
                      .slice()
                      .reverse()
                      .map((song) => (
                        <SongCard
                          key={song.id}
                          image={song.image[2].url}
                          album={song.album}
                          title={song.name}
                          artist={song.artists.primary[0].name}
                          id={song.id}
                        />
                      ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <SongCard key={i} />
                    ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>

          {/* ALBUMS */}
          <div>
            <div className="px-2">
              <h1 className="font-bold text-2xl font-jakarta">
                Albums featuring songs you like
              </h1>
            </div>

            <ScrollArea className="rounded-md mt-1">
              <div className="flex">
                {albums.length
                  ? albums
                      .slice()
                      .reverse()
                      .map((song) => (
                        <SongCard
                          key={song.id}
                          lang={song.language}
                          image={song.image[2].url}
                          album={song.album}
                          title={song.name}
                          artist={song.artists.primary[0].name}
                          id={`album/${song.id}`}
                        />
                      ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <SongCard key={i} />
                    ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>

          {/* ARTISTS */}
          <div>
            <div className="px-2">
              <h1 className="font-bold text-2xl font-jakarta">
                Most searched artists
              </h1>
            </div>

            <ScrollArea className="rounded-md mt-1">
              <div className="flex">
                {uniqueArtists.length
                  ? uniqueArtists.map((artist) => (
                      <ArtistCard
                        key={artist.id}
                        id={artist.id}
                        image={
                          artist.image?.[2]?.url ||
                          `https://az-avatar.vercel.app/api/avatar/?bgColor=0f0f0f&fontSize=60&text=${artist.name[0]}`
                        }
                        name={artist.name}
                      />
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="grid gap-2">
                        <Skeleton className="h-[100px] w-[100px] rounded-2xl" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>

          {/* TRENDING */}
          <div className="pb-2">
            <div className="px-2">
              <h1 className="font-bold text-2xl font-jakarta">
                Trending now
              </h1>
            </div>

            <ScrollArea className="rounded-md mt-1">
              <div className="flex">
                {trending.length
                  ? trending.map((song) => (
                      <SongCard
                        key={song.id}
                        id={song.id}
                        image={song.image[2].url}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                      />
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <SongCard key={i} />
                    ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  );
}
