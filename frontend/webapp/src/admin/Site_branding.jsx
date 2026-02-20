import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const emptyLinks = {
  whatsapp: '',
  instagram: '',
  youtube: '',
  facebook: '',
  telegram: '',
  linkedin: '',
  x: '',
};

const emptyVideo = { title: '', url: '', description: '' };

const Site_branding = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/logo_.jpg');
  const [logoPublicUrl, setLogoPublicUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState(emptyLinks);
  const [youtubeVideos, setYoutubeVideos] = useState([emptyVideo]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const safePreviewUrl = (typeof previewUrl === 'string' && previewUrl.trim()) ? previewUrl : '/logo_.jpg';

  const loadConfig = async () => {
    try {
      const [configRes, videoRes] = await Promise.all([
        apiClient.get('/site/config'),
        apiClient.get('/site/videos'),
      ]);

      if (configRes.data?.logoUrl) {
        setPreviewUrl(configRes.data.logoUrl);
        setLogoPublicUrl(configRes.data.logoUrl);
      }
      if (configRes.data?.socialLinks) {
        setSocialLinks({ ...emptyLinks, ...configRes.data.socialLinks });
      }

      const videos = (videoRes.data?.videos || []).map((video) => ({
        title: video.title || '',
        url: video.url || '',
        description: video.description || '',
      }));
      if (videos.length) {
        setYoutubeVideos(videos);
      }
    } catch (error) {
      // keep fallback
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const onLogoSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      setMessage('Please select a logo file.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('logoFile', logoFile);
      await apiClient.post('/admin/site/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadConfig();
      setLogoFile(null);
      setMessage('Logo updated successfully.');
      window.dispatchEvent(new CustomEvent('site-logo-updated'));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update logo.');
    } finally {
      setLoading(false);
    }
  };

  const onSocialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiClient.post('/admin/site/social', socialLinks);
      setMessage('Social links updated successfully.');
      window.dispatchEvent(new CustomEvent('site-social-updated'));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update social links.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, field, value) => {
    setYoutubeVideos((prev) =>
      prev.map((video, i) => (i === index ? { ...video, [field]: value } : video))
    );
  };

  const addVideoInput = () => {
    setYoutubeVideos((prev) => [...prev, { ...emptyVideo }]);
  };

  const removeVideoInput = (index) => {
    setYoutubeVideos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ ...emptyVideo }];
    });
  };

  const onVideoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const videos = youtubeVideos
        .map((video) => ({
          title: String(video.title || '').trim(),
          url: String(video.url || '').trim(),
          description: String(video.description || '').trim(),
        }))
        .filter((video) => video.url);

      await apiClient.post('/admin/site/videos', { videos });
      setMessage('YouTube videos updated successfully.');
      window.dispatchEvent(new CustomEvent('site-youtube-updated'));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update YouTube videos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button className="rounded bg-slate-700 px-4 py-2 text-white" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Site Logo</h2>
          <p className="mt-1 text-sm text-slate-500">Upload logo once, frontend updates automatically.</p>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={safePreviewUrl}
              alt="Site logo preview"
              className="h-24 w-24 rounded-full border object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo_.jpg'; }}
            />
            <div className="text-xs text-slate-500 break-all">Public URL: {logoPublicUrl || 'Not available'}</div>
          </div>

          <form className="mt-4 space-y-3" onSubmit={onLogoSubmit}>
            <input
              type="file"
              accept="image/*,.bmp"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full rounded border px-3 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Uploading...' : 'Update Logo'}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">Social Links</h3>
          <p className="mt-1 text-sm text-slate-500">Paste full channel/page links. Icons update on Contact and Footer automatically.</p>

          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onSocialSubmit}>
            <input name="whatsapp" value={socialLinks.whatsapp} onChange={handleSocialChange} placeholder="WhatsApp URL" className="rounded border px-3 py-2" />
            <input name="instagram" value={socialLinks.instagram} onChange={handleSocialChange} placeholder="Instagram URL" className="rounded border px-3 py-2" />
            <input name="youtube" value={socialLinks.youtube} onChange={handleSocialChange} placeholder="YouTube URL" className="rounded border px-3 py-2" />
            <input name="facebook" value={socialLinks.facebook} onChange={handleSocialChange} placeholder="Facebook URL" className="rounded border px-3 py-2" />
            <input name="telegram" value={socialLinks.telegram} onChange={handleSocialChange} placeholder="Telegram URL" className="rounded border px-3 py-2" />
            <input name="linkedin" value={socialLinks.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL" className="rounded border px-3 py-2" />
            <input name="x" value={socialLinks.x} onChange={handleSocialChange} placeholder="X URL" className="rounded border px-3 py-2 sm:col-span-2" />
            <button type="submit" disabled={loading} className="sm:col-span-2 rounded bg-slate-900 py-2 text-white hover:bg-black disabled:opacity-70">
              {loading ? 'Saving...' : 'Save Social Links'}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">YouTube Videos</h3>
          <p className="mt-1 text-sm text-slate-500">Add YouTube links to show videos on the website YouTube page.</p>
          <form className="mt-4 space-y-3" onSubmit={onVideoSubmit}>
            {youtubeVideos.map((video, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
                <input
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                  placeholder="Video title"
                  className="rounded border px-3 py-2"
                />
                <input
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="rounded border px-3 py-2"
                />
                <textarea
                  value={video.description}
                  onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                  placeholder="Short description (optional)"
                  className="rounded border px-3 py-2 sm:col-span-2"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeVideoInput(index)}
                  className="rounded bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700 sm:col-span-2"
                >
                  Remove Video
                </button>
              </div>
            ))}

            <button type="button" onClick={addVideoInput} className="w-full rounded border border-slate-300 py-2 text-slate-700 hover:bg-slate-50">
              Add Another Video
            </button>
            <button type="submit" disabled={loading} className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700 disabled:opacity-70">
              {loading ? 'Saving...' : 'Save YouTube Videos'}
            </button>
          </form>
        </div>

        {message && <p className="text-sm text-slate-700">{message}</p>}
      </div>
    </div>
  );
};

export default Site_branding;
