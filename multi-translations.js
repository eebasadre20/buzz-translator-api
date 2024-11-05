require("dotenv").config();

const { Worker } = require("worker_threads");
const path = require("path");
const fs = require("fs").promises;

const key = process.env.TRANSLATOR_TEXT_KEY;
const endpoint = process.env.TRANSLATOR_TEXT_ENDPOINT;
const location = process.env.TRANSLATOR_TEXT_LOCATION;

async function readFileContent(filename) {
  try {
    return await fs.readFile(`data/${filename}`, "utf8");
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

function makeRequestInWorker(data) {
  return new Promise((resolve, reject) => {
    const workerFilePath = path.join(__dirname, "worker.js");
    const worker = new Worker(workerFilePath, { workerData: data });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function benchmarkAPI(requestCount, filename, fromLang, toLangs) {
  const text = await readFileContent(filename);
  if (!text) {
    console.log("Failed to load text for translation.");
    return;
  }

  console.log(
    `\n| Filename | Language | Request Number | Average Response Time (ms) |\n|----------|----------------|-----------------------------|`
  );

  let totalRequests = 0;
  let totalResponseTime = 0;

  const languagePromises = toLangs.map(async (lang) => {
    const promises = [];
    for (let i = 0; i < requestCount; i++) {
      promises.push(
        makeRequestInWorker({
          endpoint,
          key,
          location,
          text,
          fromLang,
          toLang: lang,
        })
      );
    }

    const startBenchmark = new Date().getTime();
    const responseTimes = await Promise.all(promises);
    const endBenchmark = new Date().getTime();
    const totalTime = responseTimes.reduce(
      (acc, cur) => acc + cur.responseTime,
      0
    );
    const averageTime = totalTime / requestCount;
    console.log(
      `| ${filename} |  ${lang}  | ${requestCount} | ${averageTime.toFixed(
        2
      )} |`
    );

    const totalBenchmarkTime = endBenchmark - startBenchmark;
    console.log(
      `Total time for ${requestCount} of ${lang} parallel requests: ${totalBenchmarkTime} ms`
    );

    console.log(responseTimes);

    totalRequests += requestCount;
    totalResponseTime += totalTime;
  });

  await Promise.all(languagePromises);

  const overallAverageTime = totalResponseTime / totalRequests;
  console.log(`\nTotal parallel requests to all languages: ${totalRequests}`);
  console.log(
    `Overall average response time across all languages: ${overallAverageTime.toFixed(
      2
    )} ms`
  );
}

benchmarkAPI(50, "1500_bl.txt", "en", ["es", "vi"]);
