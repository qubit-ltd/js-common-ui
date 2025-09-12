////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ConfigurableUI from './configurable-ui';

/**
 * 通知消息的具体实现类。
 *
 * 这个具体实现类，需要被子类覆盖实现。不同的UI框架应有不同的实现。
 *
 * @author 胡海星
 */
class NotifyImpl extends ConfigurableUI {
  /**
   * 显示一条通知消息。
   *
   * @param {string} type
   *     消息的类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`。
   * @param {string} message
   *     消息的内容，**支持HTML代码**。但**使用时要小心，防止XSS攻击**。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。
   *     - `detailLabel` {string} 详细信息按钮上的文本。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。
   */
  show(type, message, options) {
    throw new Error(`方法 NotifyImpl.show() 需要被子类覆盖实现: ${type} - ${message} - ${JSON.stringify(options)}`);
  }
}

export default NotifyImpl;
