## 需要用的插件

- ESLint: 语法检查
  - eslint-config-prettier 兼容prettier的配置
  - eslint-plugin-react 引入react的规则
- stylelint: 样式文件语法检查
  - stylelint-config-prettier 兼容prettier配置
  - stylelint-config-prettier-scss 兼容prettier配置
  - stylelint-config-standard-scss 社区推荐scss配置
  - stylelint-order css属性排序插件
  - stylelint-config-recess-order 添加css属性排序
  - stylelint-config-standard 社区推荐css配置
- prettier: 代码风格检查
  - pretty-quick: 快速对改动部分的代码做风格化统一
- husky: git提交是能触发钩子函数
- lint-staged: 能只对改动的部分的代码做检测
- commitlint: 检测git提交的信息格式
  - @commitlint/config-angular 使用angular的规则

## 配置实践

### package.json
```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write \"src/**/*\" --ignore-unknown",
    "eslint": "eslint \"src/**/*.{ts,tsx,js,jsx}\"",
    "eslint-fix": "eslint --fix \"src/**/*.{ts,tsx,js,jsx}\"",
    "stylelint": "stylelint \"src/**/*.{css,scss}\"",
    "stylelint-fix": "stylelint \"src/**/*.{css,scss}\" --fix"
  },
  "husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged && yarn run lint-staged",
      "commit-msg": "yarn run commitlint --edit $1"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint --fix",
    "*.scss": "stylelint --custom-syntax postcss-scss --fix",
    "*.css": "stylelint --custom-syntax postcss --fix"
  },
}
```

### .eslintrc.js 

#### ESLint 选择 parser 解析器

ESLint 的解析器，早期的时候用的是 Esprima，后面基于 Esprima v1.2.2 版本开发了一个新的解析器 Espree，并且把它当做默认解析器。

除了使用 ESLint 自带的解析器外，还可以指定其他解析器：

- @babel/eslint-parser：使 Babel 和 ESLint 兼容，对一些 Babel 语法提供支持；配合@babel/eslint-plugin 使用

- @typescript-eslint/parser：TSLint 被弃用后，TypeScript 提供了此解析器用于将其与 ESTree 兼容，使 ESLint 对 TypeScript 进行支持；配合@typescript-eslint/eslint-plugin 使用

为项目指定某个选择器的原则是什么？

如果你的项目用到了比较新的 ES 语法，比如 ES2021 的 Promise.any()，那就可以指定 @babel/eslint-parser 为解析器；

如果项目是基于 TS 开发的，那就使用 @typescript-eslint/parser；

#### @typescript-eslint/eslint-plugin

有很多 ESLint 的规则我们是可以复用的。尽管我们对 TypeScript AST 进行了转换，但转换后的 ESTree 中，针对 typescript 中的语法，ESLint 仍然是看不懂的。所以对于 typescript，ESLint 提供的一些规则不再适用。
因此该 plugin 的存在就是为了做这样一件事，提供相应的 rule，让 ESLint 能够识别。同时为了避免冲突，在手动开启该 plugin 的某些规则时，需要将 ESLint 当中的一些规则关闭。

```js
module.exports = {
  extends: ["prettier"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["prettier"],
    },
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      plugins: ["@babel/eslint-plugin"],
      extends: ["prettier"]
    }
  ]
};

```

### .stylelintrc.js

```js
module.exports = {
  extends: [
    "stylelint-config-recess-order",
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss",
    "stylelint-config-prettier"
  ],
  plugins: ["stylelint-order"],
  overrides: [
    {
      files: ["*.scss", "**/*.scss"],
      customSyntax: "postcss-scss",
    },
    {
      files: ["*.css", "**/*.css"],
      customSyntax: "postcss"
    }
  ]
};
```

### .prettierrc.js 

```js
module.exports = {
  "printWidth": 80, //一行的字符数，如果超过会进行换行，默认为80
  "tabWidth": 2, //一个tab代表几个空格数，默认为80
  "useTabs": false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
  "singleQuote": false, //字符串是否使用单引号，默认为false，使用双引号
  "semi": true, //行位是否使用分号，默认为true
  "trailingComma": "none", //是否使用尾逗号，有三个可选值"<none|es5|all>"
  "bracketSpacing": true //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
}
```

### commitlint.config.js

```js
module.exports = {
	extends: ['@commitlint/config-angular']
}

```