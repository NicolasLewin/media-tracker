"use client"

import { Card } from "@/components/Card";

export const Main = () => {
    return (
        <div>
            <h1 className="text-2xl">Welcome to media tracker !</h1>
            <div className="flex gap-4 justify-center">
                <Card title={"Find your games!"} description={"Countless games are present, keep track of your completion!"} image={""} path={""} />
                <Card title={"What about films and series?"} description={"How many films/series did you see? Find them and add them to your profile!"} image={""} path={""} />
                <Card title={"Compare with your friends!"} description={"Compare and see what your friends have seen and/or played!"} image={""} path={""} />
            </div>
        </div>

    );
}