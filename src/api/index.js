import md5 from 'md5';

const date = new Date();
const formatedDate = date
  .toLocaleString('ru', {
    year: 'numeric',
    day: 'numeric',
    month: 'numeric',
    timeZone: 'UTC',
  })
  .split('.')
  .reverse()
  .join('');

const baseUrl = 'https://api.valantis.store:41000';
const method = 'POST';
const headers = {
  'content-type': 'application/json',
  'X-Auth': md5(`Valantis_${formatedDate}`),
};

export const api = async (action, params = {}, retryCount = 5, timemout = 5000) => {
  const res = await fetch(baseUrl, {
    method,
    headers,
    body: JSON.stringify({
      action,
      params,
    }),
  });

  try {
    if (!res.ok) {
      const message = `Ошибка запроса. Попыток соединения: ${retryCount}. Перезагрузите страницу и попробуйте снова.`;
      throw new Error(message);
    }

    const data = await res.json();
    return data.result;
  } catch (error) {
    if (retryCount > 0) {
      console.log(`Статус ошибки ${res.status}. Повторный запрос.`);
      await new Promise((resolve) => setTimeout(resolve, timemout));
      return api(action, params, retryCount - 1);
    } else {
      throw error;
    }
  }
};
