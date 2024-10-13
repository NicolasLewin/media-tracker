export type Game = {
  id: string,
  name: string,
  cover?: {
    url: string
  };
}

export type Movie = {
  imdbID: string,
  Title: string,
  Year: string,
  Poster: string
}