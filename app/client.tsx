import "./styles.css";
import { createRoot } from "react-dom/client";
import LoginForm from "./components/ui/login-form";
import Canvas from "./components/canvas/canvas";
import { useStore } from "./store";
import usePartySocket from "partysocket/react";
import { useEffect } from "react";
import UserView from "./components/user/user-view";
import { spriteOptions } from "./components/user/sprites";

function App() {
  const name = useStore((state) => state.name);
  const setSocket = useStore((state) => state.setSocket);

  const socket = usePartySocket({
    room: "canvas-live",
  });

  useEffect(() => {
    if (socket) {
      setSocket(socket);
    }
  }, [socket, setSocket]);

  useEffect(() => {
    // Preload sprite images
    spriteOptions.map((s) => (new Image().src = `/images/${s.id}.png`));
  }, []);

  if (!name) return <LoginForm />;

  if (name === "admin") return <Canvas />;

  return <UserView />;
}

createRoot(document.getElementById("app")!).render(<App />);
