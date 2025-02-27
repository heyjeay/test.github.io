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
        if (data.data && data.data.length > 0) {
            const streamData = await fetch(`https://api.twitch.tv/helix/videos?user_id=${data.data[0].user_id}`, { headers });
            const videoData = await streamData.json();
            return videoData.data[0].url;
        }
        return null;
    } catch (error) {
        return null;
    }
}

function updateStreamDisplay() {
    const twitchContainer = document.getElementById('twitch-embed');
    const fallbackVideo = document.getElementById('fallbackVideo');

    checkLiveStreamers().then(streamUrl => {
        if (streamUrl) {
            fallbackVideo.style.display = 'none';
            twitchContainer.style.display = 'block';
            twitchContainer.innerHTML = `
                <video id="twitch-video" width="100%" height="100%" autoplay controls>
                    <source src="${streamUrl}" type="application/x-mpegURL">
                </video>`;
        } else {
            twitchContainer.style.display = 'none';
            fallbackVideo.style.display = 'block';
        }
    });
}

updateStreamDisplay();
setInterval(updateStreamDisplay, 300000);
