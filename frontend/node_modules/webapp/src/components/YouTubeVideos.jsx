import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await apiClient.get('/site/videos');
        setVideos(res.data?.videos || []);
      } catch (error) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
    const onUpdated = () => loadVideos();
    window.addEventListener('site-youtube-updated', onUpdated);
    return () => window.removeEventListener('site-youtube-updated', onUpdated);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">YouTube Videos</h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Watch our latest scholarship and study guidance videos.
        </p>

        {loading && <p className="mt-8 text-center text-slate-500">Loading videos...</p>}

        {!loading && videos.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950">
            No videos added yet.
          </div>
        )}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <article key={`${video.videoId}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div className="aspect-video">
                <iframe
                  src={video.embedUrl}
                  title={video.title || `YouTube Video ${index + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h2 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">{video.title || 'YouTube Video'}</h2>
                {video.description ? (
                  <p className="mt-1 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{video.description}</p>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default YouTubeVideos;
