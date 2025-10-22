import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
