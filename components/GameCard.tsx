"use client"

import Image from "next/image";

export type GameCardProps = {
    id: string;
    title: string;
    cover: string;
}


export const GameCard = (props: GameCardProps) => {
    return (
        <div key={props.id}>
            <p className="text-lg">{props.title}</p>
            <div className="flex-grow flex flex-col">
                <div className="mb-4 flex justify-center">
                <img
                    src={props.cover.replace('t_thumb', 't_cover_big')}
                    alt={`${props.title} cover`}
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    style={{ maxHeight: '300px' }}
                />
            </div>
            </div>
        </div>
    );
}