const { workerData, parentPort } = require("worker_threads");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

async function makeRequest() {
  const { endpoint, key, location, text, fromLang, toLang } = workerData;
  try {
    const startTime = new Date().getTime();
    const response = await axios({
      baseURL: endpoint,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: fromLang,
        to: toLang,
      },
      data: [{ text }],
      responseType: "json",
    });
    const endTime = new Date().getTime();
    // console.log(JSON.stringify(response.data, null, 4));
    parentPort.postMessage({
      responseTime: endTime - startTime,
      data: response.data,
    });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

makeRequest();
