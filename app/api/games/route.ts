import { NextRequest, NextResponse } from "next/server";

export async function GET(request: any) {

    const url = "https://api.igdb.com/v4/games"

    const res = await fetch(url, { method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': '',
          'Authorization': 'Bearer ',
        },
    body: "fields name; where id = 1942;"
    });
    const data = await res.json();
    return NextResponse.json({ data });

}