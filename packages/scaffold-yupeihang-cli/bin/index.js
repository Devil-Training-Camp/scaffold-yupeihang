#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const { inquirerPrompt } = require("./inquirer");
const { copyFolderRecursiveSync, checkMkdirExists } = require("./copy");
const { install } = require('./manager');

// yargs.command(cmd, desc, builder, handler)
// cmd：字符串，子命令名称，也可以传递数组，如 ['create', 'c']，表示子命令叫 create，其别名是 c；
// desc：字符串，子命令描述信息；
// builder：一个返回数组的函数，子命令参数信息配置，比如可以设置参数：

// alias：别名；
// demand：是否必填；
// default：默认值；
// describe：描述信息；
// type：参数类型，string | boolean | number。
// handler: 函数，可以在这个函数中专门处理该子命令参数。

yargs.command(
    ['create', 'c'],
    '新建一个模板',
    function (yargs) {
        return yargs.option('name', {
            alias: 'n',
            demand: true,
            describe: '模板名称',
            type: 'string'
        })
    },
    function (argv) {
        inquirerPrompt(argv).then(answers => {
            const { name, type } = answers;
            const isMkdirExists = checkMkdirExists(
                path.resolve(process.cwd(), `./${name}`)
            );
            if (isMkdirExists) {
                console.log(`${name}文件夹已经存在`)
            } else {
                copyFolderRecursiveSync(
                    path.resolve(__dirname, `./template/${type}`),
                    // 其中 __dirname 是用来动态获取当前文件模块所属目录的绝对路径。
                    // 比如在 bin/index.js 文件中使用 __dirname ，__dirname 表示就是 bin/index.js 文件所属目录的绝对路径
                    // 因为模板文件存放在 bin/template 文件夹中 ，copyDir 是在 bin/index.js 中使用，
                    // bin/template 文件夹相对 bin/index.js 文件的路径是 ./template，
                    // 所以把 path.resolve 的参数 to 设置为 ./template/${type}，其中 type 是用户所选的模板类型。
                    // 假设 type 的模板类型是 form，那么 path.resolve(__dirname, `./template/form`) 
                    // 得到的绝对路径是 D:\mortal\packages\mortal-cli\bin\template\form。
                    path.resolve(process.cwd(), `./${name}`)
                    // 其中 process.cwd() 当前 Node.js 进程执行时的文件所属目录的绝对路径。
                    // 比如在 bin 文件夹目录下运行 node index.js 时，process.cwd() 
                    // 得到的是 D:\mortal\packages\mortal-cli\bin。
                )
                install(process.cwd(), answers);
            }
        })
    }
).argv;
