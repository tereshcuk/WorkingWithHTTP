const createRequest = async (options = {}) => {
  const { method = "GET", url, body, headers = {} } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null; // Если сервер возвращает 204 (No Content)
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

export default createRequest;
