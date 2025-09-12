////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import alert from '../src/alert';
import AlertImpl from '../src/alert-impl';
import loading from '../src/loading';
import LoadingImpl from '../src/loading-impl';

// 创建一个模拟的AlertImpl实现
class MockAlertImpl extends AlertImpl {
  constructor() {
    super();
    this.showCalls = [];
    this.lastResolve = null;
    this.lastReject = null;
  }

  show(type, title, message) {
    this.showCalls.push({ type, title, message });
    return new Promise((resolve, reject) => {
      this.lastResolve = resolve;
      this.lastReject = reject;
    });
  }

  // 辅助测试方法
  resolveLastCall() {
    if (this.lastResolve) {
      this.lastResolve();
      return true;
    }
    return false;
  }

  rejectLastCall(error) {
    if (this.lastReject) {
      this.lastReject(error);
      return true;
    }
    return false;
  }
}

// 创建一个模拟的LoadingImpl实现
class MockLoadingImpl extends LoadingImpl {
  constructor() {
    super();
    this.showCalls = [];
    this.hideCalls = 0;
  }

  show(message) {
    this.showCalls.push(message);
  }

  hide() {
    this.hideCalls += 1;
  }
}

describe('Alert', () => {
  let mockImpl;
  let mockLoadingImpl;

  beforeEach(() => {
    // 每个测试前重置实现对象
    mockImpl = new MockAlertImpl();
    alert.setImpl(mockImpl);
    alert.enable();

    // 初始化loading模块
    mockLoadingImpl = new MockLoadingImpl();
    loading.setImpl(mockLoadingImpl);
    loading.enable();
  });

  afterEach(() => {
    // 清理
    jest.clearAllMocks();
  });

  test('应该正确初始化', () => {
    expect(alert.isEnabled()).toBe(true);
    expect(alert.isDebugEnabled()).toBe(false);
    expect(alert.getImpl()).toBe(mockImpl);
  });

  test('enable/disable方法应该正确工作', () => {
    alert.disable();
    expect(alert.isEnabled()).toBe(false);

    alert.enable();
    expect(alert.isEnabled()).toBe(true);
  });

  test('enableDebug/disableDebug方法应该正确工作', () => {
    alert.enableDebug();
    expect(alert.isDebugEnabled()).toBe(true);

    alert.disableDebug();
    expect(alert.isDebugEnabled()).toBe(false);
  });

  test('info方法应该正确调用实现对象', async () => {
    const promise = alert.info('测试标题', '测试消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'info',
      title: '测试标题',
      message: '测试消息'
    });

    mockImpl.resolveLastCall();
    await promise; // 等待Promise解析
  });

  test('warn方法应该正确调用实现对象', async () => {
    const promise = alert.warn('警告标题', '警告消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'warn',
      title: '警告标题',
      message: '警告消息'
    });

    mockImpl.resolveLastCall();
    await promise;
  });

  test('error方法应该正确调用实现对象', async () => {
    const promise = alert.error('错误标题', '错误消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'error',
      title: '错误标题',
      message: '错误消息'
    });

    mockImpl.resolveLastCall();
    await promise;
  });

  test('success方法应该正确调用实现对象', async () => {
    const promise = alert.success('成功标题', '成功消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'success',
      title: '成功标题',
      message: '成功消息'
    });

    mockImpl.resolveLastCall();
    await promise;
  });

  test('show方法应该支持默认类型', async () => {
    // 测试默认类型（不在case条件中的类型）
    const promise = alert.show('unknown-type', '测试标题', '测试消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0].type).toBe('unknown-type');

    mockImpl.resolveLastCall();
    await promise;
  });

  test('禁用时show方法应该返回resolved Promise', async () => {
    alert.disable();

    await expect(alert.show('info', '测试标题', '测试消息')).resolves.toBeUndefined();
    expect(mockImpl.showCalls.length).toBe(0); // 不应该调用实现
  });

  test('未设置实现对象时show方法应该返回rejected Promise', async () => {
    alert.impl = null;

    await expect(alert.show('info', '测试标题', '测试消息'))
      .rejects
      .toThrow('未设置`Alert`类的具体实现对象');
  });

  test('debug方法在调试模式禁用时应该返回resolved Promise', async () => {
    await expect(alert.debug('调试消息')).resolves.toBeUndefined();
    expect(mockImpl.showCalls.length).toBe(0); // 不应该调用实现
  });

  test('debug方法在调试模式启用时应该正确调用实现对象', async () => {
    alert.enableDebug();

    const promise = alert.debug('调试消息');

    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'debug',
      title: '调试',
      message: '调试消息'
    });

    mockImpl.resolveLastCall();
    await promise;
  });

  test('setImpl方法应该验证参数类型', () => {
    expect(() => alert.setImpl({})).toThrow('参数`impl`必须是`AlertImpl`的子类的实例');
    expect(() => alert.setImpl(null)).toThrow('参数`impl`必须是`AlertImpl`的子类的实例');
  });

  describe('配置功能测试', () => {
    test('setImpl应该支持config参数', () => {
      const mockImpl = new MockAlertImpl();
      const config = {
        iconClassMap: {
          'info': 'fa-solid fa-info',
          'error': 'fa-solid fa-times'
        }
      };

      // 监听configure方法调用
      const configureSpy = jest.spyOn(mockImpl, 'configure');

      alert.setImpl(mockImpl, config);

      expect(configureSpy).toHaveBeenCalledWith(config);
      expect(alert.getImpl()).toBe(mockImpl);
    });

    test('setImpl不提供config时不应该调用configure', () => {
      const mockImpl = new MockAlertImpl();
      const configureSpy = jest.spyOn(mockImpl, 'configure');

      alert.setImpl(mockImpl);

      expect(configureSpy).not.toHaveBeenCalled();
      expect(alert.getImpl()).toBe(mockImpl);
    });

    test('setImpl提供null config时不应该调用configure', () => {
      const mockImpl = new MockAlertImpl();
      const configureSpy = jest.spyOn(mockImpl, 'configure');

      alert.setImpl(mockImpl, null);

      expect(configureSpy).not.toHaveBeenCalled();
      expect(alert.getImpl()).toBe(mockImpl);
    });

    test('配置应该传递到实现对象', () => {
      const mockImpl = new MockAlertImpl();
      const config = {
        iconClassMap: {
          'info': 'custom-info-icon',
          'error': 'custom-error-icon'
        },
        theme: 'dark'
      };

      alert.setImpl(mockImpl, config);

      expect(mockImpl.config).toEqual(config);
      expect(mockImpl.iconClassMap).toEqual(config.iconClassMap);
      expect(mockImpl.getCustomIcon('info')).toBe('custom-info-icon');
      expect(mockImpl.getCustomIcon('error')).toBe('custom-error-icon');
    });
  });
});