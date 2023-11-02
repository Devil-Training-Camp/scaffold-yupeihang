const copydir = require('copy-dir');
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
// 文件拷贝分三步来实现，使用 fs.readFileSync 读取被拷贝的文件内容，然后创建一个文件，再使用 fs.writeFileSync 写入文件内容。

// fs.mkdirSync 的语法格式：fs.mkdirSync(path[, options])，创建文件夹目录。

// path：文件夹目录路径；
// options：recursive 表示是否要创建父目录，true 要。

// fs.existsSync 的语法格式：fs.existsSync(pach)，检测目录是否存在，如果目录存在返回 true ，如果目录不存在返回false。

// path：文件夹目录路径。

// path.dirname 的语法格式：path.dirname(path)，用于获取给定路径的目录名。

// path：文件路径。

// 在 mkdirGuard 方法内部，当要创建的目录 target 父级目录不存在时，调用fs.mkdirSync(target)，
// 会报错走 catch 部分逻辑，在其中递归创建父级目录，使用 fs.existsSync(dir) 来判断父级目录是否存在，来终止递归。
// 这里要特别注意 fs.mkdirSync(dir) 创建父级目录要在 mkdirp(dirname) 之前调用，
// 才能形成一个正确的创建顺序，否则创建父级目录过程会因父级目录的父级目录不存在报错。

function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (e) {
    mkdirp(target)
    function mkdirp(dir) {
      if (fs.existsSync(dir)) { return true } // 为了防止用户修改后的模板文件，运行命令后被重新覆盖到初始状态。所以我们引入一个校验模板文件是否存在
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

// 复制单个文件方法
function copyDir(form, to, options) {
    mkdirGuard(to);
    copydir.sync(form, to, options);
}

// 校验文件是否存在
function checkMkdirExists(path) {
    return fs.existsSync(path)
};

// 复制文件夹方法
function copyFolderRecursiveSync(source, target) {
  // 创建目标文件夹
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  // 遍历源文件夹中的每个文件或子文件夹
  fs.readdirSync(source).forEach((file) => {
    // 构造源文件/文件夹的完整路径
    const sourcePath = path.join(source, file);

    // 构造目标文件/文件夹的完整路径
    const targetPath = path.join(target, file);

    // 获取文件/文件夹的详细信息
    const stat = fs.statSync(sourcePath);

    if (stat.isFile()) {
      // 如果是文件，则直接复制文件
      fs.copyFileSync(sourcePath, targetPath);
    } else if (stat.isDirectory()) {
      // 如果是文件夹，则递归复制文件夹
      copyFolderRecursiveSync(sourcePath, targetPath);
    }
  });
}

// 复制文件夹
const sourcePath = path.join(__dirname, 'source');
const destinationPath = path.join(__dirname, 'destination');

function copyFile(from, to) {
    console.log(111)
    const buffer = fs.readFileSync(from);
    fs.cp('./aa', './bb', { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
    console.log(222)
    const parentPath = path.dirname(to);
    console.log(333)
    mkdirGuard(parentPath)
    fs.writeFileSync(to, buffer);
}

function readTemplate(path, data = {}) {
  const str = fs.readFileSync(path, { encoding: 'utf8' })
  return Mustache.render(str, data);
}

// readTemplate 方法接收两个参数，path 动态模板文件的相对路径，data 动态模板文件的配置数据。
// 使用 Mustache.render(str, data) 生成模板文件内容返回，因为 Mustache.render 的第一个参数类型是个字符串，
// 所以在调用 fs.readFileSync 时要指定 encoding 类型为 utf8，否则 fs.readFileSync 返回 Buffer 类型数据。

function copyTemplate(from, to, data = {}) {
    if (path.extname(from) !== '.tpl') {
      return copyFile(from, to);
    }
    // path.extname(from) 返回文件扩展名，比如 path.extname(index.tpl) 返回 .tpl。
    const parentToPath = path.dirname(to);
    mkdirGuard(parentToPath);
    fs.writeFileSync(to, readTemplate(from, data));
}

exports.copyFolderRecursiveSync = copyFolderRecursiveSync;
exports.readTemplate = readTemplate;
exports.copyTemplate = copyTemplate;
exports.copyFile = copyFile;
exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.copyDir = copyDir;
