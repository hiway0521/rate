const el = (tag, attrs, content) => `<${tag} ${attrs.join(" ")}>${content}</${tag}>`;

const config = {
  title: "菲律宾比索实时汇率查询",
  subtitle: "Philippine Peso Exchange Rate",
  logo_icon: "money bill alternate outline",
  currencies: [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
    { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" }
  ],
  banks: [
    { name: "MetroBank", url: "https://www.metrobank.com.ph/articles/forex" },
    { name: "Bank of China", url: "https://www.bankofchina.com.ph/en-ph/service/information/exchange-rates1.html" }
  ],
  color: "#C0C0C0" // 新增背景颜色配置
};

async function fetchExchangeRates() {
  
  const metrobankRates = await fetchMetrobankRates();
  const bankOfChinaRates = await fetchBankOfChinaRates();

  return {
    metrobank: metrobankRates,
    bankOfChina: bankOfChinaRates
  };
}

async function getVisaRate() {
  try {
    
    const now = new Date();

              // 计算UTC+8时间
              const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);

              // 使用 `toLocaleDateString` 和 `toLocaleTimeString` 获取日期和时间
              const currentDate = utc8Time.toLocaleDateString('zh-CN');
              const currentTime = utc8Time.toLocaleTimeString('zh-CN', { hour12: false });

              let year = utc8Time.getUTCFullYear();
              let month = utc8Time.getUTCMonth() + 1; 
              let formattedMonth = month < 10 ? '0' + month : month.toString();
              let day = utc8Time.getUTCDate();
              let hours = utc8Time.getUTCHours();
              let minutes = utc8Time.getUTCMinutes();
              let seconds = utc8Time.getUTCSeconds();


    const formattedDate = `${formattedMonth}/${day}/${year}`;
    const response = await fetch(`https://www.visa.com.hk/cmsapi/fx/rates?amount=1&fee=1.5&utcConvertedDate=${formattedDate}&exchangedate=${formattedDate}&fromCurr=CNY&toCurr=PHP`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Referer': 'https://www.visa.com.hk/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const toAmountWithVisaRate = data.reverseAmount;
    return toAmountWithVisaRate;
  } catch (error) {
    console.error('Error fetching Visa exchange rate:', error);
    return null;
  }
}


async function getMastercardRate() {
  try {
    const now = new Date();

              // 计算UTC+8时间
              const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);

              // 使用 `toLocaleDateString` 和 `toLocaleTimeString` 获取日期和时间  
              const currentDate = utc8Time.toLocaleDateString('zh-CN');
              const currentTime = utc8Time.toLocaleTimeString('zh-CN', { hour12: false });

              let year = utc8Time.getUTCFullYear();
              let month = utc8Time.getUTCMonth() + 1; // 月份从0开始
              let formattedMonth = month < 10 ? '0' + month : month.toString();
              let day = utc8Time.getUTCDate();
              let hours = utc8Time.getUTCHours();
              let minutes = utc8Time.getUTCMinutes();
              let seconds = utc8Time.getUTCSeconds();


    // 将日期格式转换为"YYYY-MM-DD"格式
    const formattedDate = `${year}-${formattedMonth}-${day}`;

    // 使用fetch获取JSON数据
    const response = await fetch(`https://www.mastercard.com.cn/settlement/currencyrate/conversion-rate?fxDate=${formattedDate}&transCurr=PHP&crdhldBillCurr=CNY&bankFee=1.5&transAmt=1`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // 获取conversionRate数值
    const conversionRate = data.data.conversionRate;
    return conversionRate;
  } catch (error) {
    console.error('Error fetching Mastercard exchange rate:', error);
    return null;
  }
}

async function getUnionPayRate(date) {
  
  try {
    

              // 获取当前UTC时间
              const now = new Date();

              // 计算UTC+8时间
              const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);

              // 使用 `toLocaleDateString` 和 `toLocaleTimeString` 获取日期和时间
              const currentDate = utc8Time.toLocaleDateString('zh-CN');
              const currentTime = utc8Time.toLocaleTimeString('zh-CN', { hour12: false });

              let year = utc8Time.getUTCFullYear();
              let month = utc8Time.getUTCMonth() + 1; // 月份从0开始
              let formattedMonth = month < 10 ? '0' + month : month.toString();
              let day = utc8Time.getUTCDate();
              let hours = utc8Time.getUTCHours();
              let minutes = utc8Time.getUTCMinutes();
              let seconds = utc8Time.getUTCSeconds();

              // 月份名称数组
              const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

              // 格式化日期和时间
              let formattedDate = `${monthNames[month - 1]} ${day}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

              let utc8Date = `${year}${formattedMonth}${day}`;
    // 使用fetch获取JSON数据
    const response = await fetch(`https://m.unionpayintl.com/jfimg/${utc8Date}.json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // 查找符合条件的对象
    const desiredExchangeRate = data.exchangeRateJson.find(rate => rate.transCur === "PHP" && rate.baseCur === "CNY");

    // 获取rateData数值
    const rateDataPHPtoCNY = desiredExchangeRate ? desiredExchangeRate.rateData : null;

    return (1/rateDataPHPtoCNY).toFixed(4);
  } catch (error) {
    console.error('Error fetching UnionPay exchange rate:', error);
    return null;
  }
}

// 调用函数并获取结果


async function fetchMetrobankRates() {
  const url = 'https://www.metrobank.com.ph/articles/forex';
  const response = await fetch(url);
  const htmlContent = await response.text();

  const usdBuying = await getExchangeRate(htmlContent, 'US Dollar (USD)');
  const cnyBuying = await getExchangeRate(htmlContent, 'Chinese Yuan (CNY)');
  const hkdBuying = await getExchangeRate(htmlContent, 'Hong Kong Dollar (HKD)');

  return {
    USD: usdBuying,
    CNY: cnyBuying,
    HKD: hkdBuying
  };
}

async function fetchBankOfChinaRates() {
  const url = 'https://www.bankofchina.com.ph/en-ph/service/information/exchange-rates1.html';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Bank of China rates: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();

  const cnyPhp = extractLine(html, 283);
  const usdPhp = extractLine(html, 286);
  const hkdPhp = extractLine(html, 301);

  return {
    CNY_PHP: cnyPhp,
    USD_PHP: usdPhp,
    HKD_PHP: hkdPhp
  };
}

function extractLine(html, lineNumber) {
  try {
    // Split HTML content into lines
    const lines = html.split('\n');

    // Check if the document has enough lines
    if (lines.length >= lineNumber) {
      // Extract content from the specified line
      let string = lines[lineNumber - 1];
      let deletedString = string.replace(/<(?:.|\n)*?>/gm, "");
      return deletedString; 
    } else {
      throw new Error(`HTML document does not have ${lineNumber} lines`);
    }
  } catch (err) {
    throw new Error(`Error extracting line ${lineNumber}: ${err.message}`);
  }
}

async function renderUI(rates) {
  const currentDate = new Date().toLocaleDateString('zh-CN');
  
  // Fetch UnionPay rate asynchronously
  const unionPayRate = await getUnionPayRate();

  // Fetch Visa and Mastercard rates asynchronously
  const visaRate = (await getVisaRate()/1).toFixed(4);
  const mastercardRate = (1/await getMastercardRate()).toFixed(4);

  let content = `
    <div class="ui container">
      <div class="header">
        <i class="icon ${config.logo_icon}"></i>
        <h1 class="title">${config.title}</h1>
        <p class="subtitle">${config.subtitle}</p>
      </div>
      <div class="exchange-rates">
        <div class="bank-rates">
          <div class="bank-name">${config.banks[0].name}</div>
          <div class="rate-info">
            <div>${config.currencies[0].flag} 1 USD = 🇵🇭 ${rates.metrobank.USD} PHP</div>
            <div>${config.currencies[1].flag} 1 CNY = 🇵🇭 ${rates.metrobank.CNY} PHP</div>
            <div>${config.currencies[2].flag} 1 HKD = 🇵🇭 ${rates.metrobank.HKD} PHP</div>
          </div>
        </div>
      </div>
      <div class="exchange-rates">
        <div class="bank-rates">
          <div class="bank-name">${config.banks[1].name}</div>
          <div class="rate-info">
            <div>${config.currencies[0].flag} 1 USD = 🇵🇭 ${rates.bankOfChina.USD_PHP} PHP</div>
            <div>${config.currencies[1].flag} 1 CNY = 🇵🇭 ${rates.bankOfChina.CNY_PHP} PHP</div>
            <div>${config.currencies[2].flag} 1 HKD = 🇵🇭 ${rates.bankOfChina.HKD_PHP} PHP</div>
          </div>
        </div>
      </div>
      <div class="exchange-rates">
        <div class="bank-rates">
          <div class="bank-name">UnionPay</div>
          <div class="rate-info">
            <div>${config.currencies[1].flag} 1 CNY = 🇵🇭 ${unionPayRate} PHP</div>
          </div>
        </div>
      </div>
      <div class="exchange-rates">
        <div class="bank-rates">
          <div class="bank-name">VISA</div>
          <div class="rate-info">
            <div>${config.currencies[1].flag} 1 CNY = 🇵🇭 ${visaRate} PHP</div>
          </div>
        </div>
      </div>
      <div class="exchange-rates">
        <div class="bank-rates">
          <div class="bank-name">Mastercard</div>
          <div class="rate-info">
            <div>${config.currencies[1].flag} 1 CNY = 🇵🇭 ${mastercardRate} PHP</div>
          </div>
        </div>
      </div>
    </div>`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui-css/semantic.min.css">
        <style>
          body {
            background-color: #282c34; /* 深色背景 */
            color: #fff; /* 白色文字 */
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .ui.container {
            width: 80%;
            max-width: 800px;
            padding: 20px;
            background-color: #444;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            text-align: center;
          }
          .header {
            margin-bottom: 30px;
          }
          .icon {
            font-size: 48px;
            margin-right: 10px;
            color: #FFD700; /* 金色图标 */
          }
          .title {
            font-size: 36px;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 18px;
            color: #bbb;
            margin-bottom: 20px;
          }
          .exchange-rates {
            margin-bottom: 20px;
            border-bottom: 1px solid #666;
            padding-bottom: 10px;
          }
          .bank-rates {
            margin-bottom: 10px;
          }
          .bank-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #FFD700; /* 金色银行名称 */
          }
          .rate-info {
            font-size: 18px;
            color: #bbb;
          }
          .currency-flag {
            margin-right: 5px;
          }
          @media (max-width: 768px) {
            .title {
              font-size: 28px;
            }
            .subtitle {
              font-size: 16px;
            }
          }
        </style>
    </head>
    <body>
      ${content}
    </body>
    </html>`;

  return html;
}


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const rates = await fetchExchangeRates();

    // Check if the request method is GET
    if (request.method === 'GET') {
      const acceptHeader = request.headers.get('accept');
      if (acceptHeader && acceptHeader.includes('application/json')) {
        // Return JSON response
        return new Response(JSON.stringify(rates), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      }
    }

    // Otherwise, return the HTML UI
    const html = await renderUI(rates);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

async function getExchangeRate(htmlContent, currencyCode) {
  let buyingNotes = null;
  let captureCells = false;
  let cells = [];

  const rewriter = new HTMLRewriter()
    .on('table tbody tr', {
      element(element) {
        cells = [];
        captureCells = true;
      },
      text(textChunk) {
        if (captureCells) {
          cells.push(textChunk.text.trim());
          if (cells.length >= 5) {
            captureCells = false;
            if (cells[0] === currencyCode) {
              buyingNotes = cells[2];
            }
          }
        }
      }
    });

  await rewriter.transform(new Response(htmlContent)).text();
  return buyingNotes;
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const rates = await fetchExchangeRates();

    // Check if the request method is GET
    if (request.method === 'GET') {
      const acceptHeader = request.headers.get('accept');
      if (acceptHeader && acceptHeader.includes('application/json')) {
        // Fetch Visa, Mastercard, UnionPay, MetroBank, and Bank of China rates
        const visaRate = await getVisaRate();
        const mastercardRate = await getMastercardRate();
        const unionPayRate = await getUnionPayRate();
        const metrobankRates = await fetchMetrobankRates();
        const bankOfChinaRates = await fetchBankOfChinaRates();

        // Construct JSON response
        const jsonResponse = {
          visa: visaRate,
          mastercard: mastercardRate,
          unionPay: unionPayRate,
          metrobank: metrobankRates,
          bankOfChina: bankOfChinaRates
        };

        // Return JSON response
        return new Response(JSON.stringify(jsonResponse), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      }
    }

    // Otherwise, return the HTML UI
    const html = await renderUI(rates);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}
