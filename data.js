// ─────────────────────────────────────────────
//  여기만 수정하면 사이트 내용이 바뀝니다.
//  프롬프트는 `백틱`으로 감싸면 줄바꿈이 그대로 유지돼요.
//  (프롬프트 안에 ` 기호가 들어가면 \` 로 써주세요)
//  이미지는 images 폴더에 올리고 "images/파일명.jpg" 로 적으면 됩니다.
// ─────────────────────────────────────────────
window.DATA = {
  SITE: {
    title: "ARCHIVE",
    subtitle: "Character Prompts",

    // 입장 화면 (영화 오프닝)
    introImage: "images/intro.png",
    introLines: [
      "당신이 내 죄라면, 나는 기꺼이 지옥에 갈 거야.",
      "당신이라는 죄를 온전히 내 것으로 만들기 위해서라면."
    ]
  },

  PAIRS: [
    {
      id: "pair-01",
      name: "A × B",
      subtitle: "한 줄 소개를 적어주세요",
      image: "images/pair-01.jpg",
      characters: [
        {
          name: "A",
          image: "images/pair-01-a.jpg",
          prompt: `여기에 A의 캐릭터 프롬프트를 붙여넣으세요.

이름:
나이:
성격:
말투:`
        },
        {
          name: "B",
          image: "images/pair-01-b.jpg",
          prompt: `여기에 B의 캐릭터 프롬프트를 붙여넣으세요.`
        }
      ]
    },
    {
      id: "pair-02",
      name: "C × D",
      subtitle: "두 번째 페어",
      image: "images/pair-02.jpg",
      characters: [
        { name: "C", image: "images/pair-02-c.jpg", prompt: `C의 프롬프트` },
        { name: "D", image: "images/pair-02-d.jpg", prompt: `D의 프롬프트` }
      ]
    }
  ]
};
