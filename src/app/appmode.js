//
// アプリケーションモードを定義
// appmode モジュール

export const AppMode = {
  normal: 'normal',        // 通常のロボット遠隔操作：カメラ無
  withCam: 'withCam',      // 通常のロボット遠隔操作 + カメラ表示
  withDualCam: 'withDualCam',  // 通常のロボット遠隔操作 + 2カメラ表示
  viewer: 'viewer',        // ビューワ（ロボットの状態を表示するだけ）:カメラ無
  simRobot: 'simRobot',    // 仮想ロボット（実ロボットのシミュレータ）
  practice: 'practice',    // 練習モード (荷物を運ぶタイプ：VRのみ)
  monitor: 'monitor',    // 監視モード (実ロボットの状態を監視する)
};

export function requireRobotRequest(appmode) {
  return (appmode === AppMode.normal ||
          appmode === AppMode.withCam ||
          appmode === AppMode.monitor ||
          appmode === AppMode.withDualCam);
}

export function isControlMode(appmode) {
  return (appmode === AppMode.normal ||
          appmode === AppMode.withCam ||
          appmode === AppMode.withDualCam);
}

export function isCameraMode(appmode) {
  return (
          appmode === AppMode.withCam ||
          appmode === AppMode.withDualCam);
}

export function isNonControlMode(appmode) {
  return (
          appmode === AppMode.viewer ||
          appmode === AppMode.simRobot);
}