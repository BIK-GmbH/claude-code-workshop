import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { WorkshopLayout } from "@/components/WorkshopLayout";
import { Slide } from "@/routes/Slide";
import { Print } from "@/routes/Print";
import { ALL_SLIDES } from "@/lib/manifest";

const FIRST = ALL_SLIDES[0].id;

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/s/${FIRST}`} replace />} />
        <Route element={<WorkshopLayout />}>
          <Route path="/s/:slideId" element={<Slide />} />
        </Route>
        <Route path="/print" element={<Print />} />
        <Route path="*" element={<Navigate to={`/s/${FIRST}`} replace />} />
      </Routes>
    </HashRouter>
  );
}
