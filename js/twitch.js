const streamers = ['penta', 'shroud', 'dgthe99', 'teegrizzley', 'prawln', 'richopov'];

async function checkLiveStreamers() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a';
    const headers = { 
        'Client-ID': clientId, 
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        // Get stream info
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, { headers });
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // Get stream access token
            const tokenResponse = await fetch(`https://gql.twitch.tv/gql`, {
                method: 'POST',
                headers: {
                    'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `{
                        streamPlaybackAccessToken(channelName: "${data.data[0].user_login}", params: {platform: "web", playerType: "site"}) {
                            value
                            signature
                        }
                    }`
                })
            });
            const tokenData = await tokenResponse.json();
            
            // Get HLS URL
            const hlsUrl = `https://usher.ttvnw.net/api/channel/hls/${data.data[0].user_login}.m3u8?client_id=${clientId}&token=${tokenData.data.streamPlaybackAccessToken.value}&sig=${tokenData.data.streamPlaybackAccessToken.signature}`;
            return hlsUrl;
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
