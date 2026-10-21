/** Fixed places on the site where the admin can pin a specific photo (Settings → Site photos). */
export const PHOTO_SLOTS = [
  { key: "home_intro", label: "Home · intro image", hint: "Tall image beside the welcome text" },
  { key: "home_cta", label: "Home · booking banner", hint: "Wide background behind “Let's create something timeless”" },
  { key: "about_portrait", label: "About · portrait", hint: "Tall image at the top of the About page" },
  { key: "about_accent", label: "About · second image", hint: "Image further down the About page" },
  { key: "about_cta", label: "About · booking banner", hint: "Wide background at the bottom of the About page" },
  { key: "portfolio_cta", label: "Portfolio · booking banner", hint: "Wide background at the bottom of the Portfolio page" },
  { key: "contact", label: "Contact · image", hint: "Tall image on the Contact page" },
] as const;

export type PhotoSlot = (typeof PHOTO_SLOTS)[number]["key"];

/** Settings-table key that stores the chosen photo id for a slot. */
export const slotSettingKey = (slot: PhotoSlot) => `photo_${slot}`;
