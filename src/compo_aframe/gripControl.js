import AFRAME from 'aframe';

// Grip イベントを el.girpState に反映するコンポーネント
AFRAME.registerComponent('grip-control', {
  init: function () {
    console.log("### grip-control init:", this.el);

    this.el.gripState = [false, false];
    this.el.addEventListener('gripdown', (evt) => {      
//      console.log("Grip on!",evt.detail.originalTarget);
      if (evt.detail.originalTarget.getAttribute('left-controller') != null){
        this.el.gripState[0] = true;
      }
      if (evt.detail.originalTarget.getAttribute('right-controller') != null){
        this.el.gripState[1] = true;
      }
    });
    this.el.addEventListener('gripup', (evt) => {
            
      if (evt.detail.originalTarget.getAttribute('left-controller') != null){
        this.el.gripState[0] = false;
      }
      if (evt.detail.originalTarget.getAttribute('right-controller') != null){
        this.el.gripState[1] = false;
      }
    });
  }

});
