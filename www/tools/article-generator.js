const fs = require('fs');
const pug = require('pug');
const path = require('path')
const articles = JSON.parse(fs.readFileSync(__dirname + '/../json/articles.json', 'utf8'));

const template_path = __dirname + '/../pug/template/article.pug';
const html_ext = '.html';
const md_ext = '.md';

var buildTemplate = (path, variables) => {
  var template = pug.compileFile(path, { pretty: true });
  var html = template({ option: variables });
  return html;
};

articles.forEach((article, index, array) => {
  const mdfile_path = __dirname + '/../' + '/markdown' + article.url + md_ext;
  // Copy text.md from article file
  try {
    fs.writeFileSync(__dirname + '/../pug/template/text.md', fs.readFileSync(mdfile_path));
  } catch (err) {
    console.log(err);
  }
  // Build Haml
  html = buildTemplate(template_path, article);

  fs.mkdir(__dirname + "/../../dest/article/", (err) => {
    fs.mkdir(__dirname + "/../../dest/" + path.dirname(article.url), (err) => {
      fs.writeFile(__dirname + "/../../dest/" + article.url + html_ext, html, (err) => {
        fs.unlink(__dirname + '/../pug/template/text.md', (err) => {
          if (err) {
            console.log(err);
          }
        })
      })
    })
  })

});