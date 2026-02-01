import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { DatasetsPage } from "./pages/DatasetsPage";
import { MetricsPage } from "./pages/MetricsPage";
import Empty from "./components/Empty";

function App() {
  // Use the repository name as the base path when deployed to GitHub Pages
  const basename = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="dashboard" element={<Empty title="Dashboard" description="Visualize your evaluation results and agent performance." />} />
          <Route path="agents" element={<Empty title="Agents" description="Manage and configure your AI agents for evaluation." />} />
          <Route path="settings" element={<Empty title="Settings" description="Configure global preferences and API keys." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
