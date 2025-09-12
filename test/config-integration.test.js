////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import alert from '../src/alert';
import confirm from '../src/confirm';
import notify from '../src/notify';
import prompt from '../src/prompt';
import loading from '../src/loading';
import AlertImpl from '../src/alert-impl';
import ConfirmImpl from '../src/confirm-impl';
import NotifyImpl from '../src/notify-impl';
import PromptImpl from '../src/prompt-impl';
import LoadingImpl from '../src/loading-impl';

// 创建模拟实现类
class MockAlertImpl extends AlertImpl {
  show(type, title, message) {
    return Promise.resolve({ type, title, message });
  }
}

class MockConfirmImpl extends ConfirmImpl {
  show(type, title, message, okLabel, cancelLabel) {
    return Promise.resolve({ type, title, message, okLabel, cancelLabel });
  }
}

class MockNotifyImpl extends NotifyImpl {
  show(type, message, options) {
    return { type, message, options };
  }
}

class MockPromptImpl extends PromptImpl {
  show(type, title, message, okLabel, cancelLabel) {
    return Promise.resolve({ type, title, message, okLabel, cancelLabel });
  }
}

class MockLoadingImpl extends LoadingImpl {
  show(message) {
    this.currentMessage = message;
  }

  hide() {
    this.currentMessage = null;
  }
}

describe('配置功能集成测试', () => {
  const testConfig = {
    iconClassMap: {
      'info': 'test-info-icon',
      'error': 'test-error-icon',
      'warn': 'test-warn-icon',
      'success': 'test-success-icon',
      'debug': 'test-debug-icon'
    },
    theme: 'test-theme',
    animation: 'test-animation'
  };

  afterEach(() => {
    // 清理所有实现
    alert.impl = null;
    confirm.impl = null;
    notify.impl = null;
    prompt.impl = null;
    loading.impl = null;
  });

  describe('Alert配置测试', () => {
    test('应该正确配置Alert实现', () => {
      const impl = new MockAlertImpl();
      alert.setImpl(impl, testConfig);

      expect(impl.config).toEqual(testConfig);
      expect(impl.iconClassMap).toEqual(testConfig.iconClassMap);
      expect(impl.getCustomIcon('info')).toBe('test-info-icon');
      expect(impl.getConfigValue('theme')).toBe('test-theme');
    });

    test('Alert应该支持部分配置', () => {
      const impl = new MockAlertImpl();
      const partialConfig = {
        iconClassMap: {
          'error': 'custom-error-icon'
        }
      };

      alert.setImpl(impl, partialConfig);

      expect(impl.getCustomIcon('error')).toBe('custom-error-icon');
      expect(impl.getCustomIcon('info')).toBeNull();
    });
  });

  describe('Confirm配置测试', () => {
    test('应该正确配置Confirm实现', () => {
      const impl = new MockConfirmImpl();
      confirm.setImpl(impl, testConfig);

      expect(impl.config).toEqual(testConfig);
      expect(impl.iconClassMap).toEqual(testConfig.iconClassMap);
      expect(impl.getCustomIcon('warn')).toBe('test-warn-icon');
    });
  });

  describe('Notify配置测试', () => {
    test('应该正确配置Notify实现', () => {
      const impl = new MockNotifyImpl();
      notify.setImpl(impl, testConfig);

      expect(impl.config).toEqual(testConfig);
      expect(impl.iconClassMap).toEqual(testConfig.iconClassMap);
      expect(impl.getCustomIcon('success')).toBe('test-success-icon');
    });
  });

  describe('Prompt配置测试', () => {
    test('应该正确配置Prompt实现', () => {
      const impl = new MockPromptImpl();
      prompt.setImpl(impl, testConfig);

      expect(impl.config).toEqual(testConfig);
      expect(impl.iconClassMap).toEqual(testConfig.iconClassMap);
      expect(impl.getCustomIcon('debug')).toBe('test-debug-icon');
    });
  });

  describe('Loading配置测试', () => {
    test('应该正确配置Loading实现', () => {
      const impl = new MockLoadingImpl();
      loading.setImpl(impl, testConfig);

      expect(impl.config).toEqual(testConfig);
      expect(impl.getConfigValue('theme')).toBe('test-theme');
      expect(impl.getConfigValue('animation')).toBe('test-animation');
    });

    test('Loading配置不包含iconClassMap时应该正常工作', () => {
      const impl = new MockLoadingImpl();
      const loadingConfig = {
        theme: 'loading-theme',
        spinner: 'dots'
      };

      loading.setImpl(impl, loadingConfig);

      expect(impl.config).toEqual(loadingConfig);
      expect(impl.iconClassMap).toBeNull();
      expect(impl.getConfigValue('theme')).toBe('loading-theme');
      expect(impl.getConfigValue('spinner')).toBe('dots');
    });
  });

  describe('多组件配置测试', () => {
    test('不同组件应该可以有不同的配置', () => {
      const alertImpl = new MockAlertImpl();
      const confirmImpl = new MockConfirmImpl();

      const alertConfig = {
        iconClassMap: { 'info': 'alert-info-icon' },
        theme: 'alert-theme'
      };

      const confirmConfig = {
        iconClassMap: { 'info': 'confirm-info-icon' },
        theme: 'confirm-theme'
      };

      alert.setImpl(alertImpl, alertConfig);
      confirm.setImpl(confirmImpl, confirmConfig);

      expect(alertImpl.getCustomIcon('info')).toBe('alert-info-icon');
      expect(alertImpl.getConfigValue('theme')).toBe('alert-theme');

      expect(confirmImpl.getCustomIcon('info')).toBe('confirm-info-icon');
      expect(confirmImpl.getConfigValue('theme')).toBe('confirm-theme');
    });

    test('配置应该相互独立', () => {
      const alertImpl = new MockAlertImpl();
      const confirmImpl = new MockConfirmImpl();

      alert.setImpl(alertImpl, {
        iconClassMap: { 'info': 'alert-icon' }
      });

      confirm.setImpl(confirmImpl, {
        iconClassMap: { 'error': 'confirm-icon' }
      });

      expect(alertImpl.getCustomIcon('info')).toBe('alert-icon');
      expect(alertImpl.getCustomIcon('error')).toBeNull();

      expect(confirmImpl.getCustomIcon('error')).toBe('confirm-icon');
      expect(confirmImpl.getCustomIcon('info')).toBeNull();
    });
  });

  describe('配置更新测试', () => {
    test('应该支持重新配置', () => {
      const impl = new MockAlertImpl();

      // 第一次配置
      alert.setImpl(impl, {
        iconClassMap: { 'info': 'first-icon' },
        theme: 'first-theme'
      });

      expect(impl.getCustomIcon('info')).toBe('first-icon');
      expect(impl.getConfigValue('theme')).toBe('first-theme');

      // 重新配置
      impl.configure({
        iconClassMap: { 'error': 'second-icon' },
        theme: 'second-theme'
      });

      expect(impl.getCustomIcon('info')).toBe('first-icon'); // 保留
      expect(impl.getCustomIcon('error')).toBe('second-icon'); // 新增
      expect(impl.getConfigValue('theme')).toBe('second-theme'); // 覆盖
    });
  });

  describe('错误处理测试', () => {
    test('无效配置应该被忽略', () => {
      const impl = new MockAlertImpl();

      alert.setImpl(impl, {
        iconClassMap: null,
        theme: undefined
      });

      expect(impl.iconClassMap).toBeNull();
      expect(impl.getConfigValue('theme')).toBeNull();
    });

    test('空配置应该正常工作', () => {
      const impl = new MockAlertImpl();

      alert.setImpl(impl, {});

      expect(impl.config).toEqual({});
      expect(impl.iconClassMap).toBeNull();
    });
  });
});
