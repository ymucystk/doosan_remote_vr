"use client"
import * as React from 'react'

import { connectMQTT, mqttclient, idtopic, subscribeMQTT, publishMQTT, codeType } from '../lib/MetaworkMQTT'
import { AppMode, isControlMode, requireRobotRequest, isNonControlMode } from '../app/appmode.js';


const MQTT_REQUEST_TOPIC = "mgr/request";
const MQTT_DEVICE_TOPIC = "dev/" + idtopic;
const MQTT_CTRL_TOPIC = "control/" + idtopic; // 自分のIDに制御を送信
const MQTT_ROBOT_STATE_TOPIC = "robot/";

const NOVA2_JOINT2_DIFF = 90; 
//const MQTT_AIST_LOGGER_TOPIC = "AIST/logger/Cobotta";

// sleep function using promise
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒


// ロボットの制御状態管理　（実ロボットと仮想ロボットの同期）
const JointReceiveStatus = Object.freeze({
  WAITING: 0,          // 初期状態
  ROBOT_REQUESTED: 1,  // 対象ロボットをリクエスト済み
  ROBOT_RECEIVED: 2,   // 対象ロボットを受信済み SLRM Ready を待つ
  SLRM_READY: 3,       // slrmReady になったので、ROBOTの state をsubscribe
  JOINT_RECEIVED: 4,   // ROBOTから Joint を受信したのでIK worker に送信
  READY: 5            // IK worker から結果受信（こない。。。）
});
let receive_state = JointReceiveStatus.WAITING // ロボットの状態を受信しているかの状態管理


let send_count = 0;

let firstReceiveJoint = true; // 最初のジョイント受信フラグ


// 通常はロボットの関節状況をこれで送信
export const sendRobotJointMQTT = (ctrl_json) => {
//   console.log("MQTT Joints!", ctrl_json)
//  receive_state = JointReceiveStatus.READY // for debug

  if (receive_state != JointReceiveStatus.READY) {
//    console.log("Not yet real robot joint received", receive_state, firstReceiveJoint);
//    return; // 最初の受信まで送らない
  }

  publishMQTT(MQTT_CTRL_TOPIC, ctrl_json);
}

// viewer/simRobot はロボットの関節をこれで送信
export const sendRobotStateMQTT = (state_json) => {

  publishMQTT(MQTT_ROBOT_STATE_TOPIC + idtopic, state_json);
};


const waitSlrmReady = async (robotDOMRef, message) => {
  let received = true, count = 0;
  if (robotDOMRef.current && robotDOMRef.current.workerRef) {
    const workerData = robotDOMRef.current.workerData;
    while (workerData.current.status.status != "END") {
      await sleep(150);
      //                  console.log("Waiting for SLRM_READY...", workerStatus);
      count++;
      if (count % 10 ==0) console.log("wait READY",count, workerData.current.status)
      if (count > 100) { // 10秒待っても来なかったら諦める
        console.log(message, workerData.current.status);
        received = false;
        break;
      }
    }
    return received;
  }
  return false;
}


export const setupMQTT = (props, robotIDRef, robotDOMRef, set_draw_ready) => {
  firstReceiveJoint = true; // 最初のジョイント受信フラグ
  receive_state = JointReceiveStatus.WAITING // 実ロボットからの受信状態

  // MQTT connected request
  const requestRobot = () => {
    // 制御対象のロボットを探索（表示された時点で実施）
    const requestInfo = {
      devId: idtopic, // 自分のID
      type: codeType,  //  コードタイプ（Request でマッチングに利用)
    }
    window.setTimeout(async () => {
      const received = await waitSlrmReady(robotDOMRef, "Timeout waiting for SLRM_READY for robot request");
      if (received) {
        console.log("Publish request robot", requestInfo)
        publishMQTT(MQTT_REQUEST_TOPIC, JSON.stringify(requestInfo));
        receive_state = JointReceiveStatus.ROBOT_REQUESTED;
        set_draw_ready(true); // robot request 出すなら、 draw ready でいいよね？

      } else {
        console.log("Can't request robot, SLRM not ready");
          
      }
    }, 500); // worker 準備待ちもあって、少し遅らせる
  }
  
  // register to MQTT
  if (typeof window.mqttClient === 'undefined') {
    if (props.appmode === AppMode.practice) { // 練習モードは　MQTT 接続しない
      return;
    }
    if (mqttclient != null) {
      window.mqttClient = mqttclient;
      subscribeMQTT([
        MQTT_DEVICE_TOPIC
      ]);
      if (requireRobotRequest(props.appmode))
        requestRobot();
    } else {
      if (requireRobotRequest(props.appmode)) {
        window.mqttClient = connectMQTT(requestRobot);
      } else {
        window.mqttClient = connectMQTT();
      }
      subscribeMQTT([
        MQTT_DEVICE_TOPIC
      ]);
    }
    //      console.log("Subscribe:",MQTT_DEVICE_TOPIC);
    //        MQTT_CTRL_TOPIC  // MQTT Version5 なので、 noLocal が効くはず

    if (isNonControlMode(props.appmode)) {// Viewer /SimRobotの場合
      //サブスクライブ時の処理
      window.mqttClient.on('message', (topic, message) => {
        if (topic === MQTT_DEVICE_TOPIC) { // デバイスへの連絡用トピック
          console.log(" MQTT Device Topic: ", message.toString());
          // ここでは Viewer の設定を実施！
          let udata = JSON.parse(message.toString())
          if (udata.controller !== undefined) {// コントローラ情報ならば！
            robotIDRef.current = udata.devId // コントローラのロボットを使う
            subscribeMQTT([
              "control/" + udata.devId
            ]);
          }
        } else if (topic === "control/" + robotIDRef.current) {// ここも角度で飛んでくる
          let data = JSON.parse(message.toString())
          if (data.joints !== undefined) {
            // 次のフレームあとにtarget を確認してもらう（IKが出来てるはず
            // nova2 変換
            data.joints[1] -= NOVA2_JOINT2_DIFF
            const jdef = data.joints.map(deg => deg * Math.PI / 180);

            console.log("Viewer,Sim  control topic:", jdef)
            // 各joint 情報を worker に送信！
            console.log("robotDOMRef:", robotDOMRef);

            if (robotDOMRef.current && robotDOMRef.current.workerRef) {
              const workerRef = robotDOMRef.current.workerRef;
              console.log("Send to workerRef:", workerRef, jdef)
              workerRef.current?.postMessage(
                {
                  type: 'set_initial_joints',
                  joints: jdef
                })
            }

          }
        }
      })
    } else { // not viewer/Sim
      //自分向けメッセージサブスクライブ処理
      window.mqttClient.on('message', (topic, message) => {
        if (topic === MQTT_DEVICE_TOPIC) { // デバイスへの連絡用トピック
          let data = JSON.parse(message.toString())
          console.log(" MQTT Device Topic: ", message.toString());
          if (data.devId === "none") {
            console.log("Can't find robot!")
          } else {
            if (receive_state < JointReceiveStatus.ROBOT_RECEIVED) {// READY の時は変更しない
              receive_state = JointReceiveStatus.ROBOT_RECEIVED;
            }
            console.log("Assigned robot:", data.devId)
            robotIDRef.current = data.devId
            // ここでSLRM_READY をループして待つべし！
            // ikWorkerManager.js で設定される
            window.setTimeout(async () => {
              const received = await waitSlrmReady(robotDOMRef, "Timeout waiting for SLRM_READY after robot assigned");
              if (received) {
                receive_state = JointReceiveStatus.ROBOT_RECEIVED;
                subscribeMQTT([
                  MQTT_ROBOT_STATE_TOPIC + robotIDRef.current // ロボットの姿勢を待つ
                ])
              }
            }, 100);
          }
        }
        //        console.log("MQTT Received topic:", topic)

        if (topic === MQTT_ROBOT_STATE_TOPIC + robotIDRef.current) { // ロボットの姿勢を受け取ったら
          let data = JSON.parse(message.toString()) ///

          if (firstReceiveJoint) {
            console.log("First joint Received joints",data)

            receive_state = JointReceiveStatus.JOINT_RECEIVED;
            if (robotDOMRef.current && robotDOMRef.current.workerRef) {
              const workerRef = robotDOMRef.current.workerRef;
//             const workerLeftRef = robotDOMRef.current.workerRef;
              let right = data.joints
//              let left = data.left
     
              console.log("Got Robot POSE to workerRef:", workerRef, right)
              
              workerRef.current?.postMessage(
                {
                  type: 'set_initial_joints',
                  joints: right
                }); // このPOST 結果が終わったら READY になる
            }else{
              console.log("No robotDOMRef or workerRef!")
            }

            if (props.appmode !== AppMode.monitor && props.appmode !== AppMode.viewer) {// ctrl mode の時
              firstReceiveJoint = false
              window.setTimeout(async () => {
                console.log("*** wait SLRM_READY")
                const received = await waitSlrmReady(robotDOMRef, "Timeout waiting for SLRM_READY sending movement");
                if (received) {
                  receive_state = JointReceiveStatus.READY;
                  console.log("Start to send movement!(for robot)")
                  // ロボットに指令元を伝える
                  publishMQTT("dev/" + robotIDRef.current, JSON.stringify({ controller: "browser", devId: idtopic })) // 自分の topic を教える
                }
              }, 100);
            } else {// monitor の時、このきっかけがないので、動かなかった。。。
              //console.log(joints)
            }
          }
        }

      })
    }
  }
  // 消える前にイベントを呼びたい
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
}

const handleBeforeUnload = () => {
  if (mqttclient !== undefined) {
    publishMQTT("mgr/unregister", JSON.stringify({ devId: idtopic }));
  }
}
