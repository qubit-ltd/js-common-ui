////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 可配置的UI组件基类。
 *
 * 此类提供了统一的配置管理功能，所有UI实现类都应该继承此类以获得配置能力。
 * 目前主要支持图标配置，未来可以扩展支持更多配置选项。
 *
 * @author 胡海星
 */
class ConfigurableUI {
  /**
   * 构造函数。
   */
  constructor() {
    /**
     * 配置对象，存储所有的配置信息。
     *
     * @type {Object}
     */
    this.config = {};

    /**
     * 图标CSS类映射表，用于自定义不同消息类型对应的图标。
     *
     * @type {Object|null}
     */
    this.iconClassMap = null;
  }

  /**
   * 配置UI组件。
   *
   * @param {Object} config
   *     配置对象，支持以下属性：
   *     - `iconClassMap` {Object} 图标CSS类映射表，格式为：
   *       {
   *         'info': 'fa-solid fa-info',
   *         'error': 'fa-solid fa-times-circle',
   *         'warn': 'fa-solid fa-exclamation-triangle',
   *         'success': 'fa-solid fa-check-circle',
   *         'debug': 'fa-solid fa-bug'
   *       }
   */
  configure(config = {}) {
    // 合并配置对象
    this.config = { ...this.config, ...config };

    // 处理图标映射配置
    if (config.iconClassMap) {
      // 支持增量配置和配置覆盖
      this.iconClassMap = {
        ...this.iconClassMap,
        ...config.iconClassMap,
      };
    }
  }

  /**
   * 获取指定消息类型的自定义图标CSS类名。
   *
   * @param {string} type
   *     消息类型，可取值为：`'info'`, `'success'`, `'warn'`, `'error'`, `'debug'`等。
   * @return {string|null}
   *     如果配置了该类型的自定义图标，则返回对应的CSS类名；否则返回`null`。
   */
  getCustomIcon(type) {
    return this.iconClassMap && this.iconClassMap[type]
      ? this.iconClassMap[type]
      : null;
  }

  /**
   * 获取配置项的值。
   *
   * @param {string} key
   *     配置项的键名。
   * @param {*} defaultValue
   *     如果配置项不存在时返回的默认值。
   * @return {*}
   *     配置项的值，如果不存在则返回默认值。
   */
  getConfigValue(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  /**
   * 获取当前的完整配置对象。
   *
   * @return {Object}
   *     当前的配置对象副本。
   */
  getConfig() {
    return { ...this.config };
  }
}

export default ConfigurableUI;
