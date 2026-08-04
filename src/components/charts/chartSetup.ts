import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

// Registered once, only the pieces the app's charts actually use — avoids
// pulling in the full `chart.js/auto` bundle (bars, radar, etc. we don't render).
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ArcElement, Title, Tooltip);
