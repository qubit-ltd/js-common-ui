////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ConfigurableUI from '../src/configurable-ui';

describe('ConfigurableUI', () => {
  let configurableUI;

  beforeEach(() => {
    configurableUI = new ConfigurableUI();
  });

  describe('构造函数', () => {
    test('应该正确初始化', () => {
      expect(configurableUI.config).toEqual({});
      expect(configurableUI.iconClassMap).toBeNull();
    });
  });

  describe('configure方法', () => {
    test('应该正确设置配置', () => {
      const config = {
        iconClassMap: {
          'info': 'fa-solid fa-info',
          'error': 'fa-solid fa-times'
        },
        theme: 'dark'
      };

      configurableUI.configure(config);

      expect(configurableUI.config).toEqual(config);
      expect(configurableUI.iconClassMap).toEqual(config.iconClassMap);
    });

    test('应该支持空配置', () => {
      configurableUI.configure();
      expect(configurableUI.config).toEqual({});
      expect(configurableUI.iconClassMap).toBeNull();
    });

    test('应该支持空对象配置', () => {
      configurableUI.configure({});
      expect(configurableUI.config).toEqual({});
      expect(configurableUI.iconClassMap).toBeNull();
    });

    test('应该合并配置对象', () => {
      // 第一次配置
      configurableUI.configure({
        theme: 'dark',
        animation: 'fade'
      });

      // 第二次配置
      configurableUI.configure({
        theme: 'light',  // 覆盖
        position: 'top'  // 新增
      });

      expect(configurableUI.config).toEqual({
        theme: 'light',
        animation: 'fade',
        position: 'top'
      });
    });

    test('应该合并iconClassMap', () => {
      // 第一次配置
      configurableUI.configure({
        iconClassMap: {
          'info': 'fa-solid fa-info',
          'error': 'fa-solid fa-times'
        }
      });

      // 第二次配置
      configurableUI.configure({
        iconClassMap: {
          'error': 'fa-solid fa-exclamation',  // 覆盖
          'success': 'fa-solid fa-check'       // 新增
        }
      });

      expect(configurableUI.iconClassMap).toEqual({
        'info': 'fa-solid fa-info',
        'error': 'fa-solid fa-exclamation',
        'success': 'fa-solid fa-check'
      });
    });

    test('应该处理null的iconClassMap', () => {
      configurableUI.configure({
        iconClassMap: null
      });

      expect(configurableUI.iconClassMap).toBeNull();
    });

    test('应该处理undefined的iconClassMap', () => {
      configurableUI.configure({
        iconClassMap: undefined
      });

      expect(configurableUI.iconClassMap).toBeNull();
    });

    test('应该在已有iconClassMap基础上添加新配置', () => {
      // 先设置一些图标
      configurableUI.iconClassMap = {
        'warn': 'fa-solid fa-warning'
      };

      configurableUI.configure({
        iconClassMap: {
          'info': 'fa-solid fa-info'
        }
      });

      expect(configurableUI.iconClassMap).toEqual({
        'warn': 'fa-solid fa-warning',
        'info': 'fa-solid fa-info'
      });
    });
  });

  describe('getCustomIcon方法', () => {
    test('应该返回配置的图标', () => {
      configurableUI.configure({
        iconClassMap: {
          'info': 'fa-solid fa-info',
          'error': 'fa-solid fa-times'
        }
      });

      expect(configurableUI.getCustomIcon('info')).toBe('fa-solid fa-info');
      expect(configurableUI.getCustomIcon('error')).toBe('fa-solid fa-times');
    });

    test('未配置的类型应该返回null', () => {
      configurableUI.configure({
        iconClassMap: {
          'info': 'fa-solid fa-info'
        }
      });

      expect(configurableUI.getCustomIcon('error')).toBeNull();
      expect(configurableUI.getCustomIcon('warn')).toBeNull();
    });

    test('没有iconClassMap时应该返回null', () => {
      expect(configurableUI.getCustomIcon('info')).toBeNull();
    });

    test('iconClassMap为null时应该返回null', () => {
      configurableUI.iconClassMap = null;
      expect(configurableUI.getCustomIcon('info')).toBeNull();
    });

    test('应该处理各种消息类型', () => {
      configurableUI.configure({
        iconClassMap: {
          'info': 'icon-info',
          'success': 'icon-success',
          'warn': 'icon-warn',
          'error': 'icon-error',
          'debug': 'icon-debug'
        }
      });

      expect(configurableUI.getCustomIcon('info')).toBe('icon-info');
      expect(configurableUI.getCustomIcon('success')).toBe('icon-success');
      expect(configurableUI.getCustomIcon('warn')).toBe('icon-warn');
      expect(configurableUI.getCustomIcon('error')).toBe('icon-error');
      expect(configurableUI.getCustomIcon('debug')).toBe('icon-debug');
    });
  });

  describe('getConfigValue方法', () => {
    test('应该返回配置的值', () => {
      configurableUI.configure({
        theme: 'dark',
        animation: 'fade',
        timeout: 5000
      });

      expect(configurableUI.getConfigValue('theme')).toBe('dark');
      expect(configurableUI.getConfigValue('animation')).toBe('fade');
      expect(configurableUI.getConfigValue('timeout')).toBe(5000);
    });

    test('不存在的配置项应该返回默认值', () => {
      expect(configurableUI.getConfigValue('nonexistent')).toBeNull();
      expect(configurableUI.getConfigValue('nonexistent', 'default')).toBe('default');
      expect(configurableUI.getConfigValue('nonexistent', 42)).toBe(42);
      expect(configurableUI.getConfigValue('nonexistent', false)).toBe(false);
    });

    test('应该区分undefined和null值', () => {
      configurableUI.configure({
        nullValue: null,
        undefinedValue: undefined,
        falseValue: false,
        zeroValue: 0,
        emptyString: ''
      });

      expect(configurableUI.getConfigValue('nullValue')).toBeNull();
      expect(configurableUI.getConfigValue('undefinedValue', 'default')).toBe('default');
      expect(configurableUI.getConfigValue('falseValue')).toBe(false);
      expect(configurableUI.getConfigValue('zeroValue')).toBe(0);
      expect(configurableUI.getConfigValue('emptyString')).toBe('');
    });
  });

  describe('getConfig方法', () => {
    test('应该返回配置对象的副本', () => {
      const originalConfig = {
        theme: 'dark',
        animation: 'fade',
        iconClassMap: {
          'info': 'fa-solid fa-info'
        }
      };

      configurableUI.configure(originalConfig);
      const returnedConfig = configurableUI.getConfig();

      expect(returnedConfig).toEqual(originalConfig);
      expect(returnedConfig).not.toBe(configurableUI.config); // 应该是副本，不是同一个对象
    });

    test('修改返回的配置不应该影响原配置', () => {
      configurableUI.configure({
        theme: 'dark'
      });

      const returnedConfig = configurableUI.getConfig();
      returnedConfig.theme = 'light';
      returnedConfig.newProperty = 'test';

      expect(configurableUI.config.theme).toBe('dark');
      expect(configurableUI.config.newProperty).toBeUndefined();
    });

    test('空配置应该返回空对象', () => {
      const config = configurableUI.getConfig();
      expect(config).toEqual({});
    });
  });

  describe('复杂场景测试', () => {
    test('应该支持多次配置和获取', () => {
      // 第一次配置
      configurableUI.configure({
        theme: 'dark',
        iconClassMap: {
          'info': 'fa-solid fa-info'
        }
      });

      expect(configurableUI.getCustomIcon('info')).toBe('fa-solid fa-info');
      expect(configurableUI.getConfigValue('theme')).toBe('dark');

      // 第二次配置
      configurableUI.configure({
        theme: 'light',
        iconClassMap: {
          'error': 'fa-solid fa-times'
        }
      });

      expect(configurableUI.getCustomIcon('info')).toBe('fa-solid fa-info'); // 保留
      expect(configurableUI.getCustomIcon('error')).toBe('fa-solid fa-times'); // 新增
      expect(configurableUI.getConfigValue('theme')).toBe('light'); // 覆盖
    });

    test('应该支持清空配置', () => {
      configurableUI.configure({
        theme: 'dark',
        iconClassMap: {
          'info': 'fa-solid fa-info'
        }
      });

      // 清空配置
      configurableUI.config = {};
      configurableUI.iconClassMap = null;

      expect(configurableUI.getCustomIcon('info')).toBeNull();
      expect(configurableUI.getConfigValue('theme')).toBeNull();
      expect(configurableUI.getConfig()).toEqual({});
    });

    test('应该支持复杂的配置结构', () => {
      const complexConfig = {
        theme: {
          primary: '#1976d2',
          secondary: '#424242'
        },
        animation: {
          enter: 'fadeIn',
          exit: 'fadeOut',
          duration: 300
        },
        iconClassMap: {
          'info': 'fa-solid fa-info',
          'error': 'fa-solid fa-times'
        },
        position: 'top-right',
        autoClose: true
      };

      configurableUI.configure(complexConfig);

      expect(configurableUI.getConfigValue('theme')).toEqual(complexConfig.theme);
      expect(configurableUI.getConfigValue('animation')).toEqual(complexConfig.animation);
      expect(configurableUI.getCustomIcon('info')).toBe('fa-solid fa-info');
      expect(configurableUI.getConfigValue('position')).toBe('top-right');
      expect(configurableUI.getConfigValue('autoClose')).toBe(true);
    });
  });
});
