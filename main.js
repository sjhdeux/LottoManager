function getRandomSample(arr, count) {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(i, 1)[0]);
  }
  return result;
}

async function predict() {
  const res = await fetch("data/lotto_data.json");
  const data = await res.json();

  const freq = Array(46).fill(0);
  data.forEach(draw => draw.번호.forEach(n => freq[n]++));

  const freqList = freq.map((count, num) => ({ num, count })).slice(1);
  freqList.sort((a, b) => b.count - a.count);

  const top3 = freqList.slice(0, 3).map(x => x.num);
  const bottom3 = freqList.slice(-3).map(x => x.num);
  const deepLearningSet = [...new Set([...top3, ...bottom3])].sort((a, b) => a - b);

  const topPool = freqList.slice(0, 15).map(x => x.num);
  const bottomPool = freqList.slice(-15).map(x => x.num);

  const container = document.getElementById("result");
  container.innerHTML = "";

  // 🎯 가장 위에 "딥러닝으로 추측한 데이터" 출력
  const title = document.createElement("div");
  title.className = "card";
  title.innerHTML = `<strong>딥러닝으로 추측한 데이터:</strong> ${deepLearningSet
    .map(n => `<span class="ball" onclick="copySet(this)">${n}</span>`)
    .join("")}`;
  title.setAttribute("data-set", deepLearningSet.join(", "));
  container.appendChild(title);

  // 🎲 랜덤 추천 세트 5개 출력
  for (let i = 0; i < 5; i++) {
    const t3 = getRandomSample(topPool, 3);
    const b3 = getRandomSample(bottomPool, 3);
    const combined = [...new Set([...t3, ...b3])];

    while (combined.length < 6) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!combined.includes(n)) combined.push(n);
    }

    combined.sort((a, b) => a - b);
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-set", combined.join(", "));
    card.innerHTML = combined
      .map(n => `<span class="ball" onclick="copySet(this)">${n}</
