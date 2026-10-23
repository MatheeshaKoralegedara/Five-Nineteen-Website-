export const site = {
    name: "Five Nineteen",
    url: "https://fivenineteen.com.lk",
    tagline: "Moments, honestly kept.",
    description: "Photography by Matheesha Koralegedara — Graduations, Portraits, Birthday and stories from Sri Lanka.",
    photographer: "Matheesha Koralegedara",
    location: "Colombo & Kandy, Sri Lanka",
    city: "Colombo, Kandy",
    country: "LK",
    facebookName: "Five Nineteen by Matheesha Koralegedara",
    intro:
        "I photograph people as they are the quiet glances, the loud laughter, the light that only lasts a minute. Images that feel like you, years from now.",
    process: [
        { title: "Say hello", text: "Share your date, location and what you have in mind. I reply within a day." },
        { title: "Plan together", text: "We talk through the story, timeline and places that matter to you." },
        { title: "The session", text: "Relaxed, unhurried and guided just enough so you can be yourselves." },
        { title: "Your gallery", text: "A carefully edited, private gallery delivered ready to share and print." },
    ],
};

/** Digits only, as wa.me expects (e.g. "+94 71 350 9096" -> "94713509096"). */
export const phoneDigits = (n: string) => n.replace(/\D/g, "");

/** Readable form for display: Sri Lankan numbers as +94 71 350 9096. */
export function formatPhone(n: string) {
    const d = phoneDigits(n);
    if (d.length === 11 && d.startsWith("94")) return `+94 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    return `+${d}`;
}
