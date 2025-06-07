async function predict() {
  const res = await fetch('data/lotto_data.json');
  const data = await res.json();

  // 전체 번호 빈도 계산
  const freq = Array(46).fill(0); // 1~45
  data.forEach(draw => {
    draw.번호.forEach(n => freq[n]++);
  });

  // 번호 + 출현수 객체로 변환
  const freqList = freq
    .map((count, num) => ({ num, count }))
    .slice(1); // 0번 제외

  freqList.sort((a, b) => b.count - a.count);

  const topPool = freqList.slice(0, 15).map(x => x.num);
  const bottomPool = freqList.slice(-15).map(x => x.num);

  const allRecommendations = [];

  for (let i = 0; i < 5; i++) {
    const top3 = getRandomSample(topPool, 3);
    const bottom3 = getRandomSample(bottomPool, 3);

    let combined = [...new Set([...top3, ...bottom3])];

    while (combined.length < 6) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!combined.includes(n)) combined.push(n);
    }

    combined.sort((a, b) => a - b);
    allRecommendations.push(combined);
  }

  // 화면 출력
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = allRecommendations
    .map((set, i) => `<div>세트 ${i + 1}: <span class="text-green-400">${set.join(', ')}</span></div>`)
    .join('');
}

function getRandomSample(arr, count) {
  const result = [];
  const copy = [...arr];
  while (result.length < count && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(i, 1)[0]);
  }
  return result;
}
