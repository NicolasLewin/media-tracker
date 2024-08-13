import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";

export default function Games() {

    fetch(
      "https://api.igdb.com/v4/games",
      { method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': '',
          'Authorization': 'Bearer ',
        },
    body: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;"
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => {
          console.error(err);
      });


    return (
    <main>
        <Header />
        <Spacing height={100} />
        
    </main>
  );
}