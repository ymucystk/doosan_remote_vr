import AFRAME from 'aframe';

// AB button イベントを el.girpState に反映するコンポーネント
AFRAME.registerComponent('xy-button-control', {
  init: function () {
    console.log("### xy-button-control init:", this.el);
    this.el.button_a_state = false; 
    this.el.button_b_state = false; 
    console.log("### xy-button-control init:", this.el.button_a_state, this.el.button_b_state);
    this.el.addEventListener('xbuttondown', () => this.el.button_a_state = true);
    this.el.addEventListener('xbuttonup',   () => this.el.button_a_state = false);
    this.el.addEventListener('ybuttondown', () => this.el.button_b_state = true);
    this.el.addEventListener('ybuttonup',   () => this.el.button_b_state = false);
  }
});


