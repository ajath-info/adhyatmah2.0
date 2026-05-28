import * as React from 'react';
import Script from 'next/script';
import Providers from 'src/providers';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import 'simplebar-react/dist/simplebar.min.css';

// API services (direct fetch here or via service layer)
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 60; // ISR: Revalidate every 60 seconds
export async function generateMetadata() {
  const res = await fetch(`${baseUrl}/api/settings/main`, {
    next: { revalidate: 60 }
  });

  const { data } = await res.json();

  const seo = data.seo || {};

  return {
	metadataBase: new URL('https://adhyatmah.com'),
    title: seo.metaTitle || data.businessName,
    description: seo.metaDescription || seo.description || '',
    keywords: Array.isArray(seo.tags) ? seo.tags.join(', ') : '',
    icons: {
      icon: data.favicon?.url
    },
    verification: {
      google: 'NMBoUSDDc1vkJrdY6Uthn2qEYUypxtI7WZN25OsttD4'
    },
    openGraph: {
      title: seo.metaTitle || data.businessName || '',
      description: seo.metaDescription || seo.description || '',
      url: data.domainName || '',
      siteName: data.businessName || '',
      type: 'website',
      images: [data.logoLight?.url || data.logoDark?.url || data.favicon?.url]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle || data.businessName || '',
      description: seo.metaDescription || seo.description || '',
      images: [data.logoLight?.url || data.logoDark?.url || data.favicon?.url]
    }
  };
}

export default async function RootLayout({ children }) {
  const mainRes = await fetch(`${baseUrl}/api/settings/main`, { next: { revalidate: 60 } });
  const brandingRes = await fetch(`${baseUrl}/api/settings/branding`, { next: { revalidate: 60 } });
  const { data: main } = await mainRes.json();
  const { data: branding } = await brandingRes.json();
  return (
    <html lang={'en-US'}>
      <body data-new-gr-c-s-check-loaded="14.1251.0" data-gr-ext-installed="">
        
        {/* Google Site Verification - Added via metadata API */}
        
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HDC3JX5H1R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HDC3JX5H1R');
          `}
        </Script>
	
        <GoogleTagManager gtmId={main.gtmId} />
        <GoogleAnalytics gaId={main.gaId} />

        <Providers
          baseCurrency={main.baseCurrency}
          theme={branding.theme}
          cloudName={main.cloudName}
          preset={main.preset}
          shippingFee={main.shippingFee}
		>
          {children}
        </Providers>
		
		<a
		  href="https://wa.me/919452872182?text=I'm%20interested%20in%20your%20app%20services"
		  className="whatsapp-button"
		  title="WhatsApp"
		  target="_blank"
		  rel="noopener noreferrer"
		>
		  <img src="/images/whatsapp.png" alt="WhatsApp" />
		</a>
		
		{/* Tawk.to Chat Script */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
        >
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),
                  s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6989d8ecc95f891c34af9be7/1jh17enc9';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
		</Script>
		{/* Hidden Google Translate Loader */}
		<div id="google_translate_element" style={{ display: 'none' }}></div>

		<Script id="google-translate-init" strategy="afterInteractive">
		  {`
			function googleTranslateElementInit() {
			  new google.translate.TranslateElement(
				{
				  pageLanguage: 'en',
				  autoDisplay: false
				},
				'google_translate_element'
			  );
			}
		  `}
		</Script>

		<Script
		  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
		  strategy="afterInteractive"
		/>
		<Script id="hide-google-translate-ui" strategy="afterInteractive">
{`
  function hideGoogleTranslateUI() {

    if (document.getElementById('google-translate-hide-style')) return;

    const style = document.createElement('style');
    style.id = 'google-translate-hide-style';

    style.innerHTML = \`
      .skiptranslate,
      .goog-te-banner-frame,
      .goog-te-balloon-frame,
      .goog-te-gadget,
      .goog-te-gadget-icon {
        display: none !important;
      }

      iframe[src*="translate.google"],
      iframe[src*="translate.googleapis.com"] {
        display: none !important;
      }

      body {
        top: 0px !important;
      }
    \`;

    document.head.appendChild(style);
  }

  hideGoogleTranslateUI();
`}
</Script>
      </body>
    </html>
  );
}
