/**
 * @description: 优化生成器README类别索引名称
 * https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/sidebars/generator.ts
      return {
        type: 'category',
        label: categoryMetadata?.label ?? categoryLinkedDoc?.label ?? filename,
        collapsible: categoryMetadata?.collapsible,
        collapsed: categoryMetadata?.collapsed,
        position:
          categoryMetadata?.position ??
          categoryLinkedDoc?.position ??
          numberPrefix,
        source: folderName,
        ...(customProps !== undefined && {customProps}),
        ...(className !== undefined && {className}),
        items,
        ...(link && {link}),
      };
 * 从源码看没有给定元数据定义README标题时，会把上层文件夹命名为README，不符合预期
 * @param {*} tree 侧边栏树
 * @return {*} tree
 */
function sidebarTransform (tree) {
  tree.forEach((sidebar) => {
    if(sidebar.label && sidebar.label.toLowerCase() === "readme" && sidebar.link) {
      const id = sidebar.link.id;
      const fileNames = id.split('/');
      const dirName = fileNames[fileNames.length - 2] || fileNames[fileNames.length - 1];
      sidebar.label = dirName;
    }
    if(sidebar.items) {
      sidebarTransform(sidebar.items)
    }
  })
}

module.exports = sidebarTransform;