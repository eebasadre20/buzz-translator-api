# Buzz Translator API Benchmark

The Buzz Translator API Benchmark tool is designed to measure the performance of the Azure Translator API under load, by executing translation requests in parallel. This tool supports benchmarking translations from a single source language to one or more target languages, providing insights into response times and system throughput.

## Features

- **Parallel Translation Requests**: Executes multiple translation requests in parallel to benchmark performance.
- **Multiple Language Support**: Allows benchmarking translations to multiple languages simultaneously.
- **Performance Metrics**: Calculates and displays average response times and total processing times for each target language, as well as overall metrics across all languages.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- An Azure subscription and a Translator resource created on Azure to get the required `TRANSLATOR_TEXT_KEY`, `TRANSLATOR_TEXT_ENDPOINT`, and `TRANSLATOR_TEXT_LOCATION` values.
- `.env` file configured with your Azure Translator credentials.

### Installation

1. Clone this repository to your local machine.
   ```
   git clone https://github.com/your-repository/buzz-translator-api.git
   ```
2. Navigate to the project directory and run npm install to install dependencies.
  ```
  cd buzz-translator-api
  npm install
  ```
3. Ensure your .env file is set up at the root of the project with the following variables:
  ```
  TRANSLATOR_TEXT_KEY=your_translator_text_key_here
  TRANSLATOR_TEXT_ENDPOINT=your_translator_text_endpoint_here
  TRANSLATOR_TEXT_LOCATION=your_translator_resource_location_here
  ```

### Usage

1. Place the text files you want to translate in the data directory.
2. Run the benchmark using the following command:
  ```
  node index.js
  ```
  OR for multiple languages:
  ```
  node multi-translations.js
  ```
3. Observe the output in your terminal for performance metrics.

### Scripts Description

- index.js: Entry point for running benchmark tests for translations to specified languages.
- multi-translations.js: Similar to index.js but optimized for handling multiple target languages simultaneously.
- worker.js: Worker script that performs the actual API request in a separate thread to facilitate parallel processing.

### Contributing
Contributions are welcome! Please feel free to submit a pull request with any enhancements, bug fixes, or suggestions to improve the benchmarking tool.

### License
This project is open-sourced under the MIT License. See the LICENSE file for more details.



