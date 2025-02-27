/* 
   Rotating Fade Marquee
*/

// Leave the next line as is (customization is further below):
var RM_content = new Array();

////////////////////////////////////////////////////////////
//
// Customization section.
//
// Three places to customize.
//
// Place One:
// Specify the content for each message, one per line, between 
//    quotation marks and parenthesis. Example (with ______ 
//    representing the content):
//       RM_content.push("______");
//    Content may contain HTML code (like links and CSS), even 
//    image tags.
// If the content itself contains quotation marks, precede 
//    each quotation mark with a backslash character. 
//    Example: He said, \"five!\"

RM_content.push("FiveM DDOS protection by Evolution-Host");
RM_content.push("“Hi my name is Cross and I like to shave my arms because it makes me run faster” - Cross");
RM_content.push("“Your black & decker pecker wrecker fucked my shit” - Mick");
RM_content.push("“Hes wheely Wheelying...” - Literally everyone on Tac 2");
RM_content.push("“Ahhhhhhhhh i want to cum in her nostrils” - Biggles");
RM_content.push("“It's like a 1,000 midgets had an orgy in my mouth” - Val");
RM_content.push("“Thats not my boyfriend, thats my sex toy” - Dude");
RM_content.push("“Still got my Cannedgina” - Opie");
RM_content.push("“Ive got drip...” - Josh");
RM_content.push("“Ive seen more drip on a nuns cunt” - FBI");
RM_content.push("“Yea youre lower than the jeans I wore in high school” - Kevara");
RM_content.push("“My dicks not 12 inches but it smells like a foot” - Weswey");
RM_content.push("“If she stops talking, she's either giving a blowjob or she's dead” - Conoli");
RM_content.push("“You're making me squirt ketchup all over” - Cherry");
RM_content.push("“I gotta fan out my beef curtains” - Aly");
RM_content.push("“AWW YEAH! I LOVED slipping my cherry cocks in people!” - Bella");
RM_content.push("“Micky mouse club house on top!” - Aiden");
// Specify the number of seconds to pause between displaying 
//    one marquee and the next. A decimal number is acceptable.

var RM_PauseBetweenEach = 2.5;


// Place Three:
// Transitions are from 100% opacity to 0%, then from 0% to 100%.
//
// Two transition preferences can be specified. The number of 
//    transition steps per fade and how fast the steps shall 
//    occur.
// For the steps, the larger the number, the smoother and slower 
//    the transition.
// For the speed, the lower the number the faster the transition.

var RM_TransitionSteps = 25; // Number of steps per fade.
var RM_TransitionSpeed = 50; // How fast the steps shall occur.


// End of customization section.
////////////////////////////////////////////////////////////
RM_TransitionSteps = parseInt((100 / RM_TransitionSteps) + .5);
var RMlastPointer = RM_content.length - 1;
var RMopacity = 100;
var RMpointer = 0;
var RMfader;
var RMdiv;
var RMie;

function RM_StartRotateMarquee() {
  RMdiv = document.getElementById("RM_FadeInOutContentDiv");
  RMie = (RMdiv.filters) ? true : false;
  RMdiv.innerHTML = RM_content[RMpointer];
  setTimeout("RM_NextContent()", parseInt(RM_PauseBetweenEach * 1000));
}

function RM_NewOpacity() {
  if (RMie) {
    RMdiv.filters.alpha.opacity = RMopacity;
  } else {
    RMdiv.style.opacity = RMopacity / 100;
  }
}

function RM_FadeOut() {
  RMopacity -= RM_TransitionSteps;
  if (RMopacity < 1) {
    RMopacity = 0;
  }
  RM_NewOpacity(RMopacity);
  if (RMopacity < 1) {
    clearInterval(RMfader);
    RM_SwitchContent();
  }
}

function RM_FadeIn() {
  RMopacity += RM_TransitionSteps;
  if (RMopacity > 99) {
    RMopacity = 100;
  }
  RM_NewOpacity(RMopacity);
  if (RMopacity > 99) {
    clearInterval(RMfader);
    setTimeout("RM_NextContent()", parseInt(RM_PauseBetweenEach * 1000));
  }
}

function RM_NextContent() {
  RMfader = setInterval("RM_FadeOut()", parseInt(RM_TransitionSpeed));
}

function RM_SwitchContent() {
  RMpointer++;
  if (RMpointer > RMlastPointer) {
    RMpointer = 0;
  }
  RMdiv.innerHTML = RM_content[RMpointer];
  RMfader = setInterval("RM_FadeIn()", parseInt(RM_TransitionSpeed));
}

function RM_AddOnloadEvent(f) {
  if (typeof window.onload != 'function') {
    window.onload = f;
  } else {
    var cache = window.onload;
    window.onload = function () {
      if (cache) {
        cache();
      }
      f();
    };
  }
}
RM_AddOnloadEvent(RM_StartRotateMarquee);

/* Mouse things */

const w = window.innerWidth;
const h = window.innerHeight;
const cx = w/2;
const cy = h/2;

const lerp = (a, b, p) => a + (b-a) * p;

const make_div = (x,y, idx, arr, container) => {
  const elm = document.createElement('div');
  elm.style.left = `${x}px`;
  elm.style.top = `${y}px`;
  elm.classList.add('ball');
  elm.style.zIndex = arr.length - idx;
  elm.style.setProperty(
    '--size', 
    `${lerp(1, 10, (arr.length - idx - 1) / (arr.length-1))}px`
  )
  container.append(elm)
  return elm;
}
const count = 1000;
const tension = 0.55;
const container = document.getElementById('balls');
const follow_chain = [...Array(count)].map(
  (_, idx, arr) => ({x:cx, y:cy, ball: make_div(cx, cy, idx, arr, container)})
)

const mouse = { x: cx, y: cy };

function animate() {
  requestAnimationFrame(animate) ;
  const offset = Date.now()/100 % 360;
  follow_chain.forEach((p,i) => {
    if (i > 0) {
      target = follow_chain[i-1]
      p.x = lerp(p.x, target.x, 1-0.001**tension);
      p.y = lerp(p.y, target.y, 1-0.001**tension);
    }
    else {
      p.x = mouse.x;
      p.y = mouse.y;
    }
    p.ball.style.left = `${p.x}px`;
    p.ball.style.top = `${p.y}px`;
    p.ball.style.background = `hsl(${
      [offset + lerp(0, 30, i / (follow_chain.length-1)),
      '100%', '50%'].join(',')
    })`;
  })
}
animate();

document.onmousemove = (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}

document.body.onmouseenter = (e) => {
  container.style.opacity = 1;
}
document.body.onmouseleave = (e) => {
  container.style.opacity = 0;
}

const streamers = [
  'penta',
  'shroud',
  'dgthe99'
];
  async function checkLiveStreamers() {
      const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
      const accessToken = 'g8h3swjn3jsz531hgvb6auian7ep4a';
    
      const headers = {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`
      };

      try {
          console.log('Checking for live streamers...');
          const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamers.join('&user_login=')}`, {
              headers: headers,
              method: 'GET'
          });
          const data = await response.json();
          console.log('Live Stream Check:', data);
          console.log('Live Streamers Found:', data.data);
        
          if (data.data && data.data.length > 0) {
              const liveStreamer = data.data[0].user_login;
              console.log('Selected streamer:', liveStreamer);
              return liveStreamer;
          }
          return null;
      } catch (error) {
          console.log('Error checking live streamers:', error);
          return null;
      }
  }
function updateStreamDisplay() {
    const container = document.getElementById('twitch-embed');
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
                parent: ["krploadingscreen.mooo.com"]
            });
        } else {
            fallbackVideo.style.display = 'block';
        }
    });
}
