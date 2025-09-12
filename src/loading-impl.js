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
 * 载入提示遮盖层的具体实现类。
 *
 * 这个具体实现类，需要被子类覆盖实现。不同的UI框架应有不同的实现。
 *
 * @author 胡海星
 */
class LoadingImpl extends ConfigurableUI {
  /**
   * 显示一个载入遮盖层，提示正在载入中。
   *
   * @param {string} message
   *     提示信息。
   */
  show(message) {
    throw new Error(`方法 LoadingImpl.show() 需要被子类覆盖实现: ${message}`);
  }

  /**
   * 清除当前载入提示遮盖层，隐藏载入提示框。
   */
  hide() {
    throw new Error('方法 LoadingImpl.hide() 需要被子类覆盖实现');
  }
}

export default LoadingImpl;
