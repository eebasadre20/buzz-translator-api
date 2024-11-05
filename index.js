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

  for (const lang of toLangs) {
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
  }
}

benchmarkAPI(100, "1500_bl.txt", "en", ["es", "vi"]);
