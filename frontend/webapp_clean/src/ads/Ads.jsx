import React, { useEffect, useRef } from "react";

const Ads = () => {
  const adRef1 = useRef(null);
  const adRef2 = useRef(null);
  const adRef3 = useRef(null);

  useEffect(() => {
    const loadAds = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    };
    loadAds();
  }, []);

  return (
    <aside className="bg-gray-200 rounded shadow p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 text-center">Sponsored Ads</h2>
      <div className="space-y-4">
        {/* First Ad */}
        <div className="bg-white rounded shadow p-4 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-7807051843526803"
            data-ad-slot="3341115609"
            data-ad-format="auto"
            data-full-width-responsive="true"
            ref={adRef1}
          />
        </div>

        {/* Second Ad */}
        <div className="bg-white rounded shadow p-4 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-7807051843526803"
            data-ad-slot="3341115609"
            data-ad-format="auto"
            data-full-width-responsive="true"
            ref={adRef2}
          />
        </div>

        {/* Third Ad (in-article style) */}
        <div className="bg-white rounded shadow p-4 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-7807051843526803"
            data-ad-slot="3966095274"
            ref={adRef3}
          />
        </div>
      </div>
    </aside>
  );
};

export default Ads;
