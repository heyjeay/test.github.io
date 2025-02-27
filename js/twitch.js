const streamers = ['penta', 'shroud', 'dgthe99'];

async function checkLiveStreamers() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a';

    const headers = { 'Client-ID': clientId, 'Authorization': `Bearer ${accessToken}` };

    try {
        console.log('Checking Twitch live streams...');
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { headers: headers });
        const data = await response.json();
        console.log('Live Stream Check:', data);

        if (data.data && data.data.length > 0) {
            console.log('Live streamer found:', data.data[0].user_login);
            return data.data[0].user_login;
        }
        console.log('No live streamers found.');
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
            console.log(`Embedding live Twitch stream: ${liveStreamer}`);
            fallbackVideo.style.display = 'none';
            twitchContainer.innerHTML = ''; 
            new Twitch.Embed("twitch-embed", {
                width: "100%",
                height: "100%",
                channel: liveStreamer,
                layout: "video",
                autoplay: true,
                muted: true,
                parent: ["heyjeay.github.io"]
            });
        } else {
            console.log('No live stream available, showing YouTube video.');
            fallbackVideo.style.display = 'block';
        }
    });
}

// Run on page load
updateStreamDisplay();
