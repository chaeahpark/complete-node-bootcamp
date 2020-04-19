const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./replaceTemplate');

// it is called only once
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templateOverview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/templateCard.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/templateProduct.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

// create server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Context-type': 'text/html' });

    const cardsHtml = dataObj
      .map((item) => replaceTemplate(tempCard, item))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

    res.end(output);
    // product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    // sending json data
    res.end(data);

    // not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'test',
    });
    res.end('<h1>page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000...');
});
