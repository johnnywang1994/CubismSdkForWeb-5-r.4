/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';
import { LAppLive2DManager } from './lapplive2dmanager';

export interface InitLive2dOptions {
  el?: string;
  size?: string;
  quality?: number;
  resourcesPath?: string;
  modelDir?: string[];
  modelFileName?: string;
  modelJsonExtension?: string;
  bindFullscreen?: boolean;
  canvasNum?: number;
}

/**
 * Helper function to get the Live2DManager from the first subdelegate
 */
const getLive2DManagerInstance = (): LAppLive2DManager | null => {
  const delegate = LAppDelegate.getInstance();
  // Access through reflection since _subdelegates is private
  const anyDelegate = delegate as any;
  if (anyDelegate._subdelegates && anyDelegate._subdelegates.getSize() > 0) {
    return anyDelegate._subdelegates.at(0).getLive2DManager();
  }
  return null;
};

const initLive2d = (options: InitLive2dOptions = {}) => {
  // 初始化配置
  LAppDefine.initConfig(options);

  /**
   * ブラウザロード後の処理
   */
  const onload = (): void => {
    // create the application instance
    if (LAppDelegate.getInstance().initialize(options) == false) {
      return;
    }

    LAppDelegate.getInstance().run();
  };

  /**
   * 終了時の処理
   */
  const onbeforeunload = (): void => LAppDelegate.releaseInstance();

  /**
   * Process when changing screen size.
   */
  const onresize = () => {
    if (options.size === 'auto') {
      LAppDelegate.getInstance().onResize();
    }
  };

  /**
   * 取得所有可用的 motion 群組和內部 motion 數量
   * @returns { groupName: string, count: number }[]
   */
  const getAvailableMotions = (): { groupName: string; count: number }[] => {
    const liveManager = getLive2DManagerInstance();
    if (!liveManager) {
      console.warn('Live2DManager not found');
      return [];
    }

    // Access the models through reflection
    const anyManager = liveManager as any;
    const models = anyManager._models;
    if (!models || models.getSize() === 0) {
      console.warn('No models found');
      return [];
    }

    const model = models.at(0);
    if (!model) {
      console.warn('Model not found');
      return [];
    }

    const modelSetting = (model as any)._modelSetting;
    if (!modelSetting) {
      console.warn('Model setting not loaded yet');
      return [];
    }

    const motions: { groupName: string; count: number }[] = [];
    const motionGroupCount = modelSetting.getMotionGroupCount();

    for (let i = 0; i < motionGroupCount; i++) {
      const groupName = modelSetting.getMotionGroupName(i);
      const count = modelSetting.getMotionCount(groupName);
      motions.push({ groupName, count });
    }

    return motions;
  };

  /**
   * 切換指定的 motion
   * @param groupName 動作群組名稱
   * @param motionIndex 群組內的 motion 索引 (0-based)，不指定則隨機選擇
   */
  const changeMotion = (groupName: string, motionIndex?: number): boolean => {
    const liveManager = getLive2DManagerInstance();
    if (!liveManager) {
      console.error('Live2DManager not found');
      return false;
    }

    const anyManager = liveManager as any;
    const models = anyManager._models;
    if (!models || models.getSize() === 0) {
      console.error('No models found');
      return false;
    }

    const model = models.at(0);
    if (!model) {
      console.error('Model not found');
      return false;
    }

    const modelSetting = (model as any)._modelSetting;
    const motionCount = modelSetting.getMotionCount(groupName);
    if (motionCount === 0) {
      console.error(`Motion group "${groupName}" not found or has no motions`);
      return false;
    }

    let index = motionIndex;
    if (index === undefined) {
      index = Math.floor(Math.random() * motionCount);
    } else if (index < 0 || index >= motionCount) {
      console.error(`Motion index ${index} out of range [0, ${motionCount - 1}]`);
      return false;
    }

    model.startMotion(groupName, index, LAppDefine.PriorityNormal);
    console.log(`Playing motion: ${groupName}_${index}`);
    return true;
  };

  /**
   * 取得所有可用的表情列表
   * @returns { name: string, index: number }[]
   */
  const getAvailableExpressions = (): { name: string; index: number }[] => {
    const liveManager = getLive2DManagerInstance();
    if (!liveManager) {
      console.warn('Live2DManager not found');
      return [];
    }

    const anyManager = liveManager as any;
    const models = anyManager._models;
    if (!models || models.getSize() === 0) {
      console.warn('No models found');
      return [];
    }

    const model = models.at(0);
    if (!model) {
      console.warn('Model not found');
      return [];
    }

    const modelSetting = (model as any)._modelSetting;
    if (!modelSetting) {
      console.warn('Model setting not loaded yet');
      return [];
    }

    const expressions: { name: string; index: number }[] = [];
    const expressionCount = modelSetting.getExpressionCount();

    for (let i = 0; i < expressionCount; i++) {
      const name = modelSetting.getExpressionName(i);
      expressions.push({ name, index: i });
    }

    return expressions;
  };

  /**
   * 切換指定的表情
   * @param expressionIndex 表情索引 (0-based)，或表情名稱
   */
  const changeExpression = (expressionIndex: number | string): boolean => {
    const liveManager = getLive2DManagerInstance();
    if (!liveManager) {
      console.error('Live2DManager not found');
      return false;
    }

    const anyManager = liveManager as any;
    const models = anyManager._models;
    if (!models || models.getSize() === 0) {
      console.error('No models found');
      return false;
    }

    const model = models.at(0);
    if (!model) {
      console.error('Model not found');
      return false;
    }

    const modelSetting = (model as any)._modelSetting;
    const expressionCount = modelSetting.getExpressionCount();

    if (expressionCount === 0) {
      console.error('No expressions available');
      return false;
    }

    let index: number;

    // 如果輸入是字符串，找到對應的索引
    if (typeof expressionIndex === 'string') {
      index = -1;
      for (let i = 0; i < expressionCount; i++) {
        if (modelSetting.getExpressionName(i) === expressionIndex) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        console.error(`Expression "${expressionIndex}" not found`);
        return false;
      }
    } else {
      index = expressionIndex;
      if (index < 0 || index >= expressionCount) {
        console.error(
          `Expression index ${index} out of range [0, ${expressionCount - 1}]`
        );
        return false;
      }
    }

    const expressionName = modelSetting.getExpressionName(index);
    model.setExpression(expressionName);
    console.log(`Expression changed to: ${expressionName}`);
    return true;
  };

  /**
   * 設置縮放
   */
  const setScale = (scaleSize: number): void => {
    console.warn('setScale is not available in Cubism SDK v5');
  };

  return {
    onload,
    onbeforeunload,
    onresize,
    setScale,
    changeMotion,
    getAvailableMotions,
    changeExpression,
    getAvailableExpressions
  };
};

// Initialize the application
window.addEventListener(
  'load',
  (): void => {
    const { onload } = initLive2d();
    onload();
  },
  { passive: true }
);

/**
 * 終了時の処理
 */
window.addEventListener(
  'beforeunload',
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);

export default initLive2d;
