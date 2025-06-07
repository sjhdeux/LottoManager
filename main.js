async function predict() {
  const res = await fetch('data/lotto_data.json');
  const data = await res.json();

  const freq = Array(46).fill(0); // 1~45
  data.forEach(draw => {
    draw.번호.forEach(n => freq[n]++);
  });

  const top = freq
    .map((count, number) => ({ number, count }))
    .slice(1) // 0번 제외
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(x => x.number);

  document.getElementById('result').innerText = `추천 번호: ${top.join(', ')}`;
}
