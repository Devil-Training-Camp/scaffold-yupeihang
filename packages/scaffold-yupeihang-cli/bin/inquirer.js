const inquirer = require('inquirer');

// prompt 函数接收一个数组，数组的每一项都是一个询问项，询问项有很多配置参数
// type：提问的类型，常用的有

// 输入框：input；
// 确认：confirm；
// 单选组：list；
// 多选组：checkbox；


// name：存储当前问题答案的变量；
// message：问题的描述；
// default：默认值；
// choices：列表选项，在某些type下可用；
// validate：对用户的答案进行校验；
// filter：对用户的答案进行过滤处理，返回处理后的值。

function inquirerPrompt(argv) {
  const { name } = argv;
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '模板名称',
        default: name,
        validate: function (val) {
          if (!/^[a-zA-Z]+$/.test(val)) {
            return "模板名称只能含有英文";
          }
          if (!/^[A-Z]/.test(val)) {
            return "模板名称首字母必须大写"
          }
          return true;
        },
      },
      // {
      //   type: 'list',
      //   name: 'type',
      //   message: '模板类型',
      //   choices: ['表单', '动态表单', '嵌套表单'],
      //   filter: function (value) {
      //     return {
      //       '表单': "form",
      //       '动态表单': "dynamicForm",
      //       '嵌套表单': "nestedForm",
      //     }[value];
      //   },
      // },
      {
        type: 'list',
        message: '使用什么版本开发',
        choices: ['vue2', 'vue3'],
        name: 'type',
      }
    ]).then(answers => {
      resolve(answers)
    }).catch(error => {
      reject(error)
    })
  })

}

exports.inquirerPrompt = inquirerPrompt;