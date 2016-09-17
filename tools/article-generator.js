const fs = require('fs');
const pug = require('pug');
const articles = JSON.parse(fs.readFileSync('json/articles.json','utf8'));

const template_path = 'template/article.pug';
const html_ext = '.html';
const md_ext = '.md';


var buildTemplate = (path,variables) => {
  var template = pug.compileFile(path,{pretty:true});
  var html = template({option:variables});
  return html;
};

articles.forEach((article,index,array) => {
  const mdfile_path = '.' + '/markdown' + article.url + md_ext;
  // Copy text.md from article file
  try {
    fs.writeFileSync('./template/text.md',fs.readFileSync(mdfile_path));
  } catch(err) {
    console.log(err);
  }
  // Build Haml
  html = buildTemplate(template_path,article);
  fs.writeFileSync('.' + article.url + html_ext,html);
  try {
    fs.unlink('template/text.md');
  } catch(err){
    console.log(err);
  }
});