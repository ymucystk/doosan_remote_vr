"use client";
import 'aframe';
import * as React from 'react'
const THREE = window.AFRAME.THREE; // これで　AFRAME と　THREEを同時に使える

import { AppMode } from './appmode.js';

//import VrControllerComponents from '../components/VrControllerComponents.jsx';

//import '../compo_aframe/motionFilter.js'

import '@ucl-nuee/robot-loader/robotRegistry.js';
import '@ucl-nuee/robot-loader/robotLoader.js';
import '@ucl-nuee/robot-loader/ikWorker.js';
import '@ucl-nuee/robot-loader/reflectWorkerJoints.js';
import '@ucl-nuee/robot-loader/armMotionUI.js';
import '@ucl-nuee/robot-loader/vrControllerThumbMenu.js';
import '@ucl-nuee/robot-loader/axesFrame.js';
//import '@ucl-nuee/robot-loader/baseMover.js';
import '@ucl-nuee/robot-loader/attachToAnother.js';

import '../compo_aframe/ChangeOpacity.js';
import '../compo_aframe/mqttSender.js';
import '../compo_aframe/abButtonControl.js';
import '../compo_aframe/xyButtonControl.js';
import '../compo_aframe/gripControl.js';


import { getCookie } from '../lib/cookie_id.js';
import { setupMQTT } from '../lib/MQTT_jobs.js';

import StereoVideo from '../components/stereoWebRTC.js';



// 角度、横方向のオフセットを Cookie から取得して初期化
const getCookiesForInitalize = (appmode, setVrModeAngle, setVrModeOffsetX) => {
  // Cookie, Offsetの取得
  if (!(appmode === AppMode.viewer)) {
    const wk_vrModeAngle = getCookie('vrModeAngle')
    setVrModeAngle(wk_vrModeAngle ? parseFloat(wk_vrModeAngle) : 180);  // change default to 90
    const wk_vrModeOffsetX = getCookie('vrModeOffsetX')
    setVrModeOffsetX(wk_vrModeOffsetX ? parseFloat(wk_vrModeOffsetX) : 0.55); // デフォルト X 方向オフセット
    // console.log("Cookie read vrModeAngle, OffsetX:", vrModeAngle_ref.current, vrModeOffsetX_ref.current);
  }
}


export default function Home(props) {
  const robotIDRef = React.useRef("robot_id_reference"); // ロボットUUID 保持用

  const [vrModeAngle, setVrModeAngle] = React.useState(90);       // ロボット回転角度
  const [vrModeOffsetX, setVrModeOffsetX] = React.useState(0.35);   // X offset
  const [base_rotation, setBaseRotation] = React.useState(`-90 90 0`);     // ベース角度
  const [base_position, setBasePosition] = React.useState(`0.35 0.75 -1`);   // ベース位置

  const [draw_ready, set_draw_ready] = React.useState(false)

  const [debug_message, set_debug_message] = React.useState("")
  const add_debug_message = (message) => {
    set_debug_message((prev) => (prev + " " + message))
  }

  const [rtcStats, set_rtcStats] = React.useState([])

  const kinova_ref = React.useRef(null);

  const right_control = React.useRef(null);

  const deg30 = Math.PI / 6.0;
  const deg90 = Math.PI / 2;
  const deg67 = Math.PI * 3 / 8;
  const deg45 = Math.PI / 4;
  const deg22 = Math.PI / 8;

  // モードに応じて初期ポーズを変更
  let initial_pose = `${-deg90}, ${-deg90}, ${-deg90}, 0, ${deg90}, 0`;
  if (props.appmode === AppMode.simRobot) {
    initial_pose = `${deg45}, ${-deg90}, ${deg45}, 0, ${-deg90}, 0`;
  }

  // MQTT 対応
  React.useEffect(() => {
    setupMQTT(props, robotIDRef, kinova_ref,set_draw_ready); // useEffect で1回だけ実行される。


  }, []);

  // Cookie から初期値取得
  React.useEffect(() => {
    getCookiesForInitalize(props.appmode, setVrModeAngle, setVrModeOffsetX);
  }, []);
  // base_position, base_rotation 更新
  React.useEffect(() => {
    setBasePosition(`${vrModeOffsetX} 0.75 -1`);
    setBaseRotation(`-90 ${vrModeAngle} 0`);
    console.log("Home base_pos, rotation:", base_position, base_rotation);
  }, [vrModeAngle, vrModeOffsetX]);

//      <a-scene xr-mode-ui={`enabled: ${!(props.appmode === AppMode.viewer) ? 'true' : 'false'}; XRMode: xr`} >

  return (
    <>
      <a-scene xr-mode-ui={`enabled: true; XRMode: xr`} >

        <a-entity id="robot-registry"
          robot-registry
        ></a-entity>

        <a-entity right-controller
          ref={right_control}
          laser-controls="hand: right"
          thumbstick-menu="items: ray; laser: false"
          target-selector="id: kinova"
          event-distributor
          visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>

        <a-entity camera position="0 1.7 1"
          look-controls
          wasd-controls="acceleration: 200"
        ></a-entity>

        <a-camera id="camera" stereocam position="0 1.1 0.2"></a-camera>


        {  // ステレオカメラ使うか extra-camera={props.appmode}>
          (props.appmode === AppMode.withCam || props.appmode === AppMode.withDualCam || props.appmode === AppMode.viewer) ?
            <StereoVideo rendered={draw_ready} set_rtcStats={set_rtcStats}
              appmode={props.appmode}
            /> : <></>
        }


        <a-plane id="kinova"
          position="0.0 0.8 -2.0" rotation="-90 0 0"
          width="0.4" height="0.4" color="green"
          mqtt-sender={`left: #kinova; right: #kinova; appmode: ${props.appmode}`}
          ref={kinova_ref}
          robot-loader="model: gen2"

          ik-worker={`${0}, ${Math.PI}, ${deg90}, ${0}, ${deg90}, ${0}, ${0}, ${0}`}
          reflect-worker-joints
          arm-motion-ui
          grip-control
          ab-button-control
          /*          attach-opacity-recursively="opacity: 0.5"*/           

          >
        </a-plane>




      </a-scene>
    </>
  );


}