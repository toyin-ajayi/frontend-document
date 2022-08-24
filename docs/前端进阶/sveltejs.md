## Svelte

Svelte 的核心思想在于『通过静态编译减少框架运行时的代码量』。举例来说，当前的框架无论是 React Angular 还是 Vue，不管你怎么编译，使用的时候必然需要『引入』框架本身，也就是所谓的运行时 (runtime)。但是用 Svelte 就不一样，一个 Svelte 组件编译了以后，所有需要的运行时代码都包含在里面了，除了引入这个组件本身，你不需要再额外引入一个所谓的框架运行时


当然，这不是说 Svelte 没有运行时，但是出于两个原因这个代价可以变得很小：

1. Svelte 的编译风格是将模板编译为命令式 (imperative) 的原生 DOM 操作。
比如这段模板：
```html
<a>{{ msg }}</a>
```
会被编译成如下代码：

```js
function renderMainFragment ( root, component, target ) {
	var a = document.createElement( 'a' );
	
	var text = document.createTextNode( root.msg );
	a.appendChild( text );
	
	target.appendChild( a )

	return {
		update: function ( changed, root ) {
			text.data = root.msg;
		},

		teardown: function ( detach ) {
			if ( detach ) a.parentNode.removeChild( a );
		}
	};
}
```
可以看到，跟基于 Virtual DOM 的框架相比，这样的输出不需要 Virtual DOM 的 diff/patch 操作，自然可以省去大量代码，同时，性能上也和 vanilla JS 相差无几（仅就这个简单示例而言），内存占用更是极佳。


2. 对于特定功能，Svelte 依然有对应的运行时代码，比如组件逻辑，if/else 切换逻辑，循环逻辑等等... 但它在编译时，如果一个功能没用到，对应的代码就根本不会被编译到结果里去。这就好像用 Babel 的时候没有用到的功能的 helper 是不会被引入的，又好像用 lodash 或者 RxJS 的时候只选择性地引入对应的函数。
