import AFRAME from 'aframe';
import {sendRobotJointMQTT, sendRobotStateMQTT} from '../lib/MQTT_jobs'
import {  isNonControlMode} from '../app/appmode';

// MQTT 送信コンポーネント for Sciurus17
AFRAME.registerComponent('mqtt-sender', {
	schema: {
		appmode: {type: 'string', default: ''}, // appmode を伝える
		arm: {type: 'string', default: ''}, // left or right
    left: {type: 'selector', default: '#sciurus-l-arm'}, // left arm plane
    right: {type: 'selector', default: '#sciurus-r-arm'}, // right arm plane
	},
  init: function(){
//    console.log("mqtt-sender initialized. left:", this.data.left, " right:", this.data.right);
    if( this.data.left === this.data.right){
        this.single = true;
        console.log("This is MQTT single module mode.");
    }
    if (isNonControlMode(this.data.appmode)){
      this.sendMQTT = sendRobotStateMQTT;
    }else{
      this.sendMQTT = sendRobotJointMQTT;
    }
  },
	tick: function () {
    
    const leftJointData = this.data.left.workerData?.current.joints;
    const rightJointData = this.data.right.workerData?.current.joints;

    if( leftJointData == null || rightJointData == null){
      console.log("mqtt-sender: waiting for workerData.joints...");
    } else if (this.single){
//      console.log("Single arm MQTT send:", rightJointData);
      const ctrl_json = JSON.stringify({
        joints: rightJointData,
        grip: this.data.right.gripState, // [left, right]
        button: [this.data.right.button_a_state, this.data.right.button_b_state]
      });
      this.sendMQTT(ctrl_json);
    }else{
//      console.log("Both arm MQTT send:", leftJointData, rightJointData);
      const ctrl_json = JSON.stringify({
        joints: leftJointData.concat(rightJointData),
        grip: this.data.left.gripState, // [left, right]
        button: [this.data.left.button_a_state, this.data.left.button_b_state, this.data.right.button_a_state, this.data.right.button_b_state]
      }); 
      this.sendMQTT(ctrl_json);

    }		
  }
});

