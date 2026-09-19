# Music player journey — image asset pack

11 designs, each with a playing and paused PNG. Rhythmbox can be reused for the Ubuntu and Arch chapters. iTunes has three representative looks: Leopard-era iTunes 7, iTunes 10, and iTunes 12.

## Open the preview
Open index.html in a browser. No build or server is required. Select a local audio file, type a title and artist, and click the playback control on a player. The native audio controls also work. Preview state switches only the image.

## Assets
Each image is a 1536 × 1024 PNG on a white background. Filenames end in -playing.png or -paused.png. Playing generally shows the pause action; paused shows the play action. Track titles, artist names, album art and song rows have been left blank.

These are AI-generated recreations, not original screenshots or pixel-perfect historical replicas. They may contain altered UI details and small differences between states. Winamp in particular is stylized. For a production page with completely stable geometry, use one image as the background and draw the play/pause icon, timer and progress bar in HTML/CSS over it.

## Add your own song
The preview uses local file selection and never uploads audio. For a published page, replace the file-selection workflow with an audio source you control, for example:
<audio id="audio" src="my-song.mp3" controls></audio>

Only publish audio you have permission to share. HTML/CSS can draw the page; a small amount of JavaScript synchronizes playback with the image state. See preview.js for that wiring.

players.js contains the asset paths and approximate percentage positions of the click targets and metadata overlays. preview.css positions them relative to the complete image canvas. Adjust these coordinates if you crop or replace assets.

The preview has a single audio element, so switching player skins keeps the current song and playback position. The baked-in 00:00 labels do not track real playback; use the native audio controls or add an HTML timer overlay.

## Generation
Created with the built-in image_gen tool. prompts.json contains the design prompts. Paused versions were generated as edits of the respective playing image, requesting preservation of geometry and blank metadata.

No audio files are included. No deployment is performed.
