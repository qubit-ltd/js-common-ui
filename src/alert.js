////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Logger } from '@qubit-ltd/logging';
import loading from './loading';
import AlertImpl from './alert-impl';

/**
 * 此类封装了一个弹出式消息对话框。
 *
 * 这个类的功能是在页面上弹出一个消息对话框，提示用户一些信息。
 *
 * 不同的UI框架应为此类提供不同的实现对象，参见`AlertImpl`类。
 *
 * @author 胡海星
 * @see AlertImpl
 * @see setImpl
 */
class Alert {
  /**
   * 表示此对象的功能是否启用。
   */
  enabled = true;

  /**
   * 表示是否启用调试模式。
   *
   * @type {boolean}
   */
  debugEnabled = false;

  /**
   * `Alert`类的具体实现对象。
   *
   * @type {AlertImpl}
   */
  impl = null;

  /**
   * 禁用此对象，即调用其show方法将不起任何作用。
   */
  disable() {
    this.enabled = false;
  }

  /**
   * 启用此对象，即调用其show方法将弹出一个对话框。
   */
  enable() {
    this.enabled = true;
  }

  /**
   * 返回此对象的功能是否启用。
   *
   * @return {boolean}
   *     如果此对象的功能启用，则返回`true`；否则返回`false`。
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * 启用此对象的调试模式，即{@link debug()}方法将显示调试对话框。
   */
  enableDebug() {
    this.debugEnabled = true;
  }

  /**
   * 禁用此对象的调试模式，即{@link debug()}方法不会显示调试对话框。
   */
  disableDebug() {
    this.debugEnabled = false;
  }

  /**
   * 返回此对象的调试模式是否启用。
   *
   * @return {boolean}
   *     如果此对象的调试模式启用，则返回`true`；否则返回`false`。
   */
  isDebugEnabled() {
    return this.debugEnabled;
  }

  /**
   * 返回`Alert`类的具体实现类。
   *
   * @return {AlertImpl}
   *     `Alert`类的具体实现类。
   */
  getImpl() {
    return this.impl;
  }

  /**
   * 设置`Alert`类的具体实现类。
   *
   * 这个方法用于注入在不同的UI框架中实现的不同的`AlertImpl`类。
   *
   * 注意：这个方法必须在应用初始化时调用一次，且仅需调用一次。
   *
   * @param {AlertImpl} impl
   *     `Alert`类的具体实现对象。这个参数必须是一个`AlertImpl`类的子类的实例，不同的
   *     `AlertImpl`类的实例可以实现不同的UI框架的弹出式消息对话框功能。
   * @param {Object} config
   *     可选的配置对象，支持以下属性：
   *     - `iconClassMap` {Object} 图标CSS类映射表，格式为：
   *       {
   *         'info': 'fa-solid fa-info',
   *         'error': 'fa-solid fa-times-circle',
   *         'warn': 'fa-solid fa-exclamation-triangle',
   *         'success': 'fa-solid fa-check-circle',
   *         'debug': 'fa-solid fa-bug'
   *       }
   * @see ConfigurableUI
   */
  setImpl(impl, config = null) {
    if (!(impl instanceof AlertImpl)) {
      throw new Error('参数`impl`必须是`AlertImpl`的子类的实例');
    }
    this.impl = impl;
    // 如果提供了配置，则应用到实现对象
    if (config) {
      this.impl.configure(config);
    }
  }

  /**
   * 显示一个弹出式对话框。
   *
   * 如果此对象被禁用，则不做任何操作，返回一个`rejected`状态的`Promise`对象。
   *
   * 注意：此方法在显示弹出式对话框之前会清除当前的`loading`遮盖层。
   *
   * @param {string} type
   *     对话框的类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`。
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，则返回一个`resolved`状态的`Promise`对象。
   */
  show(type, title, message) {
    if (!this.enabled) {
      // 如果没有启用此对象，则不显示对话框，但应该返回一个resolved状态的Promise对象
      return Promise.resolve();
    }
    loading.clear();
    if (!this.impl) {
      return Promise.reject(new Error('未设置`Alert`类的具体实现对象，请调用`alert.setImpl()`方法设置'));
    }
    const logger = Logger.getLogger('alert');
    switch (type) {
      case 'info':
        logger.info(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      case 'error':
        logger.error(message);
        break;
      case 'success':
        logger.info(message);
        break;
      case 'debug':
        logger.debug(message);
        break;
      default:
        logger.info(message);
        break;
    }
    return this.impl.show(type, title, message);
  }

  /**
   * 弹出一个显示普通信息的对话框。
   *
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，则返回一个`resolved`状态的`Promise`对象。
   */
  info(title, message) {
    return this.show('info', title, message);
  }

  /**
   * 弹出一个显示警告信息的对话框。
   *
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，则返回一个`rejected`状态的`Promise`对象。
   */
  warn(title, message) {
    return this.show('warn', title, message);
  }

  /**
   * 弹出一个显示错误信息的对话框。
   *
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，则返回一个`rejected`状态的`Promise`对象。
   */
  error(title, message) {
    return this.show('error', title, message);
  }

  /**
   * 弹出一个显示成功信息的对话框。
   *
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，则返回一个`rejected`状态的`Promise`对象。
   */
  success(title, message) {
    return this.show('success', title, message);
  }

  /**
   * 弹出一个显示调试信息的对话框。
   *
   * @param {string} message
   *     调试信息。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   *     如果此对象被禁用，或者其调试模式被禁用，则返回一个`rejected`状态的`Promise`对象。
   * @see enableDebug
   * @see disableDebug
   * @see isDebugEnabled
   */
  debug(message) {
    if (!this.debugEnabled) {
      // 如果没有启用调试模式，则不显示调试对话框，但应该返回一个resolved状态的Promise对象
      return Promise.resolve();
    }
    return this.show('debug', '调试', message);
  }
}

/**
 * 全局公用的`Alert`对象。
 *
 * @type {Alert}
 */
const alert = new Alert();

export default alert;
