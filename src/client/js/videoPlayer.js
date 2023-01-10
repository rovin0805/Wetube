const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('volume');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

let volumeValue = 0.5;
video.volume = volumeValue;
let videoStatus = false;
let controlsTimeoutId = null;
let controlsMovementTimeoutId = null;

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause';
};

const handleMute = () => {
  video.muted = !video.muted;
  muteBtnIcon.classList = video.muted
    ? 'fas fa-volume-mute'
    : 'fas fa-volume-up';
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleInputVolume = (event) => {
  const {
    target: { value },
  } = event;
  volumeValue = value;
  video.volume = value;
  if (Number(value) === 0) {
    muteBtnIcon.classList = 'fas fa-volume-mute';
    video.muted = true;
  } else {
    muteBtnIcon.classList = 'fas fa-volume-up';
    video.muted = false;
  }
};

const handleLoadedMetaData = () => {
  const duration = Math.floor(video.duration);
  totalTime.innerText = formatTime(duration);
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  const videoCurrentTime = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(videoCurrentTime);
  timeline.value = Math.floor(video.currentTime);
};

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

const handleInputTimeline = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleTimelineMousedown = () => {
  videoStatus = !video.paused;
  video.pause();
};

const handleTimelineMouseup = () => {
  if (videoStatus) {
    video.play();
  } else {
    video.pause();
  }
};

const handleFullScreen = () => {
  const isFullScreen = document.fullscreenElement;
  if (isFullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = 'fas fa-expand';
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = 'fas fa-compress';
  }
};

const handleMouseMove = () => {
  if (controlsTimeoutId) {
    clearTimeout(controlsTimeoutId);
    controlsTimeoutId = null;
  }
  if (controlsMovementTimeoutId) {
    clearTimeout(controlsMovementTimeoutId);
    controlsMovementTimeoutId = null;
  }
  videoControls.classList.add('showing');
  controlsMovementTimeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeoutId = setTimeout(hideControls, 3000);
};

const hideControls = () => videoControls.classList.remove('showing');

playBtn.addEventListener('click', handlePlay);
window.addEventListener(
  'keydown',
  (event) => event.code === 'Enter' && handlePlay()
);
document.addEventListener(
  'keyup',
  (event) => event.code === 'Space' && handlePlay()
);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleInputVolume);
video.readyState
  ? handleLoadedMetaData()
  : video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('click', handlePlay);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
timeline.addEventListener('input', handleInputTimeline);
timeline.addEventListener('mousedown', handleTimelineMousedown);
timeline.addEventListener('mouseup', handleTimelineMouseup);
fullScreenBtn.addEventListener('click', handleFullScreen);
