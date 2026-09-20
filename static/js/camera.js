/**
 * CareLens AI - Universal Camera & Viewfinder Module
 */

let webcamStream = null;

async function triggerUniversalCamera() {
  const isSecureContext = window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';

  if (isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      await openLiveWebcam();
      return;
    } catch (err) {
      console.warn('Webcam viewfinder failed, falling back to native camera input:', err);
    }
  }
  document.getElementById('cameraInput').click();
}

async function openLiveWebcam() {
  const modal = document.getElementById('webcamModal');
  const video = document.getElementById('webcamVideo');

  const constraints = [
    { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: true, audio: false }
  ];

  let stream = null;
  for (const c of constraints) {
    try {
      stream = await navigator.mediaDevices.getUserMedia(c);
      break;
    } catch (e) {}
  }

  if (!stream) {
    document.getElementById('cameraInput').click();
    return;
  }

  webcamStream = stream;
  video.srcObject = stream;
  await new Promise(resolve => {
    video.onloadedmetadata = resolve;
    setTimeout(resolve, 2000);
  });
  video.play();
  modal.classList.remove('hidden');
}

function closeLiveWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  const modal = document.getElementById('webcamModal');
  if (modal) modal.classList.add('hidden');
}

function captureWebcamSnapshot() {
  const video = document.getElementById('webcamVideo');
  const canvas = document.getElementById('snapshotCanvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  closeLiveWebcam();
  window.currentImageBase64 = dataUrl.split(',')[1];
  window.processImage(dataUrl);
}

function triggerFilePicker() {
  document.getElementById('galleryInput').click();
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    window.currentImageBase64 = dataUrl.split(',')[1];
    window.processImage(dataUrl);
  };
  reader.readAsDataURL(file);
}
