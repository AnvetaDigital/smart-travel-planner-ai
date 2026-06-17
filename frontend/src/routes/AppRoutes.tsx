import MainLayout from "@/components/layout/MainLayout";
import ChatPage from "@/pages/ChatPage";
import CreateTrip from "@/pages/CreateTrip";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignupPage from "@/pages/SignupPage";
import TripSummary from "@/pages/TripSummary";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
  <Routes>
    <Route element={<MainLayout/>}>
    <Route path="" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignupPage/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/trips/create" element={<CreateTrip/>}/>
    <Route path="/chat" element={<ChatPage/>}/>
    <Route path="/trip-summary" element={<TripSummary/>} />
    </Route>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>
  )
}
