import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, LOGO_URL } from '@/lib/site';
import '@/index.css';
import '@/App.css';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: '%s | Rally Trip' },
  description: SITE_DESCRIPTION,
  applicationName: 'Rally Trip',
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/logo192.png' },
  openGraph: {
    type: 'website',
    siteName: 'Rally Trip',
    locale: 'he_IL',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: LOGO_URL, width: 512, height: 512 }],
  },
};

export const viewport = {
  themeColor: '#000000',
};

// Old links looked like rallytrip.com/#/products/... (HashRouter). Send them to the real URL
// before React loads so visitors and crawlers that execute JS land on the right page.
// Only same-origin targets: '#//evil.com' or '#/\evil.com' would otherwise be an open redirect.
const legacyHashRedirect = `(function(){var h=location.hash;if(h&&h.indexOf('#/')===0){var u=new URL(h.slice(1).replace(/\\/+$/,'')+'/',location.href);if(u.origin===location.origin)location.replace(u.href);}})();`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rally Trip',
  alternateName: 'ראלי טריפ',
  url: SITE_URL,
  logo: LOGO_URL,
  telephone: '+972505562519',
  email: '119raz@walla.com',
  sameAs: ['https://www.facebook.com/RallyTrip'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: legacyHashRedirect }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <main className="main">
          <NavBar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
