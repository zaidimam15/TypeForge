const SOUND_DATA =
    "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjcuMTAzAAAAAAAAAAAAAAD/88QAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAA";

// Small audio pool so fast typing also works smoothly
const audioPool = Array.from({ length: 8 }, () => {
    const audio = new Audio(SOUND_DATA);
    audio.preload = "auto";
    audio.volume = 0.7;
    return audio;
});

let audioIndex = 0;

const playSound = () => {
    const audio = audioPool[audioIndex];

    audio.currentTime = 0;

    audio.play().catch(() => { });

    audioIndex = (audioIndex + 1) % audioPool.length;
};

export const playTypingSound = () => {
    playSound();
};

export const playBackspaceSound = () => {
    playSound();
};

export const playSpaceSound = () => {
    playSound();
};