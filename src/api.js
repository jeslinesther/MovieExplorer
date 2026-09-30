
export const MOVIE_CATEGORIES = [
  { id: "animation", name: "Animation" },
  { id: "action-adventure", name: "Action & Adventure" },
  { id: "comedy", name: "Comedy" },
  { id: "drama", name: "Drama" },
  { id: "horror", name: "Horror" },
  { id: "family", name: "Family" },
  { id: "scifi-fantasy", name: "Sci-Fi & Fantasy" },
  { id: "mystery", name: "Mystery" },
  { id: "documentary", name: "Documentary" },
  { id: "thriller", name: "Thriller" },
  { id: "romance", name: "Romance" },
];

export async function fetchMovies() {
  const results = await Promise.allSettled(
    MOVIE_CATEGORIES.map(async (category) => {
      const response = await fetch(
        `https://api.sampleapis.com/movies/${category.id}`
      );

      if (!response.ok) {
        throw new Error(`Could not load ${category.name}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected movie data format");
      }

      return data.map((movie, index) => ({
        ...movie,
        appId: `${category.id}-${movie.id ?? index}`,
        categoryId: category.id,
        categoryName: category.name,
        title: movie.title || movie.name || "Untitled Movie",
        poster:
          movie.posterURL ||
          movie.posterUrl ||
          movie.poster ||
          movie.image ||
          "",
        year: movie.year || movie.release_date?.slice(0, 4) || "",
        rating:
          movie.imdbRating ??
          movie.rating ??
          movie.vote_average ??
          null,
        description:
          movie.plot ||
          movie.description ||
          movie.overview ||
          movie.synopsis ||
          "",
      }));
    })
  );

  const movies = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);

  if (movies.length === 0) {
    throw new Error(
      "Could not load movie data. Check your internet connection or try again later."
    );
  }

  return movies;
}