const fs = require('fs');
const path = require('path');
const glob = require('glob');
const exec = require('child_process').execSync;

const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const tmpPath = path.join(process.cwd(), './script/tmp');
const entryPath = path.join(tmpPath, './entry.js');
const pluginPath = path.join(process.cwd(), './src/plugin/web/src');
const distPath = path.join(process.cwd(), './src/plugin/web/index.js');

// 清除临时目录
function cleanTmp() {
  exec(`rm -rf ${tmpPath}`);
}

function normalPluginName(str) {
  return str.replace(/\-/img, '_');
}

async function readPluginsName() {
  return new Promise(function (resolve, reject) {
    glob('*.js', {
      cwd: pluginPath
    }, function (er, files) {
      if (er) {
        reject(er);
        return;
      }
      resolve(files.map(file => file.split('.')[0]))
    });
  });
}

// 生成入口文件
function generateEntry(plugins) {
  let code = `import invoke from 'react-native-webview-invoke/dist/browser.common';\n`;

  plugins.forEach(plugin => {
    code += `import * as ${normalPluginName(plugin)} from '${path.join(pluginPath, plugin)}';\n`;
  });

  code += `
const hpr = {};
  `;

  plugins.forEach(plugin => {
    const pluginNormalName = normalPluginName(plugin);
    code += `
// ${plugin}
const ${pluginNormalName}FunsInvoke = {};
for (let key in ${pluginNormalName}) {
  ${pluginNormalName}FunsInvoke[key] = invoke.bind(key);
}
Object.assign(hpr, ${pluginNormalName}FunsInvoke);
    `;
  });

  code += `
window.hpr = hpr;
  `;

  exec(`mkdir -p ${tmpPath}`);
  fs.writeFileSync(entryPath, code, 'utf-8');
}

// 编译 Web Invoke
async function buildWebInvoke() {
  const bundle = await rollup.rollup({
    input: entryPath,
    plugins: [
      resolve(),
      commonjs(),
      uglify()
    ]
  });
  const { code, map } = await bundle.generate({
    format: 'iife'
  });

  return `export default '${code.trim()}';\n`;
}

// 生成插件数组
function buildPluginInstaller(plugins) {
  let code = '';
  plugins.forEach(plugin => {
    code += `import * as ${normalPluginName(plugin)} from 'plugin/web/src/${plugin}';\n`;
  });
  code += `
export const invokePlugins = {
  install (context) {
`
  +
  plugins.map(plugin => {
    return `
    for (let key in ${normalPluginName(plugin)}) {
      const bindPluginFn = ${normalPluginName(plugin)}[key].bind(context);
      context.invoke.define(key, bindPluginFn);
    }
  `
  }).join('\n')
  +
`
  }
};
`

  return code
}

function writeFile(code) {
  fs.writeFileSync(distPath, code, 'utf-8');
}

async function build() {
  const plugins = await readPluginsName();
  
  cleanTmp();
  generateEntry(plugins);
  const browserInvoke = await buildWebInvoke();
  const pluginInstaller = buildPluginInstaller(plugins);

  writeFile([
    '// 这个文件由脚本自动生成\n// 如需重新生成，请执行 npm run build:plugin',
    pluginInstaller,
    browserInvoke
  ].join('\n'));
  
  cleanTmp();
}

build();
