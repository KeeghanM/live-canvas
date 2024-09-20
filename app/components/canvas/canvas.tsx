import type { Sprite } from "../../../party/types";
import UserMessages from "./user-messages";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

export default function Canvas() {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const socket = useStore((state) => state.socket);
  const addName = useStore((state) => state.addName);
  const addSprite = (sprite: Sprite) => {
    setSprites((sprites) => [...sprites, sprite]);
  };
  const removeSprite = (sprite: Sprite) => {
    setSprites((sprites) => sprites.filter((s) => s.id !== sprite.id));
  };
  const updateSprite = (sprite: Sprite) => {
    setSprites((sprites) =>
      sprites.map((s) => (s.id === sprite.id ? sprite : s))
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "move") {
        updateSprite(data.payload);
      } else if (data.type === "add") {
        addSprite(data.payload);
      } else if (data.type === "remove") {
        removeSprite(data.payload);
      } else if (data.type === "userJoined") {
        addName(data.payload);
      } else if (data.type === "sprites") {
        setSprites(data.payload);
      }
    };
  }, [socket, addName]);

  return (
    <>
      {sprites.map((sprite) => (
        <img
          key={sprite.id}
          src={`/images/${sprite.type}.png`}
          width={128}
          height={128}
          style={{
            position: "absolute",
            left: sprite.x,
            top: sprite.y,
          }}
        />
      ))}
      <UserMessages />
    </>
  );
}
