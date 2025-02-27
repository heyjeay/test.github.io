const streamers = ['penta', 'shroud', 'dgthe99', 'teegrizzley', 'prawln', 'richopov'];

async function checkLiveStreamers() {
    const clientId = 'YOUR_CLIENT_ID';
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const headers = { 
        'Client-ID': clientId, 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { headers });
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0].user_login;
        }
        return null;
    } catch (error) {
        console.log('Switching to fallback video');
        return null;
    }
}

function updateStreamDisplay() {
    const twitchContainer = document.getElementById('twitch-embed');
    const fallbackVideo = document.getElementById('fallbackVideo');

    checkLiveStreamers().then(liveStreamer => {
        if (liveStreamer) {
            fallbackVideo.style.display = 'none';
            twitchContainer.style.display = 'block';
            twitchContainer.innerHTML = '';
            
            new Twitch.Embed("twitch-embed", {
                width: "100%",
                height: "100%",
                channel: liveStreamer,
                layout: "video",
                autoplay: true,
                muted: false,
                parent: ["heyjeay.github.io"]
            });
        } else {
            twitchContainer.style.display = 'none';
            fallbackVideo.style.display = 'block';
            fallbackVideo.style.zIndex = '1';
            fallbackVideo.style.opacity = '1';
        }
    });
}

// Initial load
updateStreamDisplay();

// Check every 5 minutes for new streams
setInterval(updateStreamDisplay, 300000);
