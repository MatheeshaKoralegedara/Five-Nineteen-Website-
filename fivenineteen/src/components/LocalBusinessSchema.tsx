import { getSettings } from "@/db/queries";
import { phoneDigits, site } from "@/lib/site";

export async function LocalBusinessSchema() {
  const s = await getSettings();
  const profiles = [s.instagram && `https://instagram.com/${s.instagram}`, s.facebook_url].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/opengraph-image.jpg`,
    email: s.contact_email || undefined,
    telephone: s.whatsapp ? `+${phoneDigits(s.whatsapp)}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    areaServed: "Sri Lanka",
    sameAs: profiles.length ? profiles : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}