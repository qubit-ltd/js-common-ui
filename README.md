# @qubit-ltd/common-ui

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/common-ui.svg)](https://npmjs.com/package/@qubit-ltd/common-ui)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/qubit-ltd/js-common-ui/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/qubit-ltd/js-common-ui/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/qubit-ltd/js-common-ui/badge.svg?branch=master)](https://coveralls.io/github/qubit-ltd/js-common-ui?branch=master)

[@qubit-ltd/common-ui] 是一个用于常见UI组件的JavaScript抽象层。该库提供了一组与框架无关的UI组件抽象接口，使您可以在不同的前端框架下使用统一的API来处理常见UI交互。

## 安装

使用npm:
```bash
npm install @qubit-ltd/common-ui
```

或者使用yarn:
```bash
yarn add @qubit-ltd/common-ui
```

## 自定义图标配置

从 v1.15.0 开始，`@qubit-ltd/common-ui` 支持自定义图标配置功能。您可以为不同的消息类型配置自定义的图标CSS类名。

### 基本配置

```javascript
import { alert, confirm, notify, prompt } from '@qubit-ltd/common-ui';
import { QuasarAlertImpl, QuasarConfirmImpl } from '@qubit-ltd/common-ui-quasar';

// 配置自定义图标
const iconConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-info-circle',
    'success': 'fa-solid fa-check-circle',
    'warn': 'fa-solid fa-exclamation-triangle',
    'error': 'fa-solid fa-times-circle',
    'debug': 'fa-solid fa-bug'
  }
};

// 在设置实现时传入配置
alert.setImpl(new QuasarAlertImpl(Dialog), iconConfig);
confirm.setImpl(new QuasarConfirmImpl(Dialog), iconConfig);
```

### 部分自定义配置

您只需要配置想要自定义的图标类型，其他类型将使用默认图标：

```javascript
// 只自定义错误和成功图标
const partialConfig = {
  iconClassMap: {
    'error': 'fa-solid fa-skull-crossbones',
    'success': 'fa-solid fa-thumbs-up'
  }
};

alert.setImpl(new QuasarAlertImpl(Dialog), partialConfig);
```

### 支持的图标库

您可以使用任何CSS图标库：

```javascript
// FontAwesome 图标
const fontAwesomeConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-circle-info',
    'error': 'fa-solid fa-circle-xmark'
  }
};

// Bootstrap Icons
const bootstrapConfig = {
  iconClassMap: {
    'info': 'bi bi-info-circle-fill',
    'error': 'bi bi-x-circle-fill'
  }
};

// Material Icons
const materialConfig = {
  iconClassMap: {
    'info': 'material-icons',
    'error': 'material-icons'
  }
};
```

### 向后兼容

不提供配置时，完全保持原有行为：

```javascript
// 原有方式，使用默认图标
alert.setImpl(new QuasarAlertImpl(Dialog));
```

### 运行时配置更新

您也可以在运行时更新配置：

```javascript
// 获取当前实现并更新配置
const impl = alert.getImpl();
impl.configure({
  iconClassMap: {
    'info': 'new-info-icon',
    'error': 'new-error-icon'
  }
});
```

## 组件说明

### Alert 警告框

`Alert` 组件用于显示警告对话框，通常只有一个"确定"按钮。

```javascript
import { alert } from '@qubit-ltd/common-ui';

// 设置实现对象（根据您使用的UI框架选择适当的实现）
alert.setImpl(yourAlertImpl);

// 或者设置实现对象时同时配置自定义图标
alert.setImpl(yourAlertImpl, {
  iconClassMap: {
    'info': 'fa-solid fa-info-circle',
    'error': 'fa-solid fa-times-circle'
  }
});

// 显示不同类型的警告框
alert.info('信息标题', '这是一条信息内容');
alert.warn('警告标题', '这是一条警告内容');
alert.error('错误标题', '这是一条错误内容');
alert.success('成功标题', '这是一条成功内容');
alert.debug('调试标题', '这是一条调试内容'); // 仅在调试模式下显示

// 自定义确认按钮文本
alert.info('信息标题', '这是一条信息内容', '我知道了');

// 启用/禁用
alert.enable();
alert.disable();

// 启用/禁用调试模式
alert.enableDebug();
alert.disableDebug();
```

### Confirm 确认框

`Confirm` 组件用于显示确认对话框，通常有"确定"和"取消"两个按钮，返回Promise对象。

```javascript
import { confirm } from '@qubit-ltd/common-ui';

// 设置实现对象（根据您使用的UI框架选择适当的实现）
confirm.setImpl(yourConfirmImpl);

// 或者设置实现对象时同时配置自定义图标
confirm.setImpl(yourConfirmImpl, {
  iconClassMap: {
    'warn': 'fa-solid fa-exclamation-triangle',
    'error': 'fa-solid fa-times-circle'
  }
});

// 使用不同类型的确认框
confirm.info('信息标题', '是否确认继续?')
  .then(() => {
    // 用户点击了确认
    console.log('用户确认了操作');
  })
  .catch(() => {
    // 用户点击了取消
    console.log('用户取消了操作');
  });

// 其他类型的确认框
confirm.warn('警告标题', '这个操作有风险，是否继续?');
confirm.error('错误标题', '发生错误，是否重试?');
confirm.success('成功标题', '操作成功，是否查看详情?');
confirm.debug('调试标题', '这是调试信息，是否继续?');

// 自定义按钮文本
confirm.info('信息标题', '是否继续操作?', '是的', '取消');

// 启用/禁用
confirm.enable();
confirm.disable();
```

### Prompt 输入框

`Prompt` 组件用于显示带有输入框的对话框，允许用户输入文本并返回Promise对象。

```javascript
import { prompt } from '@qubit-ltd/common-ui';

// 设置实现对象（根据您使用的UI框架选择适当的实现）
prompt.setImpl(yourPromptImpl);

// 或者设置实现对象时同时配置自定义图标
prompt.setImpl(yourPromptImpl, {
  iconClassMap: {
    'info': 'fa-solid fa-question-circle',
    'error': 'fa-solid fa-exclamation-circle'
  }
});

// 使用不同类型的输入框
prompt.info('信息输入', '请输入您的姓名:')
  .then((value) => {
    // 用户输入了内容并点击确认
    console.log('用户输入:', value);
  })
  .catch(() => {
    // 用户点击了取消
    console.log('用户取消了输入');
  });

// 其他类型的输入框
prompt.warn('警告输入', '请确认操作密码:');
prompt.error('错误输入', '请输入错误报告:');
prompt.success('成功输入', '请输入反馈信息:');
prompt.debug('调试输入', '请输入调试命令:');

// 自定义按钮文本
prompt.info('信息输入', '请输入您的姓名:', '提交', '返回');

// 启用/禁用
prompt.enable();
prompt.disable();
```

### Notify 通知提醒

`Notify` 组件用于显示非阻塞式的通知消息，通常显示在页面角落。

```javascript
import { notify } from '@qubit-ltd/common-ui';

// 设置实现对象（根据您使用的UI框架选择适当的实现）
notify.setImpl(yourNotifyImpl);

// 或者设置实现对象时同时配置自定义图标
notify.setImpl(yourNotifyImpl, {
  iconClassMap: {
    'success': 'fa-solid fa-check',
    'error': 'fa-solid fa-times'
  }
});

// 显示不同类型的通知
notify.info('这是一条信息通知');
notify.warn('这是一条警告通知');
notify.error('这是一条错误通知');
notify.success('这是一条成功通知');
notify.debug('这是一条调试通知'); // 仅在调试模式下显示

// 使用自定义选项
notify.info('这是一条信息通知', {
  duration: 5000,           // 显示持续时间（毫秒）
  position: 'bottom-right', // 显示位置
  closeable: true,          // 是否可关闭
  showDetail: true,         // 是否显示详情按钮
  detailLabel: '更多信息',   // 详情按钮文本
  closeAction: () => {      // 关闭按钮回调
    console.log('通知已关闭');
  },
  detailAction: () => {     // 详情按钮回调
    console.log('查看详情');
  }
});

// 启用/禁用
notify.enable();
notify.disable();

// 启用/禁用调试模式
notify.enableDebug();
notify.disableDebug();
```

### Loading 加载提示

`Loading` 组件用于显示加载状态提示，通常用于异步操作期间。

```javascript
import { loading } from '@qubit-ltd/common-ui';

// 设置实现对象（根据您使用的UI框架选择适当的实现）
loading.setImpl(yourLoadingImpl);

// Loading组件主要用于显示加载状态，通常不需要图标配置
// 但您也可以配置其他选项（如主题、动画等）
loading.setImpl(yourLoadingImpl, {
  theme: 'dark',
  animation: 'spin'
});

// 显示自定义加载提示
loading.show('正在加载数据...');

// 使用预定义的加载提示消息
loading.showGetting('用户信息');   // 显示"正在获取用户信息..."
loading.showAdding('新记录');      // 显示"正在添加新记录..."
loading.showUpdating('配置');      // 显示"正在更新配置..."
loading.showDeleting('旧数据');    // 显示"正在删除旧数据..."
loading.showRestoring('备份');     // 显示"正在恢复备份..."
loading.showPurging('缓存');       // 显示"正在清除缓存..."
loading.showErasing('数据');       // 显示"正在擦除数据..."
loading.showUploading('文件');     // 显示"正在上传文件..."
loading.showDownloading('资源');   // 显示"正在下载资源..."
loading.showImporting('数据');     // 显示"正在导入数据..."
loading.showExporting('报表');     // 显示"正在导出报表..."

// 隐藏加载提示
loading.clear();

// 启用/禁用
loading.enable();
loading.disable();
```

## UI图标和颜色工具函数

库还提供了一些辅助函数，用于获取不同UI框架的图标和颜色：

```javascript
import {
  getBootstrapIcon,
  getFontAwesomeIcon,
  getMaterialSymbolIcon,
  getCssColor
} from '@qubit-ltd/common-ui';

// 获取Bootstrap图标名称
const bootstrapWarningIcon = getBootstrapIcon('warn');  // 'exclamation-triangle'

// 获取Font Awesome图标名称
const fontAwesomeErrorIcon = getFontAwesomeIcon('error');  // 'circle-xmark'

// 获取Material Symbol图标名称
const materialSuccessIcon = getMaterialSymbolIcon('success');  // 'check_circle'

// 获取CSS颜色类名
const errorColorClass = getCssColor('error');  // 'text-danger'
```

## 配置API参考

### ConfigurableUI 基类

所有UI实现类都继承自 `ConfigurableUI` 基类，提供统一的配置管理功能：

```javascript
import { ConfigurableUI } from '@qubit-ltd/common-ui';

class MyCustomImpl extends ConfigurableUI {
  constructor() {
    super(); // 调用基类构造函数
  }

  someMethod() {
    // 获取自定义图标
    const customIcon = this.getCustomIcon('info');
    if (customIcon) {
      // 使用自定义图标
      return `<i class="${customIcon}"></i>`;
    } else {
      // 使用默认图标
      return this.getDefaultIcon('info');
    }
  }
}
```

### 配置方法

#### `configure(config)`

配置UI组件的选项：

```javascript
impl.configure({
  iconClassMap: {
    'info': 'fa-solid fa-info-circle',
    'error': 'fa-solid fa-times-circle'
  },
  theme: 'dark',
  animation: 'fade'
});
```

#### `getCustomIcon(type)`

获取指定消息类型的自定义图标CSS类名：

```javascript
const iconClass = impl.getCustomIcon('error');
// 返回: 'fa-solid fa-times-circle' 或 null（如果未配置）
```

#### `getConfigValue(key, defaultValue)`

获取配置项的值：

```javascript
const theme = impl.getConfigValue('theme', 'light');
const timeout = impl.getConfigValue('timeout', 3000);
```

#### `getConfig()`

获取完整配置对象的副本：

```javascript
const config = impl.getConfig();
console.log(config); // { iconClassMap: {...}, theme: 'dark', ... }
```

### 配置对象结构

```javascript
const config = {
  // 图标配置（所有组件支持）
  iconClassMap: {
    'info': 'CSS类名',      // 信息图标
    'success': 'CSS类名',   // 成功图标
    'warn': 'CSS类名',      // 警告图标
    'error': 'CSS类名',     // 错误图标
    'debug': 'CSS类名'      // 调试图标
  },

  // 其他配置项（根据具体实现支持）
  theme: 'light|dark',           // 主题
  animation: 'fade|slide|none',  // 动画效果
  position: 'top|bottom|center', // 位置
  timeout: 3000,                 // 超时时间
  // ... 更多配置项
};
```

### 支持的消息类型

- `info`: 信息消息
- `success`: 成功消息
- `warn`: 警告消息
- `error`: 错误消息
- `debug`: 调试消息

## 实现自定义UI组件

本库提供了抽象层接口，您需要根据自己使用的前端框架提供具体实现。以下是实现示例：

```javascript
import { NotifyImpl } from '@qubit-ltd/common-ui';

// 为您的UI框架创建实现类
class MyFrameworkNotifyImpl extends NotifyImpl {
  show(type, message, options) {
    // 在您的UI框架中实现通知显示逻辑
    console.log(`显示${type}类型通知: ${message}`, options);

    // 例如，调用框架的Toast组件:
    MyFrameworkToast.show({
      type: type,
      content: message,
      duration: options.duration,
      // 其他配置...
    });
  }
}

// 然后在应用初始化时设置实现对象
import { notify } from '@qubit-ltd/common-ui';
notify.setImpl(new MyFrameworkNotifyImpl());
```

## 贡献

如果您发现任何问题或有改进建议，请随时在[GitHub仓库]上提出Issue或提交Pull Request。

## 许可证

[@qubit-ltd/common-ui]在Apache 2.0许可下分发。
有关更多详细信息，请参阅[LICENSE](LICENSE)文件。

[@qubit-ltd/common-ui]: https://npmjs.com/package/@qubit-ltd/common-ui
[GitHub仓库]: https://github.com/qubit-ltd/js-common-ui
