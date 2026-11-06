/* 다크 모드 (261106): 고른 값은 이 브라우저에만 저장, 안 고르면 기기 설정. head 에서 읽어 그리기 전에 적용, 단추(#themeBtn)는 문서가 준비되면 연결 */
(function(){
  var r=document.documentElement;
  try{var t=localStorage.getItem('mya-theme');if(t==='dark'||t==='light')r.setAttribute('data-theme',t)}catch(e){}
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('themeBtn'); if(!b) return;
    var mq=matchMedia('(prefers-color-scheme: dark)');
    function isDark(){var t=r.getAttribute('data-theme');return t?t==='dark':mq.matches}
    function sync(){var d=isDark();b.setAttribute('aria-pressed',d);b.setAttribute('aria-label',d?'다크 모드 끄기':'다크 모드 켜기')}
    b.addEventListener('click',function(){var t=isDark()?'light':'dark';r.setAttribute('data-theme',t);try{localStorage.setItem('mya-theme',t)}catch(e){}sync()});
    mq.addEventListener('change',sync); sync();
  });
})();
