/* 
   Rotating Fade Marquee
*/

var RM_content = [];

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

var RM_PauseBetweenEach = 2.5;
var RM_TransitionSteps = 25;
var RM_TransitionSpeed = 50;

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
  setTimeout(RM_NextContent, parseInt(RM_PauseBetweenEach * 1000));
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
  if (RMopacity < 1) RMopacity = 0;
  RM_NewOpacity();
  if (RMopacity < 1) {
    clearInterval(RMfader);
    RM_SwitchContent();
  }
}

function RM_FadeIn() {
  RMopacity += RM_TransitionSteps;
  if (RMopacity > 99) RMopacity = 100;
  RM_NewOpacity();
  if (RMopacity > 99) {
    clearInterval(RMfader);
    setTimeout(RM_NextContent, parseInt(RM_PauseBetweenEach * 1000));
  }
}

function RM_NextContent() {
  RMfader = setInterval(RM_FadeOut, parseInt(RM_TransitionSpeed));
}

function RM_SwitchContent() {
  RMpointer++;
  if (RMpointer > RMlastPointer) RMpointer = 0;
  RMdiv.innerHTML = RM_content[RMpointer];
  RMfader = setInterval(RM_FadeIn, parseInt(RM_TransitionSpeed));
}

function RM_AddOnloadEvent(f) {
  if (typeof window.onload !== 'function') {
    window.onload = f;
  } else {
    var cache = window.onload;
    window.onload = function () {
      if (cache) cache();
      f();
    };
  }
}
RM_AddOnloadEvent(RM_StartRotateMarquee);

/* Mouse Effects */
const w = window.innerWidth;
const h = window.innerHeight;
const cx = w / 2;
const cy = h / 2;
const lerp = (a, b, p) => a + (b - a) * p;
const container = document.getElementById('balls');

const follow_chain = [...Array(1000)].map((_, idx, arr) => {
  const elm = document.createElement('div');
  elm.style.left = `${cx}px`;
  elm.style.top = `${cy}px`;
  elm.classList.add('ball');
  elm.style.zIndex = arr.length - idx;
  elm.style.setProperty('--size', `${lerp(1, 10, (arr.length - idx - 1) / (arr.length - 1))}px`);
  container.append(elm);
  return { x: cx, y: cy, ball: elm };
});

const mouse = { x: cx, y: cy };

function animate() {
  requestAnimationFrame(animate);
  follow_chain.forEach((p, i) => {
    if (i > 0) {
      let target = follow_chain[i - 1];
      p.x = lerp(p.x, target.x, 1 - 0.001 ** 0.55);
      p.y = lerp(p.y, target.y, 1 - 0.001 ** 0.55);
    } else {
      p.x = mouse.x;
      p.y = mouse.y;
    }
    p.ball.style.left = `${p.x}px`;
    p.ball.style.top = `${p.y}px`;
  });
}
animate();

document.onmousemove = (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
};
