import { v4 as uuidv4 } from "uuid";
import type { Sprite } from "../../../party/types";
import { useStore } from "../../store";
import useEmblaCarousel from "embla-carousel-react";
import { spriteOptions } from "./sprites";
import { useState } from "react";
import Mover from "./mover";
export default function Adder() {
  const [spriteId, setSpriteId] = useState<string | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const socket = useStore((state) => state.socket);
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });

  const addSprite = () => {
    if (!socket || !selectedSprite) return;
    const newSpriteId = uuidv4();
    const newSprite: Sprite = {
      id: newSpriteId,
      owner: socket.id,
      x: 0,
      y: 0,
      type: selectedSprite.id,
    };
    socket.send(
      JSON.stringify({
        type: "add",
        payload: newSprite,
      })
    );
    setSpriteId(newSpriteId);
  };
  return (
    <>
      {spriteId ? (
        <Mover
          spriteId={spriteId}
          done={() => {
            setSpriteId(null);
            setSelectedSprite(null);
          }}
        />
      ) : selectedSprite ? (
        <div className="selected">
          <h2>{selectedSprite.label}</h2>
          <img
            src={`/images/${selectedSprite.id}.png`}
            alt={selectedSprite.label}
          />
          <button onClick={addSprite}>Add to CanvasLive</button>
        </div>
      ) : (
        <p>Select an image from below to add it to CanvasLive!</p>
      )}
      <div className="adder">
        <div
          className={`embla ${spriteId ? "embla--selected" : ""}`}
          ref={emblaRef}
        >
          <div className="embla__container">
            {spriteOptions.map((sprite) => (
              <div
                className={`embla__slide ${
                  selectedSprite?.id === sprite.id ? "selected" : ""
                }`}
                key={sprite.id}
              >
                <img
                  src={`/images/${sprite.id}.png`}
                  alt={sprite.label}
                  onClick={() => setSelectedSprite(sprite)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
