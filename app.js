(() => {
  const { SITE, CHARACTERS: CHARS } = window.DATA;
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

  /* ───────── 캐릭터 목록 (세로) ───────── */
  let viaClick = false; // 카드를 눌러서 연 상태인지 (닫을 때 뒤로가기로 처리)

  function renderList() {
    app.replaceChildren();
    const head = el("div", "head");
    head.append(el("h1", null, SITE.title), el("p", null, SITE.subtitle));
    const list = el("div", "list");

    CHARS.forEach((c, i) => {
      const a = el("a", "card");
      a.href = `#/${encodeURIComponent(c.id)}`;
      a.addEventListener("click", () => { viaClick = true; });
      const info = el("div", "info");
      info.append(
        el("span", "no", String(i + 1).padStart(2, "0")),
        el("span", "nm", c.name),
        el("span", "sb", c.subtitle || ""),
        el("span", "arrow", "STATUS →")
      );
      a.append(photo(c.image, c.name), info);
      list.appendChild(a);
    });

    if (!CHARS.length) list.appendChild(el("div", "empty", "아직 등록된 캐릭터가 없어요."));
    app.append(head, list);
  }

  /* ───────── 상태창 ───────── */
  const panel = el("div", "panel");
  const dialog = el("div", "dialog");
  const closeBtn = el("button", "close", "×");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "닫기");
  const content = el("div", "content");
  dialog.append(closeBtn, content);
  panel.appendChild(dialog);
  document.body.appendChild(panel);

  function closeFromUI() {
    if (viaClick) {
      viaClick = false;
      history.back();                    // 열 때 쌓인 기록을 되돌려요
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      route();
    }
  }
  closeBtn.addEventListener("click", closeFromUI);
  panel.addEventListener("click", (e) => { if (e.target === panel) closeFromUI(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeFromUI();
  });

  function fillPanel(c) {
    const pic = photo(c.image, c.name);
    pic.classList.add("pic");

    const side = el("div", "side");
    side.append(el("div", "tag", "STATUS"), el("h2", "nm", c.name));
    if (c.subtitle) side.appendChild(el("p", "sb", c.subtitle));

    if (c.info && c.info.length) {
      const dl = el("dl", "stats");
      c.info.forEach(([k, v]) => {
        const row = el("div", "row");
        row.append(el("dt", null, k), el("dd", null, v));
        dl.appendChild(row);
      });
      side.appendChild(dl);
    }
    if (c.intro) side.appendChild(el("p", "intro", c.intro));

    const btn = el("button", "copybtn", "프롬프트 복사");
    btn.type = "button";
    let t;
    btn.addEventListener("click", async () => {
      await copy(c.prompt, c.name);
      btn.textContent = "복사됨 ✓";
      btn.classList.add("done");
      clearTimeout(t);
      t = setTimeout(() => {
        btn.textContent = "프롬프트 복사";
        btn.classList.remove("done");
      }, 1600);
    });
    side.appendChild(btn);

    content.replaceChildren(pic, side);
  }

  function openPanel(c) {
    fillPanel(c);
    dialog.scrollTop = 0;
    panel.classList.add("open");
    document.body.classList.add("modal-open");
  }
  function hidePanel() {
    panel.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function route() {
    const m = location.hash.match(/^#\/(.+)$/);
    const c = m && CHARS.find((x) => x.id === decodeURIComponent(m[1]));
    c ? openPanel(c) : hidePanel();
  }

  window.addEventListener("hashchange", route);
  renderList();
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
