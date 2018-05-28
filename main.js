var selectLanguage = new Choices('#select_lang', {
    searchfields: ['label', 'value'],
    choices: [
        {value: '-', label: '-'},
        {value: 'php', label: 'PHP'},
        {value: 'css', label: 'CSS'},
        {value: 'clike', label: 'Clike'},
        {value: 'javascript', label: 'JavaScript'},
        {value: 'abap', label: 'Abap'},
        {value: 'actionscript', label: 'ActionScript'},
        {value: 'ada', label: 'Ada'},
        {value: 'apacheconf', label: 'Apacheconf'},
        {value: 'applescript', label: 'AppleScript'},
        {value: 'c', label: 'C'},
        {value: 'csharp', label: 'C Sharp'},
        {value: 'cpp', label: 'C++'},
        {value: 'arduino', label: 'Arduino'},
        {value: 'cofeescript', label: 'CoffeeScript'},
        {value: 'dart', label: 'Dart'},
        {value: 'elixir', label: 'Elixir'},
        {value: 'fortran', label: 'Fortran'},
        {value: 'graphql', label: 'GraphQL'},
        {value: 'java', label: 'Java'},
        {value: 'json', label: 'JSON'},
        {value: 'objectivec', label: 'Objetive C'},
        {value: 'perl', label: 'Perl'},
        {value: 'sql', label: 'SQL'},
        {value: 'python', label: 'Python'},
        {value: 'sass', label: 'SASS'},
        {value: 'stylus', label: 'Stylus'},
        {value: 'vim', label: 'VIM'},
        {value: 'yaml', label: 'YAML'}
    ]
});

var submit = document.getElementById('submit');
submit.addEventListener('click', async () => {
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var language = document.getElementById('select_lang').value;
    var archive = await DatArchive.create({
        title: title,
        description: title + ' - share your code easily with dat!'
    });
    await createFiles(archive, title, content, language);
});

async function createFiles(archive, title, content, language) {
    await archive.writeFile('/index.html', await index_html(title, content, language));
    await archive.writeFile('/highlight.js', await highlight_html());

    var share_link = document.getElementById('share_link');
    share_link.innerHTML = '<a href="'+archive.url+'" target="_blank" rel="nofollow noopener">'+archive.url+'</a>';
    share_link.style.display = 'inline-block';
}
async function highlight_html() {
    var code = '';
    var code_req = await fetch('./code/highlight.js');
    code = await code_req.text();
    if(!typeof code === 'string') {
        throw new Error('not a string');
    }
    return code;
}
async function index_html(title, content, language) {
    console.log(language);
    var code_req = await fetch('./code/code.html');
    var code = await code_req.text();
    code = code.replace('%site_title%', title);
    code = code.replace('%title%', title);
    if(language != null) {
        code = code.replace('%content%', '<pre><code class="language-'+language+'">'+content+'</code></pre>');
    }
    else {
        code = code.replace('%content%', content);
    }
    if(!typeof code === 'string') {
        throw new Error('not a sting');
    }
    return code;
}