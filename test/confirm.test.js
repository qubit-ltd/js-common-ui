////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import confirm from '../src/confirm';
import ConfirmImpl from '../src/confirm-impl';
import loading from '../src/loading';
import LoadingImpl from '../src/loading-impl';

// 创建一个模拟的ConfirmImpl实现
class MockConfirmImpl extends ConfirmImpl {
  constructor() {
    super();
    this.showCalls = [];
    this.lastResolve = null;
    this.lastReject = null;
  }

  show(type, title, message, okLabel, cancelLabel) {
    this.showCalls.push({ type, title, message, okLabel, cancelLabel });
    return new Promise((resolve, reject) => {
      this.lastResolve = resolve;
      this.lastReject = reject;
    });
  }

  // 辅助测试方法 - 模拟用户点击"确认"
  resolveLastCall(data) {
    if (this.lastResolve) {
      this.lastResolve(data);
      return true;
    }
    return false;
  }

  // 辅助测试方法 - 模拟用户点击"取消"
  rejectLastCall(error) {
    if (this.lastReject) {
      this.lastReject(error || new Error('用户取消'));
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

describe('Confirm', () => {
  let mockImpl;
  let mockLoadingImpl;
  const DEFAULT_OK_LABEL = '确认';
  const DEFAULT_CANCEL_LABEL = '取消';

  beforeEach(() => {
    // 每个测试前重置实现对象
    mockImpl = new MockConfirmImpl();
    confirm.setImpl(mockImpl);
    confirm.enable();
    
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
    expect(confirm.isEnabled()).toBe(true);
    expect(confirm.getImpl()).toBe(mockImpl);
  });

  test('enable/disable方法应该正确工作', () => {
    confirm.disable();
    expect(confirm.isEnabled()).toBe(false);
    
    confirm.enable();
    expect(confirm.isEnabled()).toBe(true);
  });

  test('info方法应该正确调用实现对象', async () => {
    const promise = confirm.info('测试标题', '测试消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'info',
      title: '测试标题',
      message: '测试消息',
      okLabel: DEFAULT_OK_LABEL,
      cancelLabel: DEFAULT_CANCEL_LABEL
    });
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('warn方法应该正确调用实现对象', async () => {
    const promise = confirm.warn('警告标题', '警告消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'warn',
      title: '警告标题',
      message: '警告消息',
      okLabel: DEFAULT_OK_LABEL,
      cancelLabel: DEFAULT_CANCEL_LABEL
    });
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('error方法应该正确调用实现对象', async () => {
    const promise = confirm.error('错误标题', '错误消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'error',
      title: '错误标题',
      message: '错误消息',
      okLabel: DEFAULT_OK_LABEL,
      cancelLabel: DEFAULT_CANCEL_LABEL
    });
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('success方法应该正确调用实现对象', async () => {
    const promise = confirm.success('成功标题', '成功消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'success',
      title: '成功标题',
      message: '成功消息',
      okLabel: DEFAULT_OK_LABEL,
      cancelLabel: DEFAULT_CANCEL_LABEL
    });
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('debug类型应该正确调用日志', async () => {
    const promise = confirm.show('debug', '调试标题', '调试消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0].type).toBe('debug');
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('show方法应该支持默认类型', async () => {
    // 测试默认类型（不在case条件中的类型）
    const promise = confirm.show('unknown-type', '测试标题', '测试消息');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0].type).toBe('unknown-type');
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('info方法应该支持自定义按钮文本', async () => {
    const promise = confirm.info('测试标题', '测试消息', '是', '否');
    
    expect(mockImpl.showCalls.length).toBe(1);
    expect(mockImpl.showCalls[0]).toEqual({
      type: 'info',
      title: '测试标题',
      message: '测试消息',
      okLabel: '是',
      cancelLabel: '否'
    });
    
    mockImpl.resolveLastCall();
    await promise;
  });

  test('当用户点击确认按钮时Promise应该resolve', async () => {
    const promise = confirm.info('测试标题', '测试消息');
    
    mockImpl.resolveLastCall();
    await expect(promise).resolves.toBeUndefined();
  });

  test('当用户点击取消按钮时Promise应该reject', async () => {
    const promise = confirm.info('测试标题', '测试消息');
    
    mockImpl.rejectLastCall(new Error('用户取消'));
    await expect(promise).rejects.toThrow('用户取消');
  });

  test('禁用时show方法应该返回rejected Promise', async () => {
    confirm.disable();
    
    await expect(confirm.show('info', '测试标题', '测试消息'))
      .rejects
      .toThrow('Confirm功能已被禁用');
    
    expect(mockImpl.showCalls.length).toBe(0); // 不应该调用实现
  });

  test('未设置实现对象时show方法应该返回rejected Promise', async () => {
    confirm.impl = null;
    
    await expect(confirm.show('info', '测试标题', '测试消息'))
      .rejects
      .toThrow('未设置`Confirm`类的具体实现对象');
  });

  test('show方法应该调用loading.clear', () => {
    confirm.show('info', '测试标题', '测试消息');
    
    expect(mockLoadingImpl.hideCalls).toBe(1);
  });

  test('setImpl方法应该验证参数类型', () => {
    expect(() => confirm.setImpl({})).toThrow('参数`impl`必须是`ConfirmImpl`的子类的实例');
    expect(() => confirm.setImpl(null)).toThrow('参数`impl`必须是`ConfirmImpl`的子类的实例');
  });
}); 