"use client"

import Image from "next/image";

export type GameCardProps = {
    id: string;
    title: string;
    cover: string;
}


export const GameCard = (props: GameCardProps) => {
    return (
        <div key={props.id} className="bg-white flex flex-col h-full rounded-lg shadow-lg hover:bg-slate-100 hover:cursor-pointer">
            
            <div className="flex-grow flex flex-col items-center justify-center p-2">
            
                <img
                    src={props.cover.replace('t_thumb', 't_cover_big')}
                    alt={`${props.title} cover`}
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    style={{ maxHeight: '300px' }}
                />
                <p className="text-lg text-center">{props.title}</p>
            </div>
        </div>
    );
}