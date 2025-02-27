const streamers = ['penta', 'shroud', 'dgthe99', 'teegrizzley', 'prawln', 'richopov'];

async function checkLiveStreamers() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a';
    const headers = { 
        'Client-ID': clientId, 
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { 
            headers,
            cache: 'no-store'
        });
        const data = await response.json();
        return (data.data && data.data.length > 0) ? data.data[0].user_login : null;
    } catch (error) {
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
            twitchContainer.innerHTML = `
                <iframe
                    src="https://player.twitch.tv/?channel=${liveStreamer}&parent=heyjeay.github.io&muted=true"
                    height="100%"
                    width="100%"
                    allowfullscreen>
                </iframe>`;
        } else {
            twitchContainer.style.display = 'none';
            fallbackVideo.style.display = 'block';
        }
    });
}

updateStreamDisplay();
setInterval(updateStreamDisplay, 300000);
