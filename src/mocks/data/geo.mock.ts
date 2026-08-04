import type { GeoDatum } from "@/types/geo";

export const geoMock: GeoDatum[] = [
  { country: "United States", lat: 39.5, lng: -98.4, clicks: 8210, impressions: "331K", ctr: "2.5%", position: "11.4", belowAverageCtr: false },
  { country: "United Kingdom", lat: 54.0, lng: -2.0, clicks: 2140, impressions: "88K", ctr: "2.4%", position: "12.9", belowAverageCtr: false },
  { country: "Canada", lat: 56.1, lng: -106.3, clicks: 1820, impressions: "71K", ctr: "2.6%", position: "10.8", belowAverageCtr: false },
  { country: "Germany", lat: 51.2, lng: 10.4, clicks: 1390, impressions: "96K", ctr: "1.4%", position: "16.7", belowAverageCtr: true },
  { country: "Australia", lat: -25.3, lng: 133.8, clicks: 1180, impressions: "52K", ctr: "2.3%", position: "13.1", belowAverageCtr: false },
  { country: "India", lat: 22.6, lng: 79.0, clicks: 1090, impressions: "140K", ctr: "0.8%", position: "21.5", belowAverageCtr: true },
  { country: "France", lat: 46.6, lng: 2.3, clicks: 880, impressions: "61K", ctr: "1.4%", position: "17.2", belowAverageCtr: true },
  { country: "Netherlands", lat: 52.3, lng: 5.3, clicks: 640, impressions: "26K", ctr: "2.5%", position: "11.9", belowAverageCtr: false },
];
