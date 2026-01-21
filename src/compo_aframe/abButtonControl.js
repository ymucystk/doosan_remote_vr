import AFRAME from 'aframe';

// AB button イベントを el.girpState に反映するコンポーネント
AFRAME.registerComponent('ab-button-control', {
  init: function () {
    console.log("### ab-button-control init:", this.el);
    this.el.button_a_state = false; 
    this.el.button_b_state = false; 
    console.log("### ab-button-control init:", this.el.button_a_state, this.el.button_b_state);
    this.el.addEventListener('abuttondown', () => this.el.button_a_state = true);
    this.el.addEventListener('abuttonup',   () => this.el.button_a_state = false);
    this.el.addEventListener('bbuttondown', () => this.el.button_b_state = true);
    this.el.addEventListener('bbuttonup',   () => this.el.button_b_state = false);
  }
});


