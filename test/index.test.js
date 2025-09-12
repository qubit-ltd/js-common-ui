////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import * as commonUI from '../src/index';

describe('index.js 导出测试', () => {
  test('应该导出所有必要的组件和类', () => {
    // 验证主要组件实例
    expect(commonUI.alert).toBeDefined();
    expect(commonUI.confirm).toBeDefined();
    expect(commonUI.loading).toBeDefined();
    expect(commonUI.prompt).toBeDefined();
    expect(commonUI.notify).toBeDefined();

    // 验证基类
    expect(commonUI.ConfigurableUI).toBeDefined();
    expect(commonUI.AlertImpl).toBeDefined();
    expect(commonUI.ConfirmImpl).toBeDefined();
    expect(commonUI.LoadingImpl).toBeDefined();
    expect(commonUI.PromptImpl).toBeDefined();
    expect(commonUI.NotifyImpl).toBeDefined();

    // 验证工具函数
    expect(commonUI.getCssColor).toBeDefined();
    expect(commonUI.getFontAwesomeIcon).toBeDefined();
    expect(commonUI.getMaterialSymbolIcon).toBeDefined();
    expect(commonUI.getBootstrapIcon).toBeDefined();
  });

  test('导出的类应该是构造函数', () => {
    expect(typeof commonUI.ConfigurableUI).toBe('function');
    expect(typeof commonUI.AlertImpl).toBe('function');
    expect(typeof commonUI.ConfirmImpl).toBe('function');
    expect(typeof commonUI.LoadingImpl).toBe('function');
    expect(typeof commonUI.PromptImpl).toBeDefined();
    expect(typeof commonUI.NotifyImpl).toBe('function');
  });

  test('导出的工具函数应该是函数', () => {
    expect(typeof commonUI.getCssColor).toBe('function');
    expect(typeof commonUI.getFontAwesomeIcon).toBe('function');
    expect(typeof commonUI.getMaterialSymbolIcon).toBe('function');
    expect(typeof commonUI.getBootstrapIcon).toBe('function');
  });

  test('导出的组件实例应该有正确的类型', () => {
    expect(commonUI.alert.constructor.name).toBe('Alert');
    expect(commonUI.confirm.constructor.name).toBe('Confirm');
    expect(commonUI.loading.constructor.name).toBe('Loading');
    expect(commonUI.prompt.constructor.name).toBe('Prompt');
    expect(commonUI.notify.constructor.name).toBe('Notify');
  });

  test('ConfigurableUI应该可以被实例化', () => {
    const instance = new commonUI.ConfigurableUI();
    expect(instance).toBeInstanceOf(commonUI.ConfigurableUI);
    expect(instance.config).toEqual({});
    expect(instance.iconClassMap).toBeNull();
  });

  test('Impl类应该可以被继承', () => {
    class TestAlertImpl extends commonUI.AlertImpl {
      show(type, title, message) {
        return Promise.resolve(`${type}: ${title} - ${message}`);
      }
    }

    const impl = new TestAlertImpl();
    expect(impl).toBeInstanceOf(commonUI.AlertImpl);
    expect(impl).toBeInstanceOf(commonUI.ConfigurableUI);
  });

  test('工具函数应该正常工作', () => {
    expect(commonUI.getCssColor('info')).toBe('#1976D2');
    expect(commonUI.getFontAwesomeIcon('info')).toBe('fa-solid fa-circle-info');
    expect(commonUI.getMaterialSymbolIcon('info')).toBe('info');
    expect(commonUI.getBootstrapIcon('info')).toBe('bi bi-info-circle-fill');
  });
});
