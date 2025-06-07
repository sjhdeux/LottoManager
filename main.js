async function predict() {
  const res = await fetch('predicted.json');
  const data = await res.json();
  document.getElementById('result').innerText = `추천 번호: ${data.추천번호.join(', ')}`;
}
