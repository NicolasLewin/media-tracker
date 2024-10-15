"use client"

import { Movie } from '@/types';
import { useRouter } from 'next/navigation';

interface MovieCardProps {
  movie: Movie;
  mymovies?: boolean;
}

export const MovieCard = (props: MovieCardProps) => {

  const router = useRouter();

  const handleClick = () => {
      
      {props.mymovies ? (
          router.push(`/my-movies/${props.movie.imdbID}`)
      ) : (
          router.push(`/movies/${props.movie.imdbID}`)
      )}
     
  };

  return (
    <div key={props.movie.imdbID} className="bg-white flex flex-col h-full rounded-lg shadow-lg hover:bg-slate-100 hover:cursor-pointer" onClick={handleClick}>
      <div className="flex-grow flex flex-col items-center justify-center p-2">
      {props.movie.Poster && props.movie.Poster !== "N/A" ? (
          <img
              src={props.movie.Poster.replace('t_thumb', 't_cover_big')}
              alt={`${props.movie.Title} cover`}
              className="rounded-lg shadow-lg max-w-full h-auto"
              style={{ maxHeight: '300px' }}
          />
      ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
          <p className="text-lg text-center">{props.movie.Title}</p>
          <p className="text-sm text-center">{props.movie.Year}</p>
      </div>
    </div>    
  );
};