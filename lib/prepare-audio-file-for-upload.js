export default function prepareAudioFileForUpload(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = (e) => {
      // Assuming the file is in an audio format that can be handled directly
      const audioDataUrl = e.target.result;
      resolve(audioDataUrl);
    };
    fr.readAsDataURL(file);
  });
}
