const fs = require('fs');
const pug = require('pug');
const path = require('path');
const mustache = require("mustache");

const articles = JSON.parse(fs.readFileSync(__dirname + '/www/json/articles.json', 'utf8'));

const template_path = __dirname + '/www/pug/template/article.pug';
const html_ext = '.html';
const md_ext = '.md';

// 必ずgulp上で実行されるので、destはすでにあると考えていい。
try {
  fs.mkdirSync(__dirname + "/dest/article/");
} catch (err) {
  console.log(err)
}

var buildTemplate = (content, variables) => {
  var template = pug.compile(content, { pretty: true, filename: "www/pug/template/article.pug" });
  var html = template(variables);
  return html;
};

articles.forEach((article, index, array) => {
  const mdfile_path = '../../markdown' + article.url + md_ext;
  const view = {
    md_url: mdfile_path
  };
  const output = mustache.render(fs.readFileSync(template_path).toString(), view);
  // Build Haml
  html = buildTemplate(output, article);
  try {
    fs.accessSync(__dirname + "/dest" + path.dirname(article.url));
  } catch (err) {
    if (err) {
      fs.mkdirSync(__dirname + "/dest" + path.dirname(article.url));
    }
  }
  fs.writeFileSync(__dirname + "/dest" + article.url + html_ext, html)
});