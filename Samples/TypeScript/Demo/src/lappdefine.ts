/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */

// Canvas width and height pixel values, or dynamic screen size ('auto').
export type CanvasSizeType = { width: number; height: number } | 'screen' | 'auto';

// Canvas width and height pixel values, or dynamic screen size ('auto').
export let CanvasSize: CanvasSizeType = 'auto';

// キャンバスの数
export let CanvasNum = 1;

// 画面
export const ViewScale = 1.0;
export const ViewMaxScale = 3.5;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalBottom = -1.0;
export const ViewLogicalTop = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 相対パス
export let ResourcesPath: string = '../../Resources/';

// モデル定義ファイルの副檔名
export let ModelJsonExtension: string = '.model3.json';
// モデル定義ファイル名
export let ModelFileName: string | null = null;
// モデルの後ろにある背景の画像ファイル
export const BackImageName = '';

// 歯車
export const GearImageName = '';

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export let ModelDir: string[] = [
  'Haru',
  'Hiyori',
  'Mark',
  'Natori',
  'Rice',
  'Mao',
  'Wanko'
];
export let ModelDirSize: number = ModelDir.length;
export let Quality: number = 2;

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// MOC3の整合性検証オプション
export const MOCConsistencyValidationEnable = true;
// motion3.jsonの整合性検証オプション
export const MotionConsistencyValidationEnable = true;

// デバッグ用ログの表示オプション
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// デフォルトのレンダーターゲットサイズ
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;

export function initConfig(options: any): void {
  if (options.resourcesPath !== undefined) {
    ResourcesPath = options.resourcesPath;
  }
  if (options.modelDir !== undefined) {
    ModelDir = options.modelDir;
    ModelDirSize = ModelDir.length;
  }
  if (options.quality !== undefined) {
    Quality = options.quality;
  }
  if (options.modelJsonExtension !== undefined) {
    ModelJsonExtension = options.modelJsonExtension;
  }
  if (options.modelFileName !== undefined) {
    ModelFileName = options.modelFileName;
  }
  if (options.size !== undefined) {
    CanvasSize = options.size;
  }
  if (options.canvasNum !== undefined) {
    CanvasNum = options.canvasNum;
  }

  if (DebugLogEnable) {
    console.log('[initConfig]', {
      ResourcesPath,
      ModelDir,
      ModelDirSize,
      Quality,
      ModelJsonExtension,
      ModelFileName,
      CanvasSize,
      CanvasNum
    });
  }
}
