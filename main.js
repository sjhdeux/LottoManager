async function predict() {
  const res = await fetch('data/lotto_data.json');
  const data = await res.json();

  // 전체 번호 빈도 계산
  const freq = Array(46).fill(0); // 1~45
  data.forEach(draw => {
    draw.번호.forEach(n => freq[n]++);
  });

  // 빈도순 정렬
  const freqList = freq
    .map((count, num) => ({ num, count }))
    .slice(1); // 0번 제외

  freqList.sort((a, b) => b.count - a.count);

  const topPool = freqList.slice(0, 15).map(x => x.num);
  const bottomPool = freqList.slice(-15).map(x => x.num);

  const top3 = getRandomSample(topPool, 3);
  const bottom3 = getRandomSample(bottomPool, 3);

  let combined = [...new Set([...top3, ...bottom3])];

  // 중복 제거로 6개 안 되면 랜덤 채우기
  while (combined.length < 6) {
    let n = Math.floor(Math.random() * 45) + 1;
    if (!combined.includes(n)) combined.push(n);
  }

  combined.sort((a, b) => a - b);
  document.getElementById('result').innerText = `추천 번호: ${combined.join(', ')}`;
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
