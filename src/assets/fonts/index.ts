/**
 * Font configuration
 */

import localFont from "next/font/local";
import {} from // Source_Serif_4 as SourceSerif,
// Inter,
// Lora,
"next/font/google";

const manrope = localFont({
  src: [
    {
      path: "./manrope-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./manrope-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./manrope-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./manrope-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./manrope-extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./manrope-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./manrope-extralight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

// export const sourceserif = SourceSerif({
//   subsets: ["latin"],
//   variable: "--font-sourceserif",
//   display: "swap",
//   weight: ["400", "500", "600", "700"],
// });

// export const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
//   weight: ["400", "500", "600", "700"],
// });

// export const loraSerif = Lora({
//   subsets: ["latin"],
//   variable: "--font-lora",
//   display: "swap",
//   weight: ["400", "500", "600", "700"],
// });

// export const fontVariables = `${serif.variable} ${inter.variable} ${loraSerif.variable} ${merriweather.variable} ${manrope.variable}`;

export const fontVariables = `${manrope.variable}`;
