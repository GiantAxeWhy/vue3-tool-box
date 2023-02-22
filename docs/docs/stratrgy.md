# 组件设计原则

组件是对数据和方法的简单封装，是软件中具有相对独立功能、接口由契约指定、和语境有明显依赖关系、可独立部署、可组装的软件实体。
组件需要具备的特性：功能独立、约定一致、可集成、服务于场景。

在软件工程中，软件设计是软件开发流程中的必要阶段，在需求分析后、软件开发前进行。软件复杂度是每一个项目演进的产物，随着需求和代码行数的增加，复杂度将持续提升。软件设计的优劣为对复杂度带来的影响是不同的，优雅、合理的设计使待开发的代码复杂度可控，而拙劣的设计将会给软件带来无序、偶然的复杂度变更。一个优秀的前端组件需要在满足需求的前提下，具备高易用性和良好的可扩展性，这是我们进行前端组件设计的目标。

## 如何提升组件易用性

### 合理的组件封装

组件既生于页面，又能够独立于页面。我们不能将整个页面杂糅为一个组件，也不能将每一小块 UI 都封装为组件。前端组件按类型可以分为容器组件、功能组件和展示组件，一个优秀的组件应该保证：功能内聚、样式统一、并且与父元素仅通过 Props 通信。

组件的封装粒度并不是越小越好，很多时候一个组件是在其他一个或多个组件的基础上开发的，无法完全以功能点的数量衡量是否遵循单一职责原则，组件开发者需要根据组件功能和目标来确定组件封装粒度：

1、当该组件需要承载具体的额外功能时，相较于新增 API ，封装成独立的组件是更好的选择。

例如：InputTag 组件 在 Input、Tag 的基础上，增加了部分交互功能，API 整合了两个组件的属性，作为一个全新的组件提供给开发者使用。相似的，InputNumber、AutoComplete、Mentions 等组件也是基于单一职责原则封装的特定功能组件。

2、当组件中存在可能被单独使用、可以承载独立功能的子组件时，可以将其以内部组件的形式提供。

例如：图片预览功能通常依托着图片组件使用，在实际系统中，唤起图片预览的触发器不一定是图片，可能是按钮或其他触发事件，因此预览组件需要单独提供给开发者使用。预览组件作为 Image 的内部组件，开发者能够以 Image.Preview、Image.PreviewGroup 的方式使用，并提供左右切换、图片缩放等功能，用户可以通过 srcList、visible、actions、scales 等 API 来控制并定制化预览组件。

### 规范的 API 编写

1、减少必填的 API 项，尽可能多地提供默认值，降低组件的使用成本；

2、使用通用且有意义的 API 命名：
onXXX：命名监听/触发方法
renderXXX：命名渲染方法
beforeXXX/afterXXX：命名前置/后置动作
xxxProps：命名子组件属性
优先使用常见单词进行命名，如：value、visible、size、disabled、label、type 等等

3、单独维护类型文件，并将其打包至组件产物包中，这样使用者在开发过程中能够实时看到对应的类型提示；

4、在类型文件中，为 API 编写注释；

### [Slot] 与 [Props] 的选择

Props 存在的问题？

当我们需要实现一个较为复杂的卡片需求组件时，为了最大程度地还原 UI、减少用户的样式开发成本，首次设计时我们会设计出这样的 API：

```typescript
export type CardProps = {
  // 底部信息展示
  infoProps?: {
    title?: ReactNode;
    content?: ReactNode;
  };
  // 弹层信息展示
  moreInfoProps?: {
    info?: ReactNode;
    triggerProps?: TriggerProps;
    descriptionsProps?: DescriptionsProps;
  };
  className?: string;
  style?: CSSStyleSheet;
  width?: number | string;
  imageProps?: {
    srcList?: Array<SrcList>; // 图片url数组
    afterImgs?: React.ReactNode; // 插槽，在图片dom节点中
    aspectRatio?: string; // 宽高比  默认3:4
    buttonProps?: ButtonProps;
    current?: number; // 受控展示图
    defaultCurrent?: number; // 默认展示图
    onChangeCurrent?: (current: number) => undefined; // 设置current
    PreviewGroupProps?: ImagePreviewGroupProps;
    src?: string;
  };
  children?: React.ReactNode;
} & CardCheckboxProps;
```

可以看到，这个业务卡片组件是由多个不同组件组合而成，其承载了渲染和操作（选中操作、图片切换和弹层操作），这个设计的缺陷是显而易见的：

1、需要编写很多分散的 JSX 代码，无论是写在 Props 中还是定义成单独的组件，其可读性都不高；
2、需要在 Card 组件中杂糅许多额外的 Props，例如 triggerProps 和 descriptionsProps，增加了该组件的学习成本；

如果以插槽的方式对 Card 组件进行改造，通过内部组件间的组合来实现需求，避免了大量组件 Props 的堆砌，层次清晰、可读性高，这样的组件结构明显易用性更高。

```js
<Card type="verticle" {...cardProps}>
  <CardImage {...ImageProps} />
  <CardContent {...InfoProps}>
    <div className="card-title">title</div>
    <div className="card-content">content</div>
    <Tag>Tag</Tag>
  </CardContent>
  <CardTrigger {...triggerProps}>
    <Description {...descriptionProps} />
  </CardTrigger>
</Card>
```

Slot 插槽
Slot 是 Vue 框架提出的概念，可以理解为临时占位，可以用其他组件进行填充，Slot 能够实现父组件向子组件分发内容的功能。Vue 框架中提供了

1、使用 props.children 获取子组件，若需要区分使用不同子组件，只能通过数组下标读取。
2、使用 Props 传递 ReactNode 元素。
3、将组件划分为多个内部组件，交由开发者自行组装。

使用时机

- 布局类组件优先使用 Slot，为开发者提供更灵活的使用方式，参考 Typography、Layout、Card 等组件，开发者可以随意地在这些组件内部插入自定义实现。上文提到的业务卡片组件，实质上也是一个封装了多图预览功能的布局组件，因此更适合使用 Slot 来组织代码。
- 内容复杂、定制化程度高的组件更适合使用 Slot
- 功能类组件中，以 Props 传递 ReactNode 的方式来接管内部元素，尽量避免传递基础类型元素进行展示。

### 组件可扩展性

- 开闭原则：对扩展开放，模块的行为可以被扩展；对修改关闭，模块中的源代码不应该被修改

#### 将 DOM 交予用户接管

在前端组件中，应该提供对应的 API 属性或方法来支持额外的功能，给予开发者更充分的扩展空间，而不是有部分需求无法满足时放弃使用组件。可参照 Cascader 组件

#### 设计可扩展的 API

组件开发前，整理组件所需实现的功能，并以功能为维度设计组件 API。
