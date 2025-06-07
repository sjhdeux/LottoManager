async function predict() {
  const res = await fetch('data/lotto_data.json');
  const data = await res.json();

  const freq = Array(46).fill(0); // 1~45
  data.forEach(draw => draw.번호.forEach(n => freq[n]++));

  const freqList = freq
    .map((count, num) => ({ num, count }))
    .slice(1)
    .sort((a, b) => b.count - a.count);

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

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // 초기화

  allRecommendations.forEach((set, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-center animate-fade-in';
    card.style.animationDelay = `${idx * 100}ms`;

    const ballsHTML = set.map(num => `
      <span class="inline-flex items-center justify-center w-10 h-10 bg-yellow-300 text-black rounded-full mx-1 text-lg font-bold cursor-pointer hover:scale-110 transition" onclick="copyNumber(${num})">
        ${num}
      </span>
    `).join('');

    card.innerHTML = `<div>${ballsHTML}</div>`;
    resultDiv.appendChild(card);
  });
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

// 📋 번호 복사 기능
function copyNumber(num) {
  navigator.clipboard.writeText(num.toString()).then(() => {
    alert(`번호 ${num} 복사됨!`);
  });
}
