import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface VideoPlayerProps {
  videoUrl?: string;
  videoBlob?: Blob;
  title: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({
  videoUrl,
  videoBlob,
  title,
  onTimeUpdate,
  onComplete,
}: VideoPlayerProps) {
  const { accentColor } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Criar URL do blob se fornecido
  const [videoSource, setVideoSource] = useState<string>("");

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoSource(url);
      return () => URL.revokeObjectURL(url);
    } else if (videoUrl) {
      setVideoSource(videoUrl);
    }
  }, [videoBlob, videoUrl]);

  // Play/Pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Atualizar tempo
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;

    setCurrentTime(current);
    setDuration(total);

    if (onTimeUpdate) {
      onTimeUpdate(current, total);
    }

    // Verificar se completou
    if (current >= total - 0.5) {
      onComplete?.();
    }
  };

  // Atualizar buffer
  const handleProgress = () => {
    if (!videoRef.current) return;
    const bufferedEnd =
      videoRef.current.buffered.length > 0
        ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
        : 0;
    setBuffered((bufferedEnd / videoRef.current.duration) * 100);
  };

  // Buscar posição
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  // Controle de volume
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, pos));

    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Mute/Unmute
  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Pular 10 segundos
  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      duration,
      videoRef.current.currentTime + 10
    );
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      videoRef.current.currentTime - 10
    );
  };

  // Velocidade de reprodução
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  // Formatar tempo
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-hide controles
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Teclado shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
        case "ArrowLeft":
          skipBackward();
          break;
        case "ArrowRight":
          skipForward();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Vídeo */}
      <video
        ref={videoRef}
        src={videoSource}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onClick={togglePlayPause}
      />

      {/* Overlay de controles */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Título */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-linear-to-b from-black/60 to-transparent">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>

        {/* Botão Play/Pause Central */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              <Play size={48} className="text-white" fill="white" />
            </button>
          </div>
        )}

        {/* Controles Inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Barra de Progresso */}
          <div
            ref={progressBarRef}
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all"
            onClick={handleSeek}
          >
            {/* Buffer */}
            <div
              className="h-full bg-white/40 rounded-full absolute"
              style={{ width: `${buffered}%` }}
            />
            {/* Progresso */}
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${(currentTime / duration) * 100}%`,
                backgroundColor: accentColor,
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
                style={{ boxShadow: "0 0 4px rgba(0,0,0,0.3)" }}
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause size={24} className="text-white" />
                ) : (
                  <Play size={24} className="text-white" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={skipBackward}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <SkipBack size={20} className="text-white" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={skipForward}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <SkipForward size={20} className="text-white" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} className="text-white" />
                  ) : (
                    <Volume2 size={20} className="text-white" />
                  )}
                </button>

                {/* Barra de Volume */}
                <div
                  ref={volumeBarRef}
                  className="w-0 group-hover:w-20 transition-all overflow-hidden"
                >
                  <div
                    className="h-1.5 bg-white/30 rounded-full cursor-pointer"
                    onClick={handleVolumeChange}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${isMuted ? 0 : volume * 100}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tempo */}
              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Velocidade */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Settings size={20} className="text-white" />
                </button>

                {showSettings && (
                  <div
                    className="absolute bottom-full right-0 mb-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="text-xs font-semibold mb-2 text-white">
                      Velocidade
                    </div>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 transition-colors"
                        style={{
                          color:
                            playbackRate === rate ? accentColor : "white",
                        }}
                      >
                        {rate}x
                        {playbackRate === rate && " ✓"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <Minimize size={20} className="text-white" />
                ) : (
                  <Maximize size={20} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}