## 文档
- https://docs.nestjs.cn/8/introduction
- https://docs.nestjs.cn/8/awesome 质料汇总

## 核心思想
Nest.js 基于 express 这种 http 平台做了一层封装，应用了 MVC、IOC、AOP 等架构思想。

- [IOC 和 DI](./依赖注入原理分析.md)
- [AOP](./AOP-面向切片.md)

## Nestjs 分层结构

- main.ts 项目入口文件
- app.module.ts  根模块 告诉nest如何组装应用
- app.controller.ts  项目控制器，处理路由、req、res信息
- app.service.ts  处理实际业务逻辑信息，给controller调用

Service层和DTO层的作用
Service层主要提供的几个作用：
1、将业务逻辑层进行封装，对外提供业务服务调用。
2、通过外观模式，屏蔽业务逻辑内部方法。
3、降低业务逻辑层与UI层的依赖，业务逻辑接口或实现的变化不会影像UI层。
4、降低UI层调用的请求次数及数据往返。

DTO层主要提供的作用：
数据传输对象（DTO）(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是数据访问对象从数据库中检索数据。
在上面的结构中，我们说了Service层的作用，目前还少加入了一层，DTO(数据传输对象层)，该层负责屏蔽后端的实体层，将UI层需要的数据进行重新的定义和封装，在实际的业务场景下，后端实现或存储的数据远比用户需要的数据要庞大和复杂，所以前端需要的数据相对来说要么是组合的，要么是抽取的，不是完整的，因为我们在设计数据存储格式上都会有一些额外的设计和考虑。

前端的UI层，只是知道DTO的存在，同时前端需要的数据都在一个DTO中，这样，每次调用服务层的时候，只需要调用一次就可以完成所有的业务逻辑操作，而不是原来的直接调用业务逻辑层那样的，需要调用多次，对于分布式场景下，减少服务调用的次数，尤其重要。

## 模块
一个服务可能分为用户模块、文件模块、权限模块，可以按照Controller+Service+Module的写法才分到不同文件夹，然后统一导入到全局的app模块。
import属性就用来导入的
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // 这里可以导入UserModule、FileModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 动态模块

Nest 模块系统具有一个称为动态模块的特性。
- 他能够让我们创建可定制的模块，当导入模块并向其传入某些选项参数
- 这个模块根据这些选项参数来动态的创建不同特性的模块
- 这种通过导入时传入参数并动态创建模块的特性称为 动态模块。

```ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forRoot([User]),
  ],
})
export class ApplicationModule {}
```


## Provider 种类

Provider是一个比较宽泛的概念，不仅局限于Service类型，实际上任何一个类、值乃至一个接口，都可以视作一个Provider

```ts
export type Provider<T = any> =
  | Type<any> // 类型
  | ClassProvider<T> // 类
  | ValueProvider<T> // 值
  | FactoryProvider<T> // 工厂
  | ExistingProvider<T>; // 别名
```
- Type 类型
- ClassProvider 类类型的Provider，有三个字段组成：
  - provide：被注入对象参数，可以是字符串，symbol，类型，抽象类和Function
  - useClass：类型名称
  - scope：作用域（参考Provider作用域），可选参数，默认scope.DEFAULT，即Application
- ValueProvider 值类型Provider，有两个字段组成：
  - provide：被注入对象参数，可以是字符串，symbol，类型，抽象类和Function
  - userValue：值的实例
- FactoryProvider 工厂类Provider，有四个字段：
  - provide：被注入对象参数，可以是字符串，symbol，类型，抽象类和Function
  - useFactory：工厂的参数
  - inject：被注入的工厂中上依赖项（可选）
  - scope：作用域，(可选)
- ExistingProvider 已经存在的（别名）类Provider，两个字段：
  - provide：被注入对象参数，可以是字符串，symbol，类型，抽象类和Function
  - useExisting：别名

## 数据校验和DTO

```ts
import {
    IsString,
    MinLength,
    MaxLength,
    IsInt,
    ValidateIf,
} from 'class-validator';
import { BookConstants } from '../../constants/book';

export class CreateBookChapterDto {
    @MinLength(1, {
        message: '章节标题不能为空',
    })
    @MaxLength(BookConstants.CHAPTER_TITLE_MAX_LENGTH, {
        message: '章节标题不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsInt({
        message: '无效的bookID',
    })
    readonly bookID: number;

    // 传了 parentChapterID 字段的话，才对 parentChapterID 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.parentChapterID !== 'undefined';
    })
    @IsInt({
        message: '无效的id',
    })
    readonly parentChapterID: number;
}
```

## 全局异常过滤器

方案一：
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```
useGlobalFilters()不能注入依赖，因为它们不属于任何模块。为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器

方案二：
```ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
Copy to clipboardErrorCopied

```
