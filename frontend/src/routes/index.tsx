import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home";
import Tokens from "../pages/Tokens";
import NavBar from "../components/navbar/NavBar";
import { Toaster } from "react-hot-toast";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tokens" element={<Tokens />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    )
}