/* 먀 스튜디오 — FX 레이어 (리퀴드 크롬). fx.css와 짝. */
(function(){
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.classList.add('fx');
  if (!reduce) root.classList.add('fx-anim');

  /* ---------- 히어로: 흐르는 액체 크롬 (WebGL) ---------- */
  var hero = document.querySelector('.fx-hero');
  var cv = hero && hero.querySelector('.fx-canvas');
  if (cv) (function(){
    var gl = cv.getContext('webgl', { antialias:false, alpha:false, powerPreference:'low-power' });
    if (!gl) return; // CSS 정지 배경이 대신 보여요
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'uniform vec2 r;uniform float t;uniform vec2 m;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/r;',
      ' vec2 p=(gl_FragCoord.xy-.5*r)/r.y*1.5;',
      ' p+=(m-.5)*vec2(.35,-.35);',
      ' float tt=t*.07;',
      ' vec2 q=vec2(fbm(p+tt),fbm(p-tt+3.1));',
      ' vec2 w=vec2(fbm(p+2.2*q+vec2(1.7,9.2)+tt*1.4),fbm(p+2.2*q+vec2(8.3,2.8)-tt));',
      ' float f=fbm(p+2.6*w);',
      ' float band=sin(f*10.+w.x*5.-t*.25)*.5+.5;',
      ' band=pow(band,2.4);',
      ' float spec=pow(max(0.,sin(f*16.+w.y*3.-t*.4)),22.);',
      ' vec3 dark=vec3(.03,.03,.035), mid=vec3(.38,.41,.45), hi=vec3(.86,.88,.91);',
      ' vec3 c=mix(dark,mid,smoothstep(.1,.6,band));',
      ' c=mix(c,hi,smoothstep(.6,1.,band));',
      ' c+=spec*vec3(1.,1.,1.02);',
      ' c*=1.-.45*length(uv-vec2(.65,.5));',
      ' gl_FragColor=vec4(c,1.);',
      '}'
    ].join('\n');
    function sh(type, src){ var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't'), uM = gl.getUniformLocation(pr, 'm');
    var mx = .5, my = .5, tx = .5, ty = .5, visible = true, raf = 0, t0 = performance.now();

    function size(){
      var scale = Math.min(window.devicePixelRatio || 1, 2) * .5; // 절반 해상도로 가볍게
      var w = Math.max(1, Math.round(cv.clientWidth * scale)), h = Math.max(1, Math.round(cv.clientHeight * scale));
      if (cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(uR, w, h);
    }
    function draw(now){
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      gl.uniform1f(uT, reduce ? 12 : (now - t0) / 1000 + 12);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function loop(now){ raf = 0; if (!visible || document.hidden) return; draw(now); raf = requestAnimationFrame(loop); }
    function kick(){ if (!raf && !reduce) raf = requestAnimationFrame(loop); }
    size(); draw(performance.now());
    window.addEventListener('resize', function(){ size(); if (reduce) draw(performance.now()); });
    hero.addEventListener('pointermove', function(e){ var b = hero.getBoundingClientRect(); tx = (e.clientX - b.left) / b.width; ty = (e.clientY - b.top) / b.height; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) kick(); }).observe(hero);
    document.addEventListener('visibilitychange', kick);
    kick();
  })();

  /* ---------- 헤더: 히어로 위에 있을 때 어둡게 ---------- */
  var nav = document.querySelector('.nav');
  if (nav && hero){
    var setNav = function(){ nav.classList.toggle('fx-dark', hero.getBoundingClientRect().bottom > nav.offsetHeight); };
    window.addEventListener('scroll', setNav, { passive:true }); setNav();
  }

  /* ---------- 스크롤 진행 바 ---------- */
  var bar = document.createElement('div'); bar.className = 'fx-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  function prog(){ var d = document.documentElement, m = d.scrollHeight - d.clientHeight; bar.style.transform = 'scaleX(' + (m > 0 ? d.scrollTop / m : 0) + ')'; }
  window.addEventListener('scroll', prog, { passive:true }); prog();

  if (reduce) { countUpImmediate(); return; }

  /* ---------- 자석 버튼 ---------- */
  if (fine) document.querySelectorAll('.hero-btns .btn, .go-row .btn, .nav .btn').forEach(function(b){
    b.classList.add('fx-mag');
    b.addEventListener('pointermove', function(e){ var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .35 + 'px)'; });
    b.addEventListener('pointerleave', function(){ b.style.transform = ''; });
  });

  /* ---------- 틸트: 히어로 카드 ---------- */
  var scr = hero && hero.querySelector('.screen');
  if (scr && fine){
    hero.addEventListener('pointermove', function(e){ var r = scr.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      scr.classList.add('tilting'); scr.style.transform = 'rotateY(' + x * 10 + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(0)'; });
    hero.addEventListener('pointerleave', function(){ scr.classList.remove('tilting'); scr.style.transform = ''; });
  }

  /* ---------- 틸트 + 광택: 서비스 이미지 ---------- */
  document.querySelectorAll('.sr-vis').forEach(function(fig){
    var img = fig.querySelector('img'); if (!img) return;
    var wrap = document.createElement('div'); wrap.className = 'fx-tilt'; img.parentNode.insertBefore(wrap, img); wrap.appendChild(img);
    if (!fine) return;
    wrap.addEventListener('pointermove', function(e){ var r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      wrap.style.setProperty('--mx', x * 100 + '%'); wrap.style.setProperty('--my', y * 100 + '%');
      wrap.style.transform = 'rotateY(' + (x - .5) * 9 + 'deg) rotateX(' + (.5 - y) * 7 + 'deg)'; });
    wrap.addEventListener('pointerleave', function(){ wrap.style.transform = ''; });
  });

  /* ---------- 작업 이력 스포트라이트 ---------- */
  var stage = document.querySelector('.stagehero');
  if (stage && fine) stage.addEventListener('pointermove', function(e){ var r = stage.getBoundingClientRect();
    stage.style.setProperty('--sx', e.clientX - r.left + 'px'); stage.style.setProperty('--sy', e.clientY - r.top + 'px'); });

  /* ---------- 숫자 카운트업 (보이는 값이 최종값, 화면에 들어올 때만 굴림) ---------- */
  var nf = new Intl.NumberFormat('ko-KR');
  var nums = [].slice.call(document.querySelectorAll('.sr-nums b')).filter(function(b){
    var m = b.textContent.trim().match(/^(약\s)?([\d,]+)$/); if (!m) return false;
    var v = +m[2].replace(/,/g, ''); if (!m[2].includes(',') && v >= 1900 && v <= 2100) return false; // 연도는 제외
    b.dataset.pre = m[1] || ''; b.dataset.to = v; return true;
  });
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (!e.isIntersecting) return; io.unobserve(e.target);
      var b = e.target, to = +b.dataset.to, pre = b.dataset.pre, s = performance.now(), d = 1400;
      (function step(now){ var k = Math.min(1, (now - s) / d), v = Math.round(to * (1 - Math.pow(1 - k, 4)));
        b.textContent = pre + nf.format(v); if (k < 1) requestAnimationFrame(step); })(s);
    }); }, { threshold:.6 });
    nums.forEach(function(b){ io.observe(b); });
  }
  function countUpImmediate(){}
})();
