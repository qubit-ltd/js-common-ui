////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import LoadingImpl from './loading-impl';

/**
 * 此类封装了一个载入提示遮盖层。
 *
 * 这个类的功能是在页面上显示一个遮盖层，提示用户正在载入中。
 *
 * 不同的UI框架应为此类提供不同的实现对象，参见`LoadingImpl`类。
 *
 * @author 胡海星
 * @see LoadingImpl
 * @see setImpl
 */
class Loading {
  /**
   * 表示此对象的功能是否启用。
   */
  enabled = true;

  /**
   * `Loading`类的具体实现对象。
   *
   * @type {LoadingImpl}
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
   * 返回`Loading`类的具体实现类。
   *
   * @return {LoadingImpl}
   *     `Loading`类的具体实现类。
   */
  getImpl() {
    return this.impl;
  }

  /**
   * 设置`Loading`类的具体实现类。
   *
   * 这个方法用于注入在不同的UI框架中实现的不同的`LoadingImpl`类。
   *
   * 注意：这个方法必须在应用初始化时调用一次，且仅需调用一次。
   *
   * @param {LoadingImpl} impl
   *     `Loading`类的具体实现对象。这个参数必须是一个`LoadingImpl`类的子类的实例，不同的
   *     `LoadingImpl`类的实例可以实现不同的UI框架的载入提示遮盖层功能。
   * @param {Object} config
   *     可选的配置对象，暂时没有支持的属性，但未来可以扩展支持更多配置选项。
   * @see ConfigurableUI
   */
  setImpl(impl, config = null) {
    if (!(impl instanceof LoadingImpl)) {
      throw new Error('参数`impl`必须是`LoadingImpl`的子类的实例');
    }
    this.impl = impl;
    // 如果提供了配置，则应用到实现对象
    if (config) {
      this.impl.configure(config);
    }
  }

  /**
   * 显示一个遮盖层，提示正在载入中。
   *
   * 如果此对象被禁用，则不做任何操作。
   *
   * @param {string} message
   *     提示信息。
   */
  show(message) {
    if (!this.enabled) {
      return;
    }
    if (!this.impl) {
      throw new Error('未设置`Loading`类的具体实现对象，请调用`loading.setImpl()`方法设置');
    }
    this.impl.show(message);
  }

  /**
   * 显示一个遮盖层，提示正在获取数据。
   */
  showGetting() {
    this.show('正在获取数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在提交数据。
   */
  showAdding() {
    this.show('正在添加数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在更新数据。
   */
  showUpdating() {
    this.show('正在更新数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在删除数据。
   */
  showDeleting() {
    this.show('正在删除数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在恢复数据。
   */
  showRestoring() {
    this.show('正在恢复数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在清除已删除的数据。
   */
  showPurging() {
    this.show('正在清除已删除的数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在清除数据。
   */
  showErasing() {
    this.show('正在清除数据，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在上传数据。
   */
  showUploading() {
    this.show('正在上传，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在下载数据。
   */
  showDownloading() {
    this.show('正在下载，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在导入数据。
   */
  showImporting() {
    this.show('正在导入，请稍后……');
  }

  /**
   * 显示一个遮盖层，提示正在导出数据。
   */
  showExporting() {
    this.show('正在导出，请稍后……');
  }

  /**
   * 清除当前Loading的遮盖层，隐藏Loading提示框。
   *
   * 如果此对象被禁用，则不做任何操作。
   */
  clear() {
    if (!this.enabled) {
      return;
    }
    if (!this.impl) {
      throw new Error('未设置`Loading`类的具体实现对象，请调用`loading.setImpl()`方法设置');
    }
    this.impl.hide();
  }
}

/**
 * 全局公用的`Loading`对象。
 *
 * @type {Loading}
 */
const loading = new Loading();

export default loading;
