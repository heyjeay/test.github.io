var play = true;
var myAudio = document.getElementById("music");
myAudio.volume = 0.3;

function onKeyDown(event) {
    if (event.keyCode === 32) { // Spacebar to toggle music
        play ? myAudio.pause() : myAudio.play();
        play = !play;
    }
}
window.addEventListener("keydown", onKeyDown, false);

// Twitch Live Stream Checker
const streamers = ['penta', 'shroud', 'dgthe99'];

async function checkLiveStreamers() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5'; // Replace with a valid Twitch Client ID
    const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a'; // Replace with a valid Twitch Access Token

    const headers = { 'Client-ID': clientId, 'Authorization': `Bearer ${accessToken}` };

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { headers: headers });
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0].user_login;
        }
        return null;
    } catch (error) {
        console.error('Error checking Twitch streams:', error);
        return null;
    }
}

function updateStreamDisplay() {
    const twitchContainer = document.getElementById('twitch-embed');
    const fallbackVideo = document.getElementById('fallbackVideo');

    checkLiveStreamers().then(liveStreamer => {
        if (liveStreamer) {
            fallbackVideo.style.display = 'none';
            new Twitch.Embed("twitch-embed", {
                width: "100%",
                height: "100%",
                channel: liveStreamer,
                layout: "video",
                autoplay: true,
                muted: true,
                parent: ["heyjeay.github.io"] // This must match exactly
            });
        } else {
            fallbackVideo.style.display = 'block';
        }
    });
}

// Run on page load
updateStreamDisplay();
