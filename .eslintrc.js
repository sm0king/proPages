module.exports = {
  parser: 'babel-eslint',
  // 基于 https://github.com/yuche/javascript
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    // 迭代器函数前星号不用加空格
    'generator-star-spacing': [0],
    // 函数没有返回值时，可以不写 return 语句.
    'consistent-return': [0],
    // 不具体限制 PropTypes 中的类型 
    'react/forbid-prop-types': [0],
    // 使用 .js 做为 React 组件的文件扩展名
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    // require() 应该放在模块的全局作用域内调用
    'global-require': [1],
    // 模块只导出一个对象时，不限制其为默认的(export default)
    'import/prefer-default-export': [0],
    // render 函数中可以创建临时函数
    'react/jsx-no-bind': [0],
    // 可以不写 PropTypes ？
    'react/prop-types': [0],
    // 不限制将无状态的组件写成函数式组件
    'react/prefer-stateless-function': [0],
    // React 元素书写规则，详见：
    // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/jsx-wrap-multilines.md
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'ignore',
      },
    ],
    // https://eslint.org/docs/3.0.0/rules/no-else-return#disallow-return-before-else-no-else-return
    'no-else-return': [0],
    // 没有语法的使用限制，包括 with 语句也可使用 （CodeReview）
    'no-restricted-syntax': [0],
    // import 语句不检查 package.json 是否包含依赖
    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': [0],
    // 不限制在定义函数、变量之前使用  （CodeReview）
    'no-use-before-define': [0],
    // 关闭部分可访问性限制
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/anchor-is-valid': [0],
    // 允许嵌套三元运算符 （CodeReview）
    'no-nested-ternary': [0],
    // 不限制箭头函数的格式
    'arrow-body-style': [0],
    // 导入时可以不写文件扩展名
    'import/extensions': [0],
    // 不限制位运算符的使用 （CodeReview）
    'no-bitwise': [0],
    // 在条件表达式(if、while)中允许有赋值表达式 （CodeReview）
    'no-cond-assign': [0],
    // 不限制 import 的模块必须能解析到（照顾 Webpack 的别名功能）
    'import/no-unresolved': [0],
    // 对象、数组末尾加逗号（多行情况下 ）
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    // 不限制定义对象的写法
    'object-curly-newline': [0],
    // ？
    'function-paren-newline': [0],
    // 不限制对全局变量的使用
    'no-restricted-globals': [0],
    // generator 函数中必须包含 yield 语句
    'require-yield': [1],
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  settings: {
    polyfills: ['fetch', 'promises'],
  },
};
