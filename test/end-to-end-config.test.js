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
import loading from '../src/loading';
import AlertImpl from '../src/alert-impl';
import ConfirmImpl from '../src/confirm-impl';
import LoadingImpl from '../src/loading-impl';

/**
 * 端到端配置测试
 *
 * 这些测试模拟真实使用场景，验证配置功能从设置到使用的完整流程
 */

// 模拟一个真实的UI框架实现，会使用自定义图标配置
class RealisticAlertImpl extends AlertImpl {
  constructor() {
    super();
    this.lastCall = null;
  }

  show(type, title, message) {
    // 模拟真实实现中如何使用自定义图标
    const customIcon = this.getCustomIcon(type);
    const iconToUse = customIcon || this.getDefaultIcon(type);

    this.lastCall = {
      type,
      title,
      message,
      iconUsed: iconToUse,
      hasCustomIcon: !!customIcon
    };

    return Promise.resolve(this.lastCall);
  }

  getDefaultIcon(type) {
    const defaultIcons = {
      'info': 'default-info',
      'error': 'default-error',
      'warn': 'default-warn',
      'success': 'default-success',
      'debug': 'default-debug'
    };
    return defaultIcons[type] || 'default-unknown';
  }
}

class RealisticConfirmImpl extends ConfirmImpl {
  constructor() {
    super();
    this.lastCall = null;
  }

  show(type, title, message, okLabel, cancelLabel) {
    const customIcon = this.getCustomIcon(type);
    const iconToUse = customIcon || this.getDefaultIcon(type);

    this.lastCall = {
      type,
      title,
      message,
      okLabel,
      cancelLabel,
      iconUsed: iconToUse,
      hasCustomIcon: !!customIcon
    };

    return Promise.resolve(this.lastCall);
  }

  getDefaultIcon(type) {
    const defaultIcons = {
      'info': 'default-confirm-info',
      'error': 'default-confirm-error',
      'warn': 'default-confirm-warn',
      'success': 'default-confirm-success',
      'debug': 'default-confirm-debug'
    };
    return defaultIcons[type] || 'default-confirm-unknown';
  }
}

// 模拟 Loading 实现
class MockLoadingImpl extends LoadingImpl {
  show(message) {
    this.currentMessage = message;
  }

  hide() {
    this.currentMessage = null;
  }
}

describe('端到端配置功能测试', () => {
  beforeEach(() => {
    // 设置 loading 实现以避免测试中的错误
    loading.setImpl(new MockLoadingImpl());
  });

  afterEach(() => {
    // 清理
    alert.impl = null;
    confirm.impl = null;
    loading.impl = null;
  });

  describe('完整的配置流程', () => {
    test('从配置到使用的完整流程 - Alert', async () => {
      // 1. 创建实现并配置自定义图标
      const impl = new RealisticAlertImpl();
      const config = {
        iconClassMap: {
          'info': 'custom-fa-info',
          'error': 'custom-fa-error'
        },
        theme: 'dark',
        animation: 'slideIn'
      };

      alert.setImpl(impl, config);

      // 2. 使用配置了自定义图标的类型
      await alert.info('测试标题', '测试消息');

      expect(impl.lastCall).toEqual({
        type: 'info',
        title: '测试标题',
        message: '测试消息',
        iconUsed: 'custom-fa-info',
        hasCustomIcon: true
      });

      // 3. 使用没有配置自定义图标的类型（应该使用默认图标）
      await alert.success('成功标题', '成功消息');

      expect(impl.lastCall).toEqual({
        type: 'success',
        title: '成功标题',
        message: '成功消息',
        iconUsed: 'default-success',
        hasCustomIcon: false
      });

      // 4. 验证配置确实生效
      expect(impl.getCustomIcon('info')).toBe('custom-fa-info');
      expect(impl.getCustomIcon('error')).toBe('custom-fa-error');
      expect(impl.getCustomIcon('success')).toBeNull();
      expect(impl.getConfigValue('theme')).toBe('dark');
    });

    test('从配置到使用的完整流程 - Confirm', async () => {
      const impl = new RealisticConfirmImpl();
      const config = {
        iconClassMap: {
          'warn': 'custom-warning-icon',
          'error': 'custom-danger-icon'
        }
      };

      confirm.setImpl(impl, config);

      // 使用自定义图标
      await confirm.warn('警告', '确定要删除吗？', '删除', '取消');

      expect(impl.lastCall).toEqual({
        type: 'warn',
        title: '警告',
        message: '确定要删除吗？',
        okLabel: '删除',
        cancelLabel: '取消',
        iconUsed: 'custom-warning-icon',
        hasCustomIcon: true
      });

      // 使用默认图标
      await confirm.info('信息', '确定要继续吗？');

      expect(impl.lastCall.iconUsed).toBe('default-confirm-info');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });
  });

  describe('实际使用场景模拟', () => {
    test('FontAwesome图标配置场景', async () => {
      const impl = new RealisticAlertImpl();

      // 模拟使用FontAwesome图标的配置
      alert.setImpl(impl, {
        iconClassMap: {
          'info': 'fa-solid fa-circle-info',
          'success': 'fa-solid fa-circle-check',
          'warn': 'fa-solid fa-triangle-exclamation',
          'error': 'fa-solid fa-circle-xmark',
          'debug': 'fa-solid fa-bug'
        }
      });

      // 测试各种消息类型
      const testCases = [
        { method: 'info', expectedIcon: 'fa-solid fa-circle-info' },
        { method: 'success', expectedIcon: 'fa-solid fa-circle-check' },
        { method: 'warn', expectedIcon: 'fa-solid fa-triangle-exclamation' },
        { method: 'error', expectedIcon: 'fa-solid fa-circle-xmark' }
      ];

      for (const testCase of testCases) {
        await alert[testCase.method]('标题', '消息');
        expect(impl.lastCall.iconUsed).toBe(testCase.expectedIcon);
        expect(impl.lastCall.hasCustomIcon).toBe(true);
      }
    });

    test('Bootstrap Icons配置场景', async () => {
      const impl = new RealisticConfirmImpl();

      // 模拟使用Bootstrap Icons的配置
      confirm.setImpl(impl, {
        iconClassMap: {
          'info': 'bi bi-info-circle-fill',
          'success': 'bi bi-check-circle-fill',
          'warn': 'bi bi-exclamation-triangle-fill',
          'error': 'bi bi-x-circle-fill'
        }
      });

      await confirm.error('错误', '操作失败');
      expect(impl.lastCall.iconUsed).toBe('bi bi-x-circle-fill');
      expect(impl.lastCall.hasCustomIcon).toBe(true);
    });

    test('部分自定义配置场景', async () => {
      const impl = new RealisticAlertImpl();

      // 只自定义错误图标，其他使用默认
      alert.setImpl(impl, {
        iconClassMap: {
          'error': 'custom-error-skull'
        }
      });

      // 自定义的错误图标
      await alert.error('错误', '出现错误');
      expect(impl.lastCall.iconUsed).toBe('custom-error-skull');
      expect(impl.lastCall.hasCustomIcon).toBe(true);

      // 默认的信息图标
      await alert.info('信息', '普通信息');
      expect(impl.lastCall.iconUsed).toBe('default-info');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });
  });

  describe('配置更新场景', () => {
    test('运行时更新配置', async () => {
      const impl = new RealisticAlertImpl();

      // 初始配置
      alert.setImpl(impl, {
        iconClassMap: {
          'info': 'initial-info-icon'
        }
      });

      await alert.info('测试', '初始配置');
      expect(impl.lastCall.iconUsed).toBe('initial-info-icon');

      // 运行时更新配置
      impl.configure({
        iconClassMap: {
          'info': 'updated-info-icon',
          'error': 'new-error-icon'
        }
      });

      await alert.info('测试', '更新后配置');
      expect(impl.lastCall.iconUsed).toBe('updated-info-icon');

      await alert.error('错误', '新的错误图标');
      expect(impl.lastCall.iconUsed).toBe('new-error-icon');
    });

    test('配置合并行为', async () => {
      const impl = new RealisticAlertImpl();

      // 第一次配置
      alert.setImpl(impl, {
        iconClassMap: {
          'info': 'first-info',
          'warn': 'first-warn'
        }
      });

      // 第二次配置（应该合并）
      impl.configure({
        iconClassMap: {
          'info': 'second-info',  // 覆盖
          'error': 'second-error' // 新增
        }
      });

      await alert.info('测试', '信息');
      expect(impl.lastCall.iconUsed).toBe('second-info'); // 被覆盖

      await alert.warn('测试', '警告');
      expect(impl.lastCall.iconUsed).toBe('first-warn'); // 保留

      await alert.error('测试', '错误');
      expect(impl.lastCall.iconUsed).toBe('second-error'); // 新增
    });
  });

  describe('边界情况和错误处理', () => {
    test('无配置时应该使用默认图标', async () => {
      const impl = new RealisticAlertImpl();
      alert.setImpl(impl); // 不提供配置

      await alert.info('测试', '无配置');
      expect(impl.lastCall.iconUsed).toBe('default-info');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });

    test('空配置时应该使用默认图标', async () => {
      const impl = new RealisticAlertImpl();
      alert.setImpl(impl, {}); // 空配置

      await alert.info('测试', '空配置');
      expect(impl.lastCall.iconUsed).toBe('default-info');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });

    test('null iconClassMap应该使用默认图标', async () => {
      const impl = new RealisticAlertImpl();
      alert.setImpl(impl, {
        iconClassMap: null
      });

      await alert.info('测试', 'null配置');
      expect(impl.lastCall.iconUsed).toBe('default-info');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });

    test('未知消息类型应该处理正确', async () => {
      const impl = new RealisticAlertImpl();
      alert.setImpl(impl, {
        iconClassMap: {
          'info': 'custom-info'
        }
      });

      // 直接调用show方法测试未知类型
      await impl.show('unknown-type', '标题', '消息');
      expect(impl.lastCall.iconUsed).toBe('default-unknown');
      expect(impl.lastCall.hasCustomIcon).toBe(false);
    });
  });
});
