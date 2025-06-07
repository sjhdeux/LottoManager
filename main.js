async function predict() {
  const res = await fetch('data/lotto_data.json');
  const data = await res.json();

  const freq = Array(46).fill(0);
  data.forEach(draw => draw.번호.forEach(n => freq[n]++));

  const freqList = freq.map((count, num) => ({ num, count })).slice(1);
  freqList.sort((a, b) => b.count - a.count);

  const topPool = freqList.slice(0, 15).map(x => x.num);
  const bottomPool = freqList.slice(-15).map(x => x.num);

  const container = document.getElementById('result');
  container.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const top3 = getRandomSample(topPool, 3);
    const bottom3 = getRandomSample(bottomPool, 3);
    const combined = [...new Set([...top3, ...bottom3])];

    while (combined.length < 6) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!combined.includes(n)) combined.push(n);
    }

    combined.sort((a, b) => a - b);

    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-set', combined.join(', '));
    container.appendChild(card);

    // 🎯 0.4초씩 딜레이하며 하나씩 추가
    combined.forEach((n, idx) => {
      setTimeout(() => {
        const ball = document.createElement('span');
        ball.className = 'ball animate-fade-in';
        ball.textContent = n;
        ball.onclick = () => copySet(ball);
        card.appendChild(ball);
      }, idx * 400); // 0.4초씩 증가
    });
  }
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

// 📋 전체 세트 복사
function copySet(el) {
  const set = el.closest('div[data-set]').getAttribute('data-set');
  navigator.clipboard.writeText(set).then(() => {
    alert(`복사됨: ${set}`);
  });
}
