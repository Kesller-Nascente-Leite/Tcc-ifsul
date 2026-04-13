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
  Subtitles,
  Bookmark,
  Download,
  Camera,
  PictureInPicture,
  Repeat,
  MessageSquare,
  Monitor,
  Plus,
  X,
  ChevronRight,
  Trash2,
  Upload,
  Gauge,
  Zap,
  Activity,
  Speaker,
} from "lucide-react";
import { useTheme } from "@/app/providers/ThemeContext";

interface VideoPlayerProps {
  videoUrl?: string;
  videoBlob?: Blob;
  title: string;
  videoId?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  onProgressSave?: (time: number) => void;
}

interface Subtitle {
  id: string;
  label: string;
  src: string;
  language: string;
}

interface Marker {
  id: string;
  time: number;
  label: string;
  color?: string;
}

interface Annotation {
  id: string;
  time: number;
  text: string;
  createdAt: Date;
}

interface Chapter {
  id: string;
  time: number;
  title: string;
  thumbnail?: string;
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const QUALITY_OPTIONS = ["auto", "1080p", "720p", "480p", "360p"];

export function VideoPlayer({
  videoUrl,
  videoBlob,
  title,
  videoId,
  onTimeUpdate,
  onComplete,
  onProgressSave,
}: VideoPlayerProps) {
  const { accentColor, isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  // Estados básicos
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Estados avançados
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"speed" | "quality" | "subtitles">("speed");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoop, setIsLoop] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [showChapters, setShowChapters] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState("");

  const controlsTimeoutRef = useRef<number | null>(null);
  const [videoSource, setVideoSource] = useState<string>("");

  // Carregar progresso salvo e legendas
  useEffect(() => {
    if (videoId) {
      const savedProgress = localStorage.getItem(`video_progress_${videoId}`);
      if (savedProgress && videoRef.current) {
        const progress = parseFloat(savedProgress);
        videoRef.current.currentTime = progress;
      }

      const savedMarkers = localStorage.getItem(`video_markers_${videoId}`);
      if (savedMarkers) {
        setMarkers(JSON.parse(savedMarkers));
      }

      const savedAnnotations = localStorage.getItem(`video_annotations_${videoId}`);
      if (savedAnnotations) {
        setAnnotations(JSON.parse(savedAnnotations));
      }

      const savedChapters = localStorage.getItem(`video_chapters_${videoId}`);
      if (savedChapters) {
        setChapters(JSON.parse(savedChapters));
      }

      // Carregar legendas salvas
      const savedSubtitles = localStorage.getItem(`video_subtitles_${videoId}`);
      if (savedSubtitles) {
        setSubtitles(JSON.parse(savedSubtitles));
      }

      const savedActiveSubtitle = localStorage.getItem(`video_active_subtitle_${videoId}`);
      if (savedActiveSubtitle) {
        setActiveSubtitle(savedActiveSubtitle);
      }
    }
  }, [videoId]);

  // Salvar progresso automaticamente
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (videoId && currentTime > 0) {
        localStorage.setItem(`video_progress_${videoId}`, currentTime.toString());
        onProgressSave?.(currentTime);
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [videoId, currentTime, onProgressSave]);

  // Criar URL do blob se fornecido
  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoSource(url);
      return () => URL.revokeObjectURL(url);
    } else if (videoUrl) {
      setVideoSource(videoUrl);
    }
  }, [videoBlob, videoUrl]);

  // Ativar legenda quando selecionada
  useEffect(() => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].id === activeSubtitle ? "showing" : "hidden";
      }
    }
  }, [activeSubtitle]);

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

    if (current >= total - 0.5 && !isLoop) {
      onComplete?.();
      setIsPlaying(false);
    }
  };

  // Atualizar buffer
  const handleProgress = () => {
    if (!videoRef.current) return;
    const bufferedEnd =
      videoRef.current.buffered.length > 0
        ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
        : 0;
    const videoDuration = videoRef.current.duration;
    if (videoDuration && !isNaN(videoDuration) && videoDuration > 0) {
      const bufferPercent = Math.min(100, Math.max(0, (bufferedEnd / videoDuration) * 100));
      setBuffered(bufferPercent);
    } else {
      setBuffered(0);
    }
  };

  // Buscar posição
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  // Mostrar miniatura ao passar o mouse
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setHoveredTime(pos * duration);
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
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Picture-in-Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (!isPiP) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }
    } catch (error) {
      console.error("Erro ao ativar PiP:", error);
    }
  };

  // Pular segundos
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
  };

  // Toggle loop
  const toggleLoop = () => {
    if (!videoRef.current) return;
    videoRef.current.loop = !isLoop;
    setIsLoop(!isLoop);
  };

  // Capturar screenshot
  const takeScreenshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title}_${formatTime(currentTime)}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  // Download do vídeo
  const downloadVideo = () => {
    if (videoSource) {
      const a = document.createElement("a");
      a.href = videoSource;
      a.download = `${title}.mp4`;
      a.click();
    }
  };

  // Upload de legenda
  const handleSubtitleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const blob = new Blob([content], { type: "text/vtt" });
      const url = URL.createObjectURL(blob);

      const newSubtitle: Subtitle = {
        id: Date.now().toString(),
        label: file.name.replace(/\.(vtt|srt)$/, ""),
        src: url,
        language: "pt-BR", // Pode ser configurável
      };

      const updatedSubtitles = [...subtitles, newSubtitle];
      setSubtitles(updatedSubtitles);
      
      if (videoId) {
        // Salvar apenas metadados (sem o blob URL)
        const subtitlesToSave = updatedSubtitles.map(s => ({
          ...s,
          src: s.id === newSubtitle.id ? content : s.src
        }));
        localStorage.setItem(`video_subtitles_${videoId}`, JSON.stringify(subtitlesToSave));
      }

      // Ativar automaticamente
      setActiveSubtitle(newSubtitle.id);
    };
    reader.readAsText(file);
  };

  // Remover legenda
  const removeSubtitle = (id: string) => {
    const updatedSubtitles = subtitles.filter(s => s.id !== id);
    setSubtitles(updatedSubtitles);
    
    if (activeSubtitle === id) {
      setActiveSubtitle(null);
    }
    
    if (videoId) {
      localStorage.setItem(`video_subtitles_${videoId}`, JSON.stringify(updatedSubtitles));
    }
  };

  // Ativar/desativar legenda
  const toggleSubtitle = (id: string | null) => {
    setActiveSubtitle(id);
    if (videoId) {
      if (id) {
        localStorage.setItem(`video_active_subtitle_${videoId}`, id);
      } else {
        localStorage.removeItem(`video_active_subtitle_${videoId}`);
      }
    }
  };

  // Adicionar marcador/bookmark
  const addMarker = () => {
    if (!bookmarkLabel.trim()) return;

    const newMarker: Marker = {
      id: Date.now().toString(),
      time: currentTime,
      label: bookmarkLabel,
      color: accentColor,
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    
    if (videoId) {
      localStorage.setItem(`video_markers_${videoId}`, JSON.stringify(updatedMarkers));
    }

    setBookmarkLabel("");
    setShowBookmarkDialog(false);
  };

  // Remover marcador
  const removeMarker = (id: string) => {
    const updatedMarkers = markers.filter(m => m.id !== id);
    setMarkers(updatedMarkers);
    
    if (videoId) {
      localStorage.setItem(`video_markers_${videoId}`, JSON.stringify(updatedMarkers));
    }
  };

  // Ir para marcador
  const goToMarker = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  // Adicionar anotação
  const addAnnotation = () => {
    if (!newAnnotation.trim()) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      time: currentTime,
      text: newAnnotation,
      createdAt: new Date(),
    };

    const updatedAnnotations = [...annotations, annotation];
    setAnnotations(updatedAnnotations);
    
    if (videoId) {
      localStorage.setItem(`video_annotations_${videoId}`, JSON.stringify(updatedAnnotations));
    }

    setNewAnnotation("");
  };

  // Remover anotação
  const removeAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(a => a.id !== id);
    setAnnotations(updatedAnnotations);
    
    if (videoId) {
      localStorage.setItem(`video_annotations_${videoId}`, JSON.stringify(updatedAnnotations));
    }
  };

  // Ir para capítulo
  const goToChapter = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  // Formatar tempo
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-hide controles
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Teclado shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

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
        case "ArrowUp":
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.min(1, volume + 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            setIsMuted(false);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.max(0, volume - 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
          }
          break;
        case "p":
          togglePiP();
          break;
        case "l":
          toggleLoop();
          break;
        case "t":
          setIsTheaterMode(!isTheaterMode);
          break;
        case "s":
          takeScreenshot();
          break;
        case "b":
          setShowBookmarkDialog(true);
          break;
        case "c":
          setShowChapters(!showChapters);
          break;
        case "n":
          setShowAnnotations(!showAnnotations);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, volume, isTheaterMode, showChapters, showAnnotations]);

  return (
    <div>
      <div
        ref={containerRef}
        className={`relative w-full bg-black overflow-hidden ${
          isTheaterMode ? "rounded-none" : "rounded-xl"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        style={{
          maxWidth: isTheaterMode ? "100vw" : undefined,
          margin: isTheaterMode ? "0 -6rem" : undefined,
        }}
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
          crossOrigin="anonymous"
        >
          {subtitles.map((subtitle) => (
            <track
              key={subtitle.id}
              id={subtitle.id}
              kind="subtitles"
              src={subtitle.src}
              srcLang={subtitle.language}
              label={subtitle.label}
            />
          ))}
        </video>

        {/* Marcadores na timeline */}
        {markers.length > 0 && (
          <div className="absolute bottom-20 left-0 right-0 px-4 pointer-events-none">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute bottom-0 w-1 h-3 rounded-full cursor-pointer pointer-events-auto"
                style={{
                  left: `${(marker.time / duration) * 100}%`,
                  backgroundColor: marker.color || accentColor,
                }}
                title={marker.label}
                onClick={() => goToMarker(marker.time)}
              />
            ))}
          </div>
        )}

        {/* Overlay de controles */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Título */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">{title}</h2>
              <div className="flex items-center gap-2">
                {isLoop && (
                  <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                    Loop ativo
                  </span>
                )}
                {playbackRate !== 1 && (
                  <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                    {playbackRate}x
                  </span>
                )}
                {activeSubtitle && (
                  <span className="px-2 py-1 bg-white/20 rounded text-xs text-white flex items-center gap-1">
                    <Subtitles size={12} />
                    CC
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botão Play/Pause Central */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlayPause}
                className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all pointer-events-auto"
                style={{
                  boxShadow: `0 0 30px ${accentColor}40`,
                }}
              >
                <Play size={48} className="text-white" fill="white" />
              </button>
            </div>
          )}

          {/* Controles Inferiores */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Barra de Progresso */}
            <div className="relative">
              <div
                ref={progressBarRef}
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all relative"
                onClick={handleSeek}
                onMouseMove={handleProgressHover}
                onMouseLeave={() => setHoveredTime(null)}
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
                    style={{ boxShadow: `0 0 8px ${accentColor}` }}
                  />
                </div>

                {/* Miniatura ao passar o mouse */}
                {hoveredTime !== null && (
                  <div
                    className="absolute bottom-full mb-2 transform -translate-x-1/2 pointer-events-none"
                    style={{
                      left: `${(hoveredTime / duration) * 100}%`,
                    }}
                  >
                    <div className="bg-black/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                      {formatTime(hoveredTime)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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

                <button
                  onClick={skipBackward}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Voltar 10s (←)"
                >
                  <SkipBack size={20} className="text-white" />
                </button>

                <button
                  onClick={skipForward}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Avançar 10s (→)"
                >
                  <SkipForward size={20} className="text-white" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Mute (M)"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} className="text-white" />
                    ) : (
                      <Volume2 size={20} className="text-white" />
                    )}
                  </button>

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
                <span className="text-white text-sm font-medium tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Loop */}
                <button
                  onClick={toggleLoop}
                  className={`p-2 rounded-lg transition-colors ${
                    isLoop ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                  title="Loop (L)"
                >
                  <Repeat size={20} className="text-white" />
                </button>

                {/* Bookmark */}
                <button
                  onClick={() => setShowBookmarkDialog(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Adicionar marcador (B)"
                >
                  <Bookmark size={20} className="text-white" />
                </button>

                {/* Anotações */}
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className={`p-2 rounded-lg transition-colors relative ${
                    showAnnotations ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                  title="Anotações (N)"
                >
                  <MessageSquare size={20} className="text-white" />
                  {annotations.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {annotations.length}
                    </span>
                  )}
                </button>

                {/* Capítulos */}
                {chapters.length > 0 && (
                  <button
                    onClick={() => setShowChapters(!showChapters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showChapters ? "bg-white/30" : "hover:bg-white/20"
                    }`}
                    title="Capítulos (C)"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                )}

                {/* Screenshot */}
                <button
                  onClick={takeScreenshot}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Screenshot (S)"
                >
                  <Camera size={20} className="text-white" />
                </button>

                {/* Download */}
                <button
                  onClick={downloadVideo}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={20} className="text-white" />
                </button>

                {/* Picture-in-Picture */}
                <button
                  onClick={togglePiP}
                  className={`p-2 rounded-lg transition-colors ${
                    isPiP ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                  title="Picture-in-Picture (P)"
                >
                  <PictureInPicture size={20} className="text-white" />
                </button>

                {/* Modo Teatro */}
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    isTheaterMode ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                  title="Modo Teatro (T)"
                >
                  <Monitor size={20} className="text-white" />
                </button>

                {/* Configurações */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-colors ${
                      showSettings ? "bg-white/30" : "hover:bg-white/20"
                    }`}
                  >
                    <Settings size={20} className="text-white" />
                  </button>

                  {showSettings && (
                    <div
                      className="absolute bottom-full right-0 mb-2 rounded-xl overflow-hidden backdrop-blur-md"
                      style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(30,30,30,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        minWidth: "280px",
                      }}
                    >
                      {/* Tabs */}
                      <div className="flex border-b border-white/10">
                        <button
                          onClick={() => setSettingsTab("speed")}
                          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
                            settingsTab === "speed"
                              ? "text-white border-b-2"
                              : "text-white/60 hover:text-white/80"
                          }`}
                          style={{
                            borderColor: settingsTab === "speed" ? accentColor : "transparent",
                          }}
                        >
                          Velocidade
                        </button>
                        <button
                          onClick={() => setSettingsTab("quality")}
                          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
                            settingsTab === "quality"
                              ? "text-white border-b-2"
                              : "text-white/60 hover:text-white/80"
                          }`}
                          style={{
                            borderColor: settingsTab === "quality" ? accentColor : "transparent",
                          }}
                        >
                          Qualidade
                        </button>
                        <button
                          onClick={() => setSettingsTab("subtitles")}
                          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
                            settingsTab === "subtitles"
                              ? "text-white border-b-2"
                              : "text-white/60 hover:text-white/80"
                          }`}
                          style={{
                            borderColor: settingsTab === "subtitles" ? accentColor : "transparent",
                          }}
                        >
                          Legendas
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {settingsTab === "speed" && (
                          <div className="space-y-1">
                            {PLAYBACK_RATES.map((rate) => (
                              <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                                style={{
                                  color: playbackRate === rate ? accentColor : "white",
                                  backgroundColor: playbackRate === rate ? `${accentColor}20` : "transparent",
                                }}
                              >
                                {rate === 1 ? "Normal" : `${rate}x`}
                                {playbackRate === rate && " ✓"}
                              </button>
                            ))}
                          </div>
                        )}

                        {settingsTab === "quality" && (
                          <div className="space-y-1">
                            {QUALITY_OPTIONS.map((q) => (
                              <button
                                key={q}
                                onClick={() => setQuality(q)}
                                className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                                style={{
                                  color: quality === q ? accentColor : "white",
                                  backgroundColor: quality === q ? `${accentColor}20` : "transparent",
                                }}
                              >
                                {q.charAt(0).toUpperCase() + q.slice(1)}
                                {quality === q && " ✓"}
                              </button>
                            ))}
                          </div>
                        )}

                        {settingsTab === "subtitles" && (
                          <div className="space-y-1">
                            <button
                              onClick={() => toggleSubtitle(null)}
                              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                              style={{
                                color: !activeSubtitle ? accentColor : "white",
                                backgroundColor: !activeSubtitle ? `${accentColor}20` : "transparent",
                              }}
                            >
                              Desativado
                              {!activeSubtitle && " ✓"}
                            </button>
                            
                            {subtitles.map((subtitle) => (
                              <div key={subtitle.id} className="flex items-center justify-between group">
                                <button
                                  onClick={() => toggleSubtitle(subtitle.id)}
                                  className="flex-1 text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                                  style={{
                                    color: activeSubtitle === subtitle.id ? accentColor : "white",
                                    backgroundColor: activeSubtitle === subtitle.id ? `${accentColor}20` : "transparent",
                                  }}
                                >
                                  {subtitle.label}
                                  {activeSubtitle === subtitle.id && " ✓"}
                                </button>
                                <button
                                  onClick={() => removeSubtitle(subtitle.id)}
                                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                                >
                                  <Trash2 size={14} className="text-red-400" />
                                </button>
                              </div>
                            ))}
                            
                            <div className="pt-2 border-t border-white/10">
                              <input
                                ref={subtitleInputRef}
                                type="file"
                                accept=".vtt,.srt"
                                onChange={handleSubtitleUpload}
                                className="hidden"
                              />
                              <button
                                onClick={() => subtitleInputRef.current?.click()}
                                className="w-full px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors text-white flex items-center justify-center gap-2"
                              >
                                <Upload size={16} />
                                Carregar Legenda (.vtt/.srt)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Tela cheia (F)"
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

        {/* Dialog de Bookmark */}
        {showBookmarkDialog && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div
              className="p-6 rounded-2xl max-w-md w-full mx-4"
              style={{
                backgroundColor: isDark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-white font-bold text-lg mb-4">
                Adicionar Marcador
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">
                    Tempo: {formatTime(currentTime)}
                  </label>
                  <input
                    type="text"
                    value={bookmarkLabel}
                    onChange={(e) => setBookmarkLabel(e.target.value)}
                    placeholder="Título do marcador..."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none"
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && addMarker()}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowBookmarkDialog(false);
                      setBookmarkLabel("");
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addMarker}
                    className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Painel de Anotações */}
        {showAnnotations && (
          <div
            className="absolute right-4 top-20 bottom-20 w-80 rounded-xl backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(30,30,30,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-bold">Anotações</h3>
              <button
                onClick={() => setShowAnnotations(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 140px)" }}>
              {annotations.length === 0 ? (
                <p className="text-white/50 text-sm text-center py-8">
                  Nenhuma anotação ainda
                </p>
              ) : (
                annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => goToMarker(annotation.time)}
                        className="text-xs font-mono hover:underline"
                        style={{ color: accentColor }}
                      >
                        {formatTime(annotation.time)}
                      </button>
                      <button
                        onClick={() => removeAnnotation(annotation.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-white/50" />
                      </button>
                    </div>
                    <p className="text-white text-sm">{annotation.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                  placeholder="Nova anotação..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:border-white/40 outline-none"
                  onKeyPress={(e) => e.key === "Enter" && addAnnotation()}
                />
                <button
                  onClick={addAnnotation}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Painel de Capítulos */}
        {showChapters && chapters.length > 0 && (
          <div
            className="absolute left-4 top-20 bottom-20 w-80 rounded-xl backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(30,30,30,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-bold">Capítulos</h3>
              <button
                onClick={() => setShowChapters(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="p-2 overflow-y-auto" style={{ maxHeight: "calc(100% - 64px)" }}>
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => goToChapter(chapter.time)}
                  className="w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-left mb-2"
                  style={{
                    backgroundColor:
                      currentTime >= chapter.time &&
                      (index === chapters.length - 1 || currentTime < chapters[index + 1].time)
                        ? `${accentColor}20`
                        : "transparent",
                  }}
                >
                  <div className="flex gap-3">
                    {chapter.thumbnail && (
                      <img
                        src={chapter.thumbnail}
                        alt={chapter.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">
                        {chapter.title}
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatTime(chapter.time)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Marcadores (flutuante) */}
        {markers.length > 0 && !showAnnotations && !showChapters && (
          <div
            className="absolute right-4 top-20 rounded-xl backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(30,30,30,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: "250px",
            }}
          >
            <div className="p-3 border-b border-white/10">
              <h4 className="text-white font-semibold text-sm">Marcadores</h4>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/10 transition-colors mb-1"
                >
                  <button
                    onClick={() => goToMarker(marker.time)}
                    className="flex-1 text-left"
                  >
                    <p className="text-white text-sm">{marker.label}</p>
                    <p className="text-white/50 text-xs">
                      {formatTime(marker.time)}
                    </p>
                  </button>
                  <button
                    onClick={() => removeMarker(marker.id)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-white/50" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STATUS EM TEMPO REAL - ABAIXO DO PLAYER */}
      <div className="mt-4">
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Status em Tempo Real
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* Status de Reprodução */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Activity
                size={16}
                style={{ color: isPlaying ? accentColor : "var(--color-text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Status
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: isPlaying ? accentColor : "var(--color-text-primary)" }}
                >
                  {isPlaying ? "Reproduzindo" : "Pausado"}
                </p>
              </div>
            </div>

            {/* Velocidade */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Gauge size={16} style={{ color: accentColor }} />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Velocidade
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {playbackRate}x
                </p>
              </div>
            </div>

            {/* Volume */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Speaker size={16} style={{ color: accentColor }} />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Volume
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {isMuted ? "Mudo" : `${Math.round(volume * 100)}%`}
                </p>
              </div>
            </div>

            {/* Legenda */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Subtitles size={16} style={{ color: activeSubtitle ? accentColor : "var(--color-text-secondary)" }} />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Legendas
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: activeSubtitle ? accentColor : "var(--color-text-primary)" }}
                >
                  {activeSubtitle ? "Ativa" : "Desativada"}
                </p>
              </div>
            </div>

            {/* Qualidade */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Zap size={16} style={{ color: accentColor }} />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Qualidade
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {quality.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Modo */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <Monitor size={16} style={{ color: isTheaterMode || isFullscreen || isPiP ? accentColor : "var(--color-text-secondary)" }} />
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Modo
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: isTheaterMode || isFullscreen || isPiP ? accentColor : "var(--color-text-primary)" }}
                >
                  {isFullscreen ? "Tela cheia" : isPiP ? "PiP" : isTheaterMode ? "Teatro" : "Normal"}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progresso adicional */}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span style={{ color: "var(--color-text-secondary)" }}>
                {buffered > 0 && !isNaN(buffered) ? `Buffer: ${buffered.toFixed(0)}%` : 'Buffer: Carregando...'}
              </span>
              <span style={{ color: accentColor }}>
                {isLoop && "🔁 Loop ativo"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}