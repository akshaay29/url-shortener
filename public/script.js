async function fetchList() {
  const res = await fetch('/api/list');
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  for (const code in data) {
    const entry = data[code];
    const a = document.createElement('a');
    a.href = `/${code}`;
    a.textContent = a.href;
    a.target = '_blank';
    const p = document.createElement('p');
    p.textContent = `${entry.original} → `;
    p.appendChild(a);
    list.appendChild(p);
  }
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  const result = document.getElementById('result');
  if (data.error) {
    result.textContent = 'Error: ' + data.error;
  } else {
    result.innerHTML = `Short URL: <a href="${data.short}" target="_blank">${data.short}</a>`;
    fetchList();
  }
});

fetchList();
