
## parser解析器

ESLint 的解析器，早期的时候用的是 Esprima，后面基于 Esprima v1.2.2 版本开发了一个新的解析器 Espree，并且把它当做默认解析器。

除了使用 ESLint 自带的解析器外，还可以指定其他解析器：

- @babel/eslint-parser：使 Babel 和 ESLint 兼容，对一些 Babel 语法提供支持；配合@babel/eslint-plugin使用

- @typescript-eslint/parser：TSLint 被弃用后，TypeScript 提供了此解析器用于将其与 ESTree 兼容，使 ESLint 对 TypeScript 进行支持；配合@typescript-eslint/eslint-plugin使用
  
为项目指定某个选择器的原则是什么？

如果你的项目用到了比较新的 ES 语法，比如 ES2021 的 Promise.any()，那就可以指定 @babel/eslint-parser 为解析器；

如果项目是基于 TS 开发的，那就使用 @typescript-eslint/parser；

```tsx
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["prettier"]
    },
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      plugins: ["@babel/eslint-plugin"],
      extends: ["prettier"]
    }
  ]
```

### @typescript-eslint/eslint-plugin

有很多 ESLint 的规则我们是可以复用的。尽管我们对 TypeScript AST 进行了转换，但转换后的 ESTree 中，针对 typescript 中的语法，ESLint 仍然是看不懂的。所以对于 typescript，ESLint 提供的一些规则不再适用。
因此该 plugin 的存在就是为了做这样一件事，提供相应的 rule，让 ESLint 能够识别。同时为了避免冲突，在手动开启该 plugin 的某些规则时，需要将 ESLint 当中的一些规则关闭。