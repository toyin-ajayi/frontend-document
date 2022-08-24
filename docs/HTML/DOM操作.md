>DOM操作大全：https://juejin.im/post/5af43bd5f265da0b8336c6f7#heading-3

## 节点创建API

- createElement：document.createElement(tagName);
- createTextNode：node.cloneNode(deep);
- cloneNode：node.cloneNode(deep);
- DocumentFragments 

DocumentFragments 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。
因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流(reflow)(对元素位置和几何上的计算)。因此，使用文档片段document fragments 通常会起到优化性能的作用。
```
<body>
  <ul id="ul"></ul>
</body>
<script>
  (function()
  {
    var start = Date.now();
    var str = '', li;
    var ul = document.getElementById('ul');
    var fragment = document.createDocumentFragment();
    for(var i=0; i<1000; i++)
    {
        li = document.createElement('li');
        li.textContent = '第'+(i+1)+'个子节点';
        fragment.appendChild(li);
    }
    ul.appendChild(fragment);
  })();
</script>

```

## 页面修改API

- appendChild：parent.appendChild(child);
- insertBefore：parentNode.insertBefore(newNode,refNode);
- removeChild：parent.removeChild(node);
- replaceChild：parent.replaceChild(newChild,oldChild);
