import { useCallback, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const defaultSocialLinks = {
  whatsapp: '',
  instagram: '',
  youtube: '',
  facebook: '',
  telegram: '',
  linkedin: '',
  x: '',
};

const useSiteConfig = () => {
  const [logoUrl, setLogoUrl] = useState('/logo_.jpg');
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);

  const loadSiteConfig = useCallback(async () => {
    try {
      const res = await apiClient.get('/site/config', { timeout: 12000 });
      if (typeof res.data?.logoUrl === 'string' && res.data.logoUrl.trim()) {
        setLogoUrl(res.data.logoUrl);
      }
      if (res.data?.socialLinks) {
        setSocialLinks({ ...defaultSocialLinks, ...res.data.socialLinks });
      }
    } catch (error) {
      setLogoUrl('/logo_.jpg');
      setSocialLinks(defaultSocialLinks);
    }
  }, []);

  useEffect(() => {
    loadSiteConfig();
    const onUpdated = () => loadSiteConfig();
    window.addEventListener('site-logo-updated', onUpdated);
    window.addEventListener('site-social-updated', onUpdated);
    return () => {
      window.removeEventListener('site-logo-updated', onUpdated);
      window.removeEventListener('site-social-updated', onUpdated);
    };
  }, [loadSiteConfig]);

  return { logoUrl, socialLinks, reload: loadSiteConfig };
};

export default useSiteConfig;
