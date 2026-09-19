// Real screenshots, preserved at their original resolution. Cropping happens in SVG.
const PLAYERS = [
  {
    "id": "01-winamp-2",
    "name": "Winamp 2",
    "image": "assets/real/01-winamp-2.png",
    "dimensions": [
      475,
      434
    ],
    "crop": [
      127,
      50,
      275,
      348
    ],
    "bounds": [
      418.0,
      69.091,
      700.0,
      885.818
    ],
    "source": "https://www.clasicosbasicos.org/software/winamp",
    "original": "https://www.clasicosbasicos.org/wp-content/uploads/2026/09/claba-software-winamp-captura-2.png",
    "note": "Winamp 2.00; native 275-pixel-wide skin, desktop cropped by SVG."
  },
  {
    "id": "02-winamp-3",
    "name": "Winamp 3",
    "image": "assets/real/02-winamp-3.png",
    "dimensions": [
      275,
      116
    ],
    "crop": [
      0,
      0,
      275,
      116
    ],
    "bounds": [
      318.0,
      322.182,
      900.0,
      379.636
    ],
    "source": "https://getwacup.com/community/index.php?topic=1531.0",
    "original": "https://i.imgur.com/4UOJhSG.png",
    "note": "Unmodified Winamp3 skin shown in the July 21, 2022 forum reply; capture may run in Winamp 5."
  },
  {
    "id": "03-winamp-5",
    "name": "Winamp 5",
    "image": "assets/real/03-winamp-5.gif",
    "dimensions": [
      357,
      167
    ],
    "crop": [
      0,
      0,
      357,
      167
    ],
    "bounds": [
      268.0,
      278.106,
      1000.0,
      467.787
    ],
    "source": "https://www.meggamusic.co.uk/winamp/docs/help/The_Winamp_Media_Player.htm",
    "original": "https://www.meggamusic.co.uk/winamp/docs/help/main_skin_screenshot1.gif",
    "note": "Winamp Modern skin from the player help; native small GIF."
  },
  {
    "id": "04-foobar2000",
    "name": "foobar2000",
    "image": "assets/real/04-foobar2000.webp",
    "dimensions": [
      789,
      371
    ],
    "crop": [
      0,
      0,
      789,
      371
    ],
    "bounds": [
      68.0,
      182.849,
      1400.0,
      658.302
    ],
    "source": "https://www.foobar2000.org/screenshots-retro",
    "original": "https://www.foobar2000.org/images/screenshots-retro/main-simple.webp",
    "note": "Official retro screenshot, visibly foobar2000 v0.9.6 on Windows Vista; later than the 2004 timeline label."
  },
  {
    "id": "05-amarok",
    "name": "amaroK 1.4",
    "image": "assets/real/05-amarok.png",
    "dimensions": [
      960,
      680
    ],
    "crop": [
      0,
      0,
      960,
      680
    ],
    "bounds": [
      125.647,
      57.0,
      1284.706,
      910.0
    ],
    "source": "https://commons.wikimedia.org/wiki/File:Amarok_1.4.9_en_1_alb.png",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/01/Amarok_1.4.9_en_1_alb.png",
    "note": "Amarok 1.4.9, English, Debian/KWin, 2008. Screenshot AVRS; GNU GPL and CC BY 3.0 notices on source."
  },
  {
    "id": "06-rhythmbox",
    "name": "Rhythmbox",
    "image": "assets/real/06-rhythmbox.png",
    "dimensions": [
      1280,
      1001
    ],
    "crop": [
      0,
      0,
      1280,
      1001
    ],
    "bounds": [
      186.182,
      57.0,
      1163.636,
      910.0
    ],
    "source": "https://commons.wikimedia.org/wiki/File:Rhythmbox_0.11.5_on_ubuntu.png",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/94/Rhythmbox_0.11.5_on_ubuntu.png",
    "note": "Rhythmbox 0.11.5, Ubuntu 8.04, Spanish. Screenshot Victor Lozano; GFDL / CC BY-SA 3.0."
  },
  {
    "id": "07-itunes-7",
    "name": "iTunes \u00b7 Leopard",
    "image": "assets/real/07-itunes-7.png",
    "dimensions": [
      1105,
      870
    ],
    "crop": [
      0,
      0,
      1105,
      870
    ],
    "bounds": [
      190.097,
      57.0,
      1155.805,
      910.0
    ],
    "source": "https://www.flickr.com/photos/swanksalot/242434888/",
    "original": "https://live.staticflickr.com/84/242434888_d1112fdaba_o.png",
    "note": "iTunes 7 on Mac, September 2006. Seth Anderson / swanksalot, CC BY-NC-SA 2.0. Earlier than Leopard; representative of the iTunes 7 interface."
  },
  {
    "id": "08-itunes-10",
    "name": "iTunes 10",
    "image": "assets/real/08-itunes-10.png",
    "dimensions": [
      946,
      614
    ],
    "crop": [
      0,
      0,
      946,
      614
    ],
    "bounds": [
      68.0,
      57.666,
      1400.0,
      908.668
    ],
    "source": "https://www.versionmuseum.com/history-of/itunes-app",
    "original": "https://www.versionmuseum.com/images/applications/itunes-app/itunes-app%5E2010%5Eitunes-10-music-library-with-ping.png",
    "note": "iTunes 10, 2010; Version Museum attributes the screenshot to Macworld."
  },
  {
    "id": "09-itunes-12",
    "name": "iTunes 12",
    "image": "assets/real/09-itunes-12.jpg",
    "dimensions": [
      1892,
      1018
    ],
    "crop": [
      0,
      0,
      1892,
      1018
    ],
    "bounds": [
      53.0,
      127.291,
      1430.0,
      769.419
    ],
    "source": "https://www.versionmuseum.com/history-of/itunes-app",
    "original": "https://www.versionmuseum.com/images/applications/itunes-app/itunes-app%5E2014%5Eitunes-12-music-library-visible-sidebar.jpg",
    "note": "iTunes 12, 2014; Version Museum attributes the screenshot to Intego / Kirk McElhearn."
  },
  {
    "id": "10-apple-music",
    "name": "Apple Music",
    "image": "assets/real/10-apple-music.jpg",
    "dimensions": [
      1548,
      972
    ],
    "crop": [
      115,
      72,
      1318,
      778
    ],
    "bounds": [
      53.0,
      89.944,
      1430.0,
      844.112
    ],
    "source": "https://kirkville.com/the-fate-of-the-itunes-store-in-macos-catalina/",
    "original": "https://i0.wp.com/kirkville.com/wp-content/uploads/2019/08/music-app.jpg?ssl=1",
    "note": "Catalina Music, 2019, Kirk McElhearn article; desktop and dock cropped by SVG."
  },
  {
    "id": "11-spotify",
    "name": "Spotify",
    "image": "assets/real/11-spotify.png",
    "dimensions": [
      1366,
      768
    ],
    "crop": [
      0,
      0,
      1366,
      768
    ],
    "bounds": [
      53.0,
      110.009,
      1430.0,
      803.982
    ],
    "source": "https://newsroom.spotify.com/2021-03-25/introducing-a-new-spotify-experience-across-desktop-app-and-web-player/",
    "original": "https://storage.googleapis.com/pr-newsroom-wp/1/2021/03/After-downloaded-music-Playlist-2.png",
    "note": "Official Spotify 2021 desktop redesign, one year later than the timeline label."
  },
  {
    "id": "12-spotify-2026",
    "name": "Spotify",
    "image": "assets/real/12-spotify-2026.png",
    "dimensions": [
      3354,
      2166
    ],
    "crop": [
      0,
      0,
      3354,
      2166
    ],
    "bounds": [
      63.443,
      57.0,
      1409.114,
      910.0
    ],
    "source": "Owner-provided screenshot, September 19, 2026",
    "original": "Screenshot 2026-09-19 at 23.05.35.png",
    "note": "Spotify for macOS, captured by the site owner on September 19, 2026. Original 3354 × 2166 screenshot; exact app version not recorded."
  }
];
if (typeof module !== 'undefined') module.exports = { PLAYERS };
