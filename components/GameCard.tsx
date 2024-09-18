"use client"

import { Game } from "@/types";
import { useRouter } from "next/navigation";

export type GameCardProps = {
    game: Game;
}

export const GameCard = (props: GameCardProps) => {

    const router = useRouter();

    const handleClick = () => {
      router.push(`/games/${props.game.id}`);
    };


    return (
        <div key={props.game.id} className="bg-white flex flex-col h-full rounded-lg shadow-lg hover:bg-slate-100 hover:cursor-pointer" onClick={handleClick}>
            <div className="flex-grow flex flex-col items-center justify-center p-2">
            {props.game.cover && props.game.cover.url ? (
                <img
                    src={props.game.cover.url.replace('t_thumb', 't_cover_big')}
                    alt={`${props.game.name} cover`}
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    style={{ maxHeight: '300px' }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
                <p className="text-lg text-center">{props.game.name}</p>
            </div>
        </div>
    );
}