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
import NotifyImpl from './notify-impl';

/**
 * 此类封装了一个消息通知组件。
 *
 * 这个类的功能是在页面上弹出一个消息通知，提示用户一些信息。
 *
 * 不同的UI框架应为此类提供不同的实现对象，参见`NotifyImpl`类。
 *
 * @author 胡海星
 * @see NotifyImpl
 * @see setImpl
 */
class Notify {
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
   * `Notify`类的具体实现对象。
   *
   * @type {NotifyImpl}
   */
  impl = null;

  /**
   * 禁用此对象，即调用其`show()`方法将不起任何作用。
   */
  disable() {
    this.enabled = false;
  }

  /**
   * 启用此对象，即调用其`show()`方法将弹出一个消息通知。
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
   * 启用此对象的调试模式，即{@link debug()}方法将显示调试消息。
   */
  enableDebug() {
    this.debugEnabled = true;
  }

  /**
   * 禁用此对象的调试模式，即{@link debug()}方法不会显示调试消息。
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
   * 返回`Notify`类的具体实现类。
   *
   * @return {NotifyImpl}
   *     `Notify`类的具体实现类。
   */
  getImpl() {
    return this.impl;
  }

  /**
   * 设置`Notify`类的具体实现类。
   *
   * 这个方法用于注入在不同的UI框架中实现的不同的`NotifyImpl`类。
   *
   * 注意：这个方法必须在应用初始化时调用一次，且仅需调用一次。
   *
   * @param {NotifyImpl} impl
   *     `Notify`类的具体实现对象。这个参数必须是一个`NotifyImpl`类的子类的实例，不同的
   *     `NotifyImpl`类的实例可以实现不同的UI框架的弹出式消息消息功能。
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
    if (!(impl instanceof NotifyImpl)) {
      throw new Error('参数`impl`必须是`NotifyImpl`的子类的实例');
    }
    this.impl = impl;
    // 如果提供了配置，则应用到实现对象
    if (config) {
      this.impl.configure(config);
    }
  }

  /**
   * 显示一条通知消息。
   *
   * @param {string} type
   *     消息的类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`。
   * @param {string} message
   *     消息的内容，**支持HTML代码。**
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`() => {}`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`() => {}`。
   */
  show(type, message, options = {}) {
    if (!this.enabled) {
      return;
    }
    loading.clear();
    if (!this.impl) {
      throw new Error('未设置`Notify`类的具体实现对象，请调用`Notify.setImpl()`方法设置');
    }
    const logger = Logger.getLogger('Notify');
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
    const actualOptions = {
      position: 'top-right',
      duration: 3000,
      icon: null,
      closeable: true,
      closeAction: () => {},
      showDetail: false,
      detailLabel: '详情',
      detailAction: () => {},
      ...options,
    };
    this.impl.show(type, message, actualOptions);
  }

  /**
   * 弹出一个显示普通信息的消息。
   *
   * @param {string} message
   *     消息中的文字内容。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`null`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`null`。
   */
  info(message, options = {}) {
    this.show('info', message, options);
  }

  /**
   * 弹出一个显示警告信息的消息。
   *
   * @param {string} message
   *     消息中的文字内容。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`null`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`null`。
   */
  warn(message, options = {}) {
    this.show('warn', message, options);
  }

  /**
   * 弹出一个显示错误信息的消息。
   *
   * @param {string} message
   *     消息中的文字内容。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`null`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`null`。
   */
  error(message, options = {}) {
    this.show('error', message, options);
  }

  /**
   * 弹出一个显示成功信息的消息。
   *
   * @param {string} message
   *     消息中的文字内容。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`null`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`null`。
   */
  success(message, options = {}) {
    this.show('success', message, options);
  }

  /**
   * 弹出一个显示调试信息的消息。
   *
   * @param {string} message
   *     调试信息。
   * @param {object} options
   *     此对象的属性表示，消息框的其他选项，目前支持下述选项：
   *     - `position` {string} 消息的显示位置，可取值为：`'top-left'`, `'top-right'`,
   *       `'bottom-left'`, `'bottom-right'`。默认值为`'top-right'`。
   *     - `duration` {number} 消息显示的持续时间，单位为毫秒。设置为`0`表示永久显示。
   *       默认值为`3000`毫秒。
   *     - `icon` {string} 自定义的消息图标，如不提供则使用`type`参数指定的默认图标。
   *       默认值为`null`。
   *     - `closeable` {boolean} 是否显示关闭消息按钮。默认值为`true`。
   *     - `closeAction` {function} 关闭消息按钮的点击处理函数。默认值为`null`。
   *     - `showDetail` {boolean} 是否显示详细信息按钮。默认值为`false`。
   *     - `detailLabel` {string} 详细信息按钮上的文本。默认值为`'详情'`。
   *     - `detailAction` {function} 详细信息按钮的点击处理函数。默认值为`null`。
   * @see enableDebug
   * @see disableDebug
   * @see isDebugEnabled
   */
  debug(message, options = {}) {
    if (this.debugEnabled) {
      this.show('debug', message, options);
    }
  }
}

/**
 * 全局公用的`Notify`对象。
 *
 * @type {Notify}
 */
const notify = new Notify();

export default notify;
