"use client"

import { Card } from "@/components/Card";

export const Main = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center md:items-stretch">
                <Card title={"Find your games!"} description={"Countless games are present, keep track of your completion!"} image={"/images/gaming1.jpg"} path={"games"} />
                <Card title={"What about films and series?"} description={"How many films/series did you see? Find them and add them to your profile!"} image={"/images/movie-theater.jpg"} path={"movies"} />
            </div>
        </div>

    );
}