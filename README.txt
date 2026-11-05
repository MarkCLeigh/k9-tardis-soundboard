K-9 TARDIS SOUND CONSOLE — PWA STARTER

WHAT THIS IS
A first working web-app version of the K-9 soundboard. It has eight channels, random clip selection without an immediate repeat in the same channel, stop/replay, master volume, and local audio-file storage.

IMPORTANT
This is a web app source bundle, not yet a live website or an App Store app.
To install it as an iPhone Home Screen app with offline caching, it must be hosted on an HTTPS website.

QUICK TEST
You can open index.html on a computer for a basic preview, but PWA installation and offline service-worker support require HTTPS hosting.

PUBLISHING
1. Upload the contents of this folder (not the enclosing folder) to a static HTTPS host such as GitHub Pages or Netlify.
2. Open the resulting HTTPS address in Safari on the iPhone.
3. Tap Share > Add to Home Screen > Add.
4. Open the new K-9 icon once while online. Then import your sound files using SOUND LIBRARY.
5. Pair the iPhone with the Bluetooth amplifier in K-9. iOS routes app audio to the selected Bluetooth output.

AUDIO
MP3, WAV, M4A and other browser-supported audio files can be imported. Clips are stored locally in the browser's IndexedDB database on that iPhone. They are not uploaded to a server. Do not clear Safari website data if you want to retain the imported recordings.

LIMITATIONS
- Keep the app open and the iPhone awake during use; iOS may suspend web-app audio when backgrounded or locked.
- Imported sounds are stored on that iPhone/browser installation and are not automatically backed up.
- This starter does not yet include sound sequences, button renaming, custom button artwork, or hold-to-play. Those can be added in a next iteration.
- The TARDIS styling uses a Google font when online and falls back to system monospace fonts offline.
