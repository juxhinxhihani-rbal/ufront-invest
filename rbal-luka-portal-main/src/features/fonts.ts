import AmaliaBlack from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Black.woff2";
import AmaliaBlackItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-BlackItalic.woff2";
import AmaliaBold from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Bold.woff2";
import AmaliaBoldItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-BoldItalic.woff2";
import AmaliaItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Italic.woff2";
import AmaliaLight from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Light.woff2";
import AmaliaLightItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-LightItalic.woff2";
import AmaliaMedium from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Medium.woff2";
import AmaliaMediumItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-MediumItalic.woff2";
import AmaliaRegular from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Regular.woff2";
import AmaliaThin from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-Thin.woff2";
import AmaliaThinItalic from "@rbal-modern-luka/ui-library/assets/fonts/AmaliaW02-ThinItalic.woff2";

const allFonts: Record<string, string> = {
  "AmaliaW02-Black.woff2": AmaliaBlack,
  "AmaliaW02-BlackItalic.woff2": AmaliaBlackItalic,
  "AmaliaW02-Bold.woff2": AmaliaBold,
  "AmaliaW02-BoldItalic.woff2": AmaliaBoldItalic,
  "AmaliaW02-Italic.woff2": AmaliaItalic,
  "AmaliaW02-Light.woff2": AmaliaLight,
  "AmaliaW02-LightItalic.woff2": AmaliaLightItalic,
  "AmaliaW02-Medium.woff2": AmaliaMedium,
  "AmaliaW02-MediumItalic.woff2": AmaliaMediumItalic,
  "AmaliaW02-Regular.woff2": AmaliaRegular,
  "AmaliaW02-Thin.woff2": AmaliaThin,
  "AmaliaW02-ThinItalic.woff2": AmaliaThinItalic,
};

export function preloadFonts() {
  const metaTags = Object.values(allFonts).map((fontUrl) => {
    const metaTag = document.createElement("link");
    metaTag.setAttribute("rel", "preload");
    metaTag.setAttribute("href", fontUrl);
    metaTag.setAttribute("as", "font");
    metaTag.setAttribute("type", "font/woff2");
    metaTag.setAttribute("crossorigin", "true");
    return metaTag;
  });

  for (const metaTag of metaTags) {
    document.head.appendChild(metaTag);
  }
}

export const findFont = (font: string): string | undefined => allFonts[font];
