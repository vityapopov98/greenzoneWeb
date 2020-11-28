<template>
  <div id="app">
     <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="block-container" v-for="(device, index) in devices" :key="index">
            <h2>{{device.name}}</h2>
            
            <!-- <button class="switch" @click="switchOn">
              <span class="slider round" :class="{'slider-on': switchled, 'slider-off': !switchled}"></span>
            </button> -->

            

          <!-- <h5>{{data}} jyg</h5> -->
          <hr>
            <div class="container ">
              <div class="row device-control-block" v-show="!device.showSettings">
                <div class="col-md-3">
                  <h5 class="device-block-headers">Вкл/Выкл устройство</h5>
                  <!-- <span class="material-icons" :class="{'icon-on': device.subscriptionsOutput[0] == 1, 'icon-off': device.subscriptionsOutput[0] == 0}">
                  lens
                  </span> -->
                  <button class="switch" @click="switchOn(device)">
                    <span class="slider round" :class="{'slider-on': device.switchPower.ackState, 'slider-off': !device.switchPower.ackState, 'slider-on-ack': device.switchPower.state}"></span>
                  </button>
                  
                </div>
                <div class="col-md-3">
                  <h5 class="device-block-headers">{{device.outputHeaders[4]}}</h5>
                  <p>{{device.subscriptionsOutput[4]}}</p>
                </div>
                <div class="col-md-3">
                  <h5 class="device-block-headers">{{device.outputHeaders[2]}}</h5>
                  <p>{{device.subscriptionsOutput[2]}}</p>
                  
                </div>
                <div class="col-md-3">
                  <h5 class="device-block-headers">{{device.outputHeaders[3]}}</h5>
                  <!-- <p>{{device.subscriptionsOutput[3]}}</p> -->
                  <p>{{device.subscriptionsOutput[6]}}</p>
                  <p>{{device.subscriptionsOutput[7]}}</p>
                  <span class="material-icons device-control-block-icon" :class="{'icon-on': device.subscriptionsOutput[3] == 1, 'icon-off': device.subscriptionsOutput[3] == 0}">
                  wb_iridescent
                  </span>
                  <!-- <p>{{subscriptionsOutput[4]}}</p> -->
                </div>
              </div>
            </div>
  
            <hr>
            <div class="container">
              <transition>

                <div class="row device-information-block" v-show="!device.showSettings">
                  <div class="col-md-6">
                    <h5>{{device.outputHeaders[1]}}</h5>
                  </div>
                  <div class="col-md-6">
                    <p>{{device.subscriptionsOutput[1]}}</p>
                  </div>
                </div>
              </transition>

            <hr>
              <div class="row">
                <div class="row device-settings-block" v-show="device.showSettings" v-if="device.name == 'Termostat'">
                <div class="col-md-6">
                  <h5>Введите температуру</h5>
                </div>
                <div class="col-md-6">
                 <input type="text" v-model="device.setTemperature.input">
                  <button class="btn btn-settings" @click="publish(device.setTemperature.topic, device.setTemperature.input)">
                    Прошить
                  </button>
                </div>
              </div>
                <div class="col-md-12 device-information-block">
                  <button class="btn btn-settings" @click="device.showSettings = !device.showSettings">
                    Настройки
                  </button>
                </div>
              </div>
              
            </div>


          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>

export default {
  name: 'App',
  
  data: function(){
    return {
      devices: [
        {
          name: 'Termostat',
          subscriptionsTopics:[ "termostat/deviceControlState", "termostat/temperature", "termostat/pupmState", "termostat/heaterState", "termostat/selectedTemp", "termostat/requestStates", 'termostat/webData'],
          outputHeaders: ["Термостатирование", "Температура", "Состояние Насоса", "Состояния Котла", "Выбранная температура"],
          subscriptionsOutput: ["0", "", "", "", "", "", ""],
          requestStates: "termostat/requestStates",
          
          switchPower: { state: false, ackState:'',  publicTopic: "termostat/deviceControl", checkTopic: "termostat/deviceControlState"},
          setTemperature: {input: '', topic: "termostat/tempSelect"},
          showSettings: false
        },
        {
          name: 'BB-8',
          subscriptionsTopics:[],
          outputHeaders: ["Питание", "Сооьщение", "Состояние", "чтото"],
          subscriptionsOutput: ["on", "male", "Jedi server", "Resistance"],

          switchPower: false,
        }
      ],
      switchled: false,
      ledTopic: "inTopic",
      dataTopic: "dataTopic",
      outTopic: "outTopic",
      publicationTopic: [],
      count: 0,
      data: '',

      connection: null
    }
  },
  methods:{
    switchOn(device){

      //Сделать так: при нажатии менять положение круглешка
      //В качестве подтверждения менять цвет на зеленый (если включено)

      // console.log(device)
      // console.log(+!device.switchPower.state)
      console.log(!device.switchPower.state)
      device.switchPower.state = !device.switchPower.state
      // this.publish(device.switchPower.publicTopic, `${+device.switchPower.state}`)
      var data = {
        destinationName: device.switchPower.publicTopic,
        payload: +device.switchPower.state
      }
      this.connection.send(JSON.stringify(data))
    },
    updateSwitch(message, device){
      // console.log('updating')
        if(device.subscriptionsOutput[0] == 0){
          device.switchPower.ackState = false
        }
        else{
          device.switchPower.ackState = true
        }
    },
    sendMessage(message){
      console.log(this.connection)
      this.connection.send(message)
    },
    publish(topic, data){
      var packet = {
        destinationName: topic,
        payload: data
      }
      this.connection.send(JSON.stringify(packet))
    }
  },
  created(){
    console.log('connect to the web sok')
    this.connection = new WebSocket("ws://localhost:3000")

    this.connection.onopen = function(event){
      console.log(event)
      console.log('sucsess')
    }

    this.connection.onmessage = (event)=>{
      console.log(event.data)
      const message = JSON.parse(event.data)
      // console.log(message)
      // console.log(message.destinationName)
      this.devices.forEach(device=>{
        device.subscriptionsTopics.forEach((element, index)=>{
          console.log(message.destinationName, element)
        if(message.destinationName != undefined){
          // if (message.destinationName.includes('termostat')) { //если это топик термостата
          console.log('heer')
            if(message.destinationName == element){
            // console.log(message.destinationName, element)
              device.subscriptionsOutput.splice(index, 1, message.payload)
              
            }
          // }
          
        }
          
            
            this.updateSwitch(message, device)
          
        })
      })


    }
  }
}
</script>

<style>
body, html{
  background: url('~@/assets/bg.jpg') center center no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e7e7e7;
  padding-top: 5rem;
  width: 100%;
  height: 100vh;
}
h5.device-block-headers{
  font-size: 16px;
  font-weight: 300;
}
.block-container{
  margin: 2rem 0;
  background: #00000083;
  border-radius: 2rem;
  /* height: 500px; */
  backdrop-filter: blur(15px);
}
.device-control-block{
  background: #00000050;
  padding: 1.5rem;
}
.device-control-block-icon{
  font-size: 3rem;
}
.icon-on{
  color: orange;
}
.icon-off{
  color: #ccc;
}

.device-information-block, .device-settings-block{
  padding: 1.5rem;
  display: flex;
  justify-content: center;
}
.device-settings-block{

}

.btn-settings{
  border-radius: 2rem;
  background-color: #00000050;
  color: white;
  /* padding: 0; */
}
hr{
  margin: 0;
  border-color: rgba(255, 255, 255, 0.219);
}


.block-container>h2{
  color: white;
  padding-top: 1rem;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
/* My switch */
button.switch{
  border: none;
  background: none;
  outline: none;
}
.slider-off{
  background-color: #ccc;
}
.slider-on{
  background-color: rgb(76, 217, 100);
}
/* .slider-on::before{
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
} */

.slider-on-ack::before{
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgb(76, 217, 100);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(76, 217, 100);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>

