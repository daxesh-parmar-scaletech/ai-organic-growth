const DAYS = 28;

export const clicksSeriesMock: number[] = Array.from({ length: DAYS }, (_, i) =>
  Math.round(430 + i * 11 + Math.sin(i / 2.1) * 70 + (i > 19 ? (i - 19) * 22 : 0)),
);

export const impressionsSeriesMock: number[] = clicksSeriesMock.map((c, i) =>
  Math.round(c * 38 + Math.cos(i / 3) * 1400 + 8000),
);

export const trendLabelsMock: string[] = Array.from({ length: DAYS }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (DAYS - 1 - i));
  return date.toISOString().slice(0, 10);
});
