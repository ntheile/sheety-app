const commandLineArgs = require('command-line-args');
const promptDirectory = require('inquirer-directory');

const optsConfig = { partial: true, camelCase: true };
const options = commandLineArgs(
  {
    name: 'folder-name',
    type: String
  },
  optsConfig
);

let { folderName = 'state' } = options;

module.exports = function(plop) {
  plop.setPrompt('directory', promptDirectory);
  plop.setGenerator('ngxs-cli', {
    description: 'Create new store',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Store name:'
      },
      {
        type: 'directory',
        name: 'directory',
        message: 'Directory:',
        basePath: process.cwd()
      },
      {
        type: 'confirm',
        default: false,
        name: 'spec',
        message: 'Add spec for state?'
      }
    ],
    actions: data => {
      let { spec, directory } = data;
      folderName = data.name;     
      const actions = [
        addFileByTpl({ directory, folderName, file: 'state' }),
        addFileByTpl({ directory, folderName, file: 'actions' }),
        addFileByTpl({ directory, folderName, file: 'model' }),
        addFileByTpl({ directory, folderName, file: 'component' }),
        addFileByTplExt({ directory, folderName, file: 'component.html' }),
        addFileByTplExt({ directory, folderName, file: 'component.scss' })
      ];

      if (spec) {
        actions.push(addFileByTpl({ directory, folderName, file: 'state.spec' }));
      }

      return actions;
    }
  });
};

function addFileByTpl({ directory, folderName, file }) {
  const templateFile = `./templates/${file}.tpl`;
  const typescriptFile = `{{\'dashCase\' name}}.${file}.ts`;
  const path = `${process.cwd()}/${directory}/${folderName}/${typescriptFile}`;
  return { type: 'add', skipIfExists: true, path, templateFile };
}

function addFileByTplExt({ directory, folderName, file }) {
  const templateFile = `./templates/${file}.tpl`;
  const typescriptFile = `{{\'dashCase\' name}}.${file}`;
  const path = `${process.cwd()}/${directory}/${folderName}/${typescriptFile}`;
  return { type: 'add', skipIfExists: true, path, templateFile };
}