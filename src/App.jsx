import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import CatalogAI from "./pages/CatalogAI";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalogAI" element={<CatalogAI/>} />

    </Routes>
  );
}
