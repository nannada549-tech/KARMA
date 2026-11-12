(() => {
  const { SITE, PAIRS } = window.DATA;
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  document.title = SITE.title;

  /* ───────── 작은 도우미 ───────── */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // 이미지 박스: 파일이 없으면 이니셜이 있는 금빛 자리표시가 보여요
  function photo(src, label) {
    const box = el("div", "ph");
    box.dataset.label = (label || "").trim().charAt(0).toUpperCase();
    if (src) {
      const img = new Image();
      img.alt = label || "";
      img.loading = "lazy";
      img.onerror = () => img.remove();
      img.src = src;
      box.appendChild(img);
    }
    return box;
  }

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  async function copy(text, name) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast(`${name} 프롬프트를 복사했어요`);
  }

  /* ───────── 화면 그리기 ───────── */
  function renderList() {
    app.replaceChildren();
    const head = el("div", "head");
    head.append(el("h1", null, SITE.title), el("p", null, SITE.subtitle));
    const list = el("div", "list");

    PAIRS.forEach((p, i) => {
      const a = el("a", "pair");
      a.href = `#/pair/${p.id}`;
      const info = el("div", "info");
      info.append(
        el("span", "no", String(i + 1).padStart(2, "0")),
        el("span", "nm", p.name),
        el("span", "sb", p.subtitle || ""),
        el("span", "arrow", "OPEN →")
      );
      a.append(photo(p.image, p.name), info);
      list.appendChild(a);
    });

    if (!PAIRS.length) list.appendChild(el("div", "empty", "아직 등록된 페어가 없어요."));
    app.append(head, list);
    window.scrollTo(0, 0);
  }

  function renderPair(id) {
    const p = PAIRS.find((x) => x.id === id);
    if (!p) { location.hash = "#/"; return; }
    app.replaceChildren();

    const back = el("a", "back", "← Back");
    back.href = "#/";
    const head = el("div", "head");
    head.append(el("h1", null, p.name), el("p", null, p.subtitle || ""));
    const grid = el("div", "chars");

    p.characters.forEach((c) => {
      const card = el("div", "char");
      const body = el("div", "body");
      body.append(el("div", "nm", c.name), el("div", "pv", c.prompt), el("div", "copy", "Click to copy"));
      card.append(photo(c.image, c.name), body);
      card.addEventListener("click", () => copy(c.prompt, c.name));
      grid.appendChild(card);
    });

    app.append(back, head, grid);
    window.scrollTo(0, 0);
  }

  function route() {
    const m = location.hash.match(/^#\/pair\/(.+)$/);
    m ? renderPair(decodeURIComponent(m[1])) : renderList();
  }
  window.addEventListener("hashchange", route);
  route();

  /* ───────── 입장 화면 ───────── */
  const intro = document.getElementById("intro");
  const wipe = document.getElementById("wipe");
  const sub = document.getElementById("subtitle");
  let entered = false;

  function finishInstantly() {
    intro.remove();
    wipe.remove();
    document.body.classList.remove("locked");
  }

  async function enter() {
    if (entered) return;
    entered = true;
    try { sessionStorage.setItem("seen", "1"); } catch (_) {}
    wipe.classList.add("in");            // 왼쪽 → 오른쪽으로 검게 덮임
    await sleep(900);
    intro.remove();
    document.body.classList.remove("locked");
    wipe.style.transformOrigin = "right"; // 같은 방향으로 걷히며 사이트 등장
    wipe.classList.remove("in");
    await sleep(900);
    wipe.remove();
  }

  // 줄 단위로 한 글자씩 출력
  async function typeLine(text) {
    sub.textContent = "";
    sub.classList.add("show");
    for (const ch of text) {
      if (entered) return;
      sub.textContent += ch;
      await sleep(55);
    }
    await sleep(1800);                   // 다 쓰고 나서 읽을 시간
    sub.classList.remove("show");
    await sleep(700);
  }

  async function playIntro() {
    const seen = (() => { try { return sessionStorage.getItem("seen"); } catch (_) { return null; } })();
    if (seen) return finishInstantly();

    intro.querySelector(".stage").replaceChildren(photo(SITE.introImage, SITE.title));
    intro.querySelector(".stage .ph").id = "introImg";
    intro.addEventListener("click", enter);

    await sleep(300);
    intro.classList.add("open");         // 위아래 검은 띠가 열리며 시네마 비율로
    await sleep(2000);

    for (const line of SITE.introLines) {
      if (entered) return;
      await typeLine(line);
    }
    await sleep(600);
    enter();                             // 대사가 끝나면 자동 입장
  }

  playIntro();
})();
