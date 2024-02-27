import md5 from 'md5';

const date = new Date();
const formatedDate = date
  .toLocaleString('ru', {
    year: 'numeric',
    day: 'numeric',
    month: 'numeric',
  })
  .split('.')
  .reverse()
  .join('');

const baseUrl = 'http://api.valantis.store:40000';
const method = 'POST';
const headers = {
  'content-type': 'application/json',
  'X-Auth': md5(`Valantis_${formatedDate}`),
};

export const api = async (action, params) => {
  const res = await fetch(baseUrl, {
    method,
    headers,
    body: JSON.stringify({
      action,
      params,
    }),
  });

  if (!res.ok) {
    setTimeout(() => {
      api(action, params);
    }, 5000);
  }

  const data = await res.json();
  return data;
};
