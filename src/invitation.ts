// Wedding details shared by the invitation page and the /admin link generator.
export const INVITATION = {
  couple: {
    bride: "චාලකි",
    groom: "චෙශාන්",
    brideFull: "චාලකි",
    groomFull: "චෙශාන්",
  },
  parents: {
    brideFather: "නිමල් දයාරත්න මහතා",
    brideMother: "චන්දිමා උදයංගිකා මහත්මිය",
    groomFather: "දිවා ප්‍රිතීසිරි මලවිආරච්චී මහතා",
    groomMother: "කාන්ති සුධර්මා මහත්මිය",
  },
  date: {
    displayNumeric: "20 . 01 . 2027",
    displayLong: "වර්ෂ 2027 ක් වූ ජනවාරි මස 20 වන දින",
    countdownTarget: "2027-01-20T09:42:00+05:30",
    countdownCaption: "2027 ජනවාරි 20 බදාදා",
  },
  time: {
    ceremonyStart: "පෙ.ව. 9:42",
    registration: "පෙ.ව. 11:44",
  },
  timeline: [
    {
      time: "පෙ.ව. 9:42",
      title: "පෝරුවේ චාරිත්‍ර",
      description: "සුබ මොහොතින් පෝරුවට නැගීම",
      icon: "/icon_poruwa_clear.png",
    },
    {
      time: "පෙ.ව. 11:44",
      title: "විවාහ ලියාපදිංචිය",
      description: "සුබ මොහොතින් විවාහ ලියාපදිංචිය",
      icon: "/icon_start_clear.png",
    },
    {
      time: "ප.ව. 12:30",
      title: "දිවා භෝජනය",
      description: "ආදරයෙන් සැකසූ මංගල භෝජන සංග්‍රහය",
      icon: "/icon_lunch_clear.png",
    },
  ],
  contacts: [
    { name: "චෙශාන්", phone: "071 248 3393", tel: "+94712483393" },
    { name: "චාලකි", phone: "071 524 4018", tel: "+94715244018" },
  ],
  venue: {
    name: "Grand Avalon",
    city: "Pothuhera",
    nameSinhala: "ග්‍රෑන්ඩ් ඇවලෝන්",
    addressSinhala: "පොතුහැර.",
    image: "/Gemini_Generated_Image_e42y4be42y4be42y.jpg",
    mapQuery: "Grand Avalon, Pothuhera",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Grand+Avalon+Pothuhera",
  },

} as const;
