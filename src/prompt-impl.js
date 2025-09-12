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
 * 弹出式输入对话框的具体实现类。
 *
 * 这个具体实现类，需要被子类覆盖实现。不同的UI框架应有不同的实现。
 *
 * @author 胡海星
 */
class PromptImpl extends ConfigurableUI {
  /**
   * 显示一个弹出式输入对话框。
   *
   * @param {string} type
   *     对话框的消息类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`。
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @param {string} okLabel
   *     可选参数，表示确认按钮的文字。默认值为`'确认'`。
   * @param {string} cancelLabel
   *     可选参数，表示放弃按钮的文字。默认值为`'取消'`。
   * @return {Promise<string>}
   *     一个`Promise`对象，当用户点击对话框的确认按键后，则Promise resolve，可以接着
   *     `then`继续下一步操作，`then`接受一个函数，其参数为用户输入的数据；当用户点击对话
   *     框的放弃按键后，则Promise reject，可以接着`catch`继续下一步操作。如果此对象被禁用，
   *     则返回一个`rejected`状态的`Promise`对象。
   */
  show(type, title, message, okLabel, cancelLabel) {
    throw new Error(`方法 PromptImpl.show() 需要被子类覆盖实现: ${type} - ${title} - ${message} - ${okLabel} - ${cancelLabel}`);
  }
}

export default PromptImpl;
