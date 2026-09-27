export const themeColors = [
  { contrastWithInk: 13.38, tone: "butter" },
  { contrastWithInk: 15.16, tone: "lemon" },
  { contrastWithInk: 11.55, tone: "honey" },
  { contrastWithInk: 12.03, tone: "sand" },
  { contrastWithInk: 12.38, tone: "apricot" },
  { contrastWithInk: 11.56, tone: "rose" },
  { contrastWithInk: 9.69, tone: "brick" },
  { contrastWithInk: 11.3, tone: "sky" },
  { contrastWithInk: 13.48, tone: "glacier" },
  { contrastWithInk: 10.75, tone: "lagoon" },
  { contrastWithInk: 10.04, tone: "periwinkle" },
  { contrastWithInk: 10.83, tone: "lavender" },
  { contrastWithInk: 11.03, tone: "mauve" },
  { contrastWithInk: 10.59, tone: "lavender-gray" },
  { contrastWithInk: 12.23, tone: "sage" },
  { contrastWithInk: 13.33, tone: "mint" },
] as const;

export type ThemeTone = (typeof themeColors)[number]["tone"];
