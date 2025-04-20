import { Search } from "../components/Search";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPlay, FaPause } from "react-icons/fa";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedSongs, setSearchedSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError("Error playing audio. Please try another song.");
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!searchTerm.trim()) {
        setSearchedSongs([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.lyrics.ovh/suggest/${searchTerm}`
        );

        setSearchedSongs(response.data.data || []);
        setError("");
      } catch (error) {
        console.log(error);
        setError("Failed to fetch songs. Please try again.");
        setSearchedSongs([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchSongs();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchLyrics = async (artist, title) => {
    try {
      setLoading(true);
      setError("");
      setLyrics("");

      const response = await axios.get(
        `https://api.lyrics.ovh/v1/${artist}/${title}`
      );

      setLyrics(response.data.lyrics);
    } catch (error) {
      console.log(error);
      setError("Lyrics not found for this song.");
      setLyrics("");
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    fetchLyrics(song.artist.name, song.title);
  };

  const handleBackToResults = () => {
    setSelectedSong(null);
    setLyrics("");
    setError("");
  };

  const handlePlayPause = (song) => {
    const audio = audioRef.current;

    // If we're already playing this song
    if (currentlyPlaying && currentlyPlaying.id === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          setError("Error playing audio. Please try another song.");
        });
        setIsPlaying(true);
      }
    } else {
      // If we're playing a different song or no song
      if (isPlaying) {
        audio.pause();
      }

      // Set the new audio source
      audio.src = song.preview;
      setCurrentlyPlaying(song);

      // Play the new song
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        setError("Error playing audio. Please try another song.");
      });
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {loading && (
          <div className="text-white text-center py-5">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-5">
            <p>{error}</p>
          </div>
        )}

        {!selectedSong ? (
          <div className="bg-[#303236] mt-20">
            <h1 className="text-white text-center py-5 uppercase">Songs</h1>
            <div className="flex flex-wrap gap-5 text-white p-5 justify-center">
              {Array.isArray(searchedSongs) && searchedSongs.length > 0 ? (
                searchedSongs.map((song) => {
                  const isThisSongPlaying =
                    isPlaying &&
                    currentlyPlaying &&
                    currentlyPlaying.id === song.id;

                  return (
                    <div
                      key={song.id}
                      className={`bg-[#303236] px-5 py-5 w-[200px] rounded-xl cursor-pointer hover:bg-[#3a3c41] transition-colors ${
                        isThisSongPlaying ? "border-2 border-[#E87629]" : ""
                      }`}
                      onClick={() => handleSongSelect(song)}
                    >
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">title</span>
                        <p className="text-xs capitalize">{song.title}</p>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-gray-500">artist</span>
                        <p className="text-xs capitalize">{song.artist.name}</p>
                      </div>

                      <div className="flex gap-2">
                        {song.preview && (
                          <button
                            className={`${
                              isThisSongPlaying
                                ? "bg-[#d06724]"
                                : "bg-[#E87629]"
                            } text-white text-xs py-1 px-3 rounded-lg flex-1 hover:bg-[#d06724] flex items-center justify-center`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPause(song);
                            }}
                          >
                            {isThisSongPlaying ? (
                              <FaPause className="mr-1" />
                            ) : (
                              <FaPlay className="mr-1" />
                            )}
                            {isThisSongPlaying ? "Pause" : "Play"}
                          </button>
                        )}
                        <button
                          className="bg-[#181B21] text-white text-xs py-1 px-3 rounded-lg flex-1 hover:bg-[#252830]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSongSelect(song);
                          }}
                        >
                          Lyrics
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : searchTerm.trim() ? (
                <p>No songs found</p>
              ) : (
                <p>Search for a song to get started</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#303236] p-5 rounded-xl text-white mt-20">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedSong.title}</h2>
                <p className="text-gray-400">by {selectedSong.artist.name}</p>
              </div>
              <div className="flex gap-2">
                {selectedSong.preview && (
                  <button
                    className={`${
                      isPlaying &&
                      currentlyPlaying &&
                      currentlyPlaying.id === selectedSong.id
                        ? "bg-[#d06724]"
                        : "bg-[#E87629]"
                    } text-white text-xs py-1 px-3 rounded-lg hover:bg-[#d06724] flex items-center`}
                    onClick={() => handlePlayPause(selectedSong)}
                  >
                    {isPlaying &&
                    currentlyPlaying &&
                    currentlyPlaying.id === selectedSong.id ? (
                      <>
                        <FaPause className="mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <FaPlay className="mr-1" /> Play
                      </>
                    )}
                  </button>
                )}
                <button
                  className="bg-[#181B21] text-white text-xs py-1 px-3 rounded-lg hover:bg-[#252830]"
                  onClick={handleBackToResults}
                >
                  Back to results
                </button>
              </div>
            </div>

            <div className="bg-[#181B21] p-4 rounded-lg">
              <h3 className="text-[#E87629] mb-3">Lyrics</h3>
              {loading ? (
                <p className="text-gray-400">Loading lyrics...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : lyrics ? (
                <pre className="text-white whitespace-pre-wrap font-sans">
                  {lyrics}
                </pre>
              ) : (
                <p className="text-gray-400">No lyrics found for this song.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
