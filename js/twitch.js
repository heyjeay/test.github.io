const streamers = ['penta', 'shroud', 'dgthe99', 'teegrizzley', 'prawln', 'richopov'];

async function checkLiveStreamers() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a';
    const headers = { 
        'Client-ID': clientId, 
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        // First get the stream info
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { headers });
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // Get the access token for this stream
            const tokenResponse = await fetch(`https://api.twitch.tv/helix/channels/access_token?channel_name=${data.data[0].user_login}`, { headers });
            const tokenData = await tokenResponse.json();
            
            // Get the m3u8 URL
            const m3u8Response = await fetch(`https://usher.ttvnw.net/api/channel/hls/${data.data[0].user_login}.m3u8?client_id=${clientId}&token=${tokenData.token}&sig=${tokenData.sig}`);
            return m3u8Response.url;
        }
        return null;
    } catch (error) {
        console.log('Stream fetch error:', error);
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
            
            const video = document.getElementById('twitch-video');
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.play();
                });
            }
        } else {
            twitchContainer.style.display = 'none';
            fallbackVideo.style.display = 'block';
        }
    });
}

updateStreamDisplay();
setInterval(updateStreamDisplay, 300000);
