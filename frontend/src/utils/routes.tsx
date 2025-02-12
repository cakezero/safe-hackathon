import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tokens from "../pages/Tokens";
import NavBar from "../components/navbar/NavBar";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Tokens />} />
            </Routes>
        </BrowserRouter>
    )
}