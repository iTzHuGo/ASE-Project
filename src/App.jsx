import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import CatalogAI from "./pages/CatalogAI";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileButton from "./components/ProfileButton";

export default function App() {
  return (
    <>
      <ProfileButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalogAI" element={<CatalogAI/>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
