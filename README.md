# ARCHIVE — 캐릭터 프롬프트 보관함

파일 구성

- `index.html` 뼈대
- `style.css` 디자인 (색은 맨 위 `:root`에서 바꿔요)
- `app.js` 동작 (건드릴 일 없음)
- `data.js` **내용 전부** — 페어, 캐릭터, 프롬프트, 입장 대사
- `images/` 사진 넣는 폴더 (직접 만들어서 올려주세요)

## 올리는 법 (GitHub Pages)

1. GitHub에서 새 저장소(repository) 만들기 — 공개(Public)로
2. 이 폴더의 파일들을 전부 업로드 (`Add file → Upload files`)
3. `images` 폴더도 만들어서 사진 업로드
4. 저장소 `Settings → Pages` → Branch를 `main`, 폴더는 `/ (root)` → Save
5. 1~2분 뒤 `https://내아이디.github.io/저장소이름/` 로 접속

## 페어 추가하는 법

GitHub에서 `data.js`를 열고 연필 아이콘(Edit)을 눌러서 `PAIRS` 안에 아래 덩어리를 복사해 붙이면 끝이에요.

```js
{
  id: "pair-03",            // 겹치지 않는 영어/숫자
  name: "E × F",
  subtitle: "한 줄 소개",
  image: "images/pair-03.jpg",
  characters: [
    { name: "E", image: "images/pair-03-e.jpg", prompt: `프롬프트` },
    { name: "F", image: "images/pair-03-f.jpg", prompt: `프롬프트` }
  ]
},
```

## 참고

- 수정은 저장소 주인(본인 계정)만 할 수 있어요. 방문자는 보고 복사만 가능해요.
- 공개 저장소라서 프롬프트는 링크를 아는 사람이 저장소 코드에서도 볼 수 있어요.
- 입장 화면은 브라우저를 켠 뒤 처음 한 번만 나와요. 다시 보려면 새 탭/시크릿 창으로 열면 돼요.
- 사진이 없어도 금색 이니셜 칸으로 대신 보여서 먼저 써보셔도 괜찮아요.
