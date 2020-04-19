// import modules
const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);
const overviewTemp = fs.readFileSync(
  `${__dirname}/templates/templateOverview.html`,
  'utf-8'
);
const productTemp = fs.readFileSync(
  `${__dirname}/templates/templateProduct.html`,
  'utf-8'
);
const cardTemp = fs.readFileSync(
  `${__dirname}/templates/templateCard.html`,
  'utf-8'
);

// create server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // 1. overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Context-type': 'text/html' });

    const cardHtml = dataObj.map((item) => replaceTemplate(cardTemp, item));

    const output = overviewTemp.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);
  }
  // 2. products page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemp, product);

    res.end(output);
  }

  // 3. api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Context-type': 'application/json' });
    res.end();
  }

  // 4. Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'test',
    });
    res.end('<h1>page not found</h1>');
  }
  res.end();
});

// execute server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on the port 8000...');
});
