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
 * 弹出式对话框的具体实现类。
 *
 * 这个具体实现类，需要被子类覆盖实现。不同的UI框架应有不同的实现。
 *
 * @author 胡海星
 */
class AlertImpl extends ConfigurableUI {
  /**
   * 显示一个弹出式对话框。
   *
   * @param {string} type
   *     对话框的类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`。
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   */
  show(type, title, message) {
    throw new Error(`方法 AlertImpl.show() 需要被子类覆盖实现: ${type} - ${title} - ${message}`);
  }
}

export default AlertImpl;
