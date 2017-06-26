// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "deps/phoenix/web/static/js/phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()

let getByClass = function(css) {
  return document.getElementsByClassName(css)[0]
}

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("roomba", {})
channel.join()
  .receive("ok", resp => {
    document.getElementById("forward").addEventListener("mousedown", _event => {
      console.log("forward")
      channel.push("drive", {velocity: 500, radius: 0})
    })
    document.getElementById("backward").addEventListener("mousedown", _event => {
      console.log("backward")
      channel.push("drive", {velocity: -100, radius: 0})
    })
    document.getElementById("left").addEventListener("mousedown", _event => {
      console.log("left")
      channel.push("drive", {velocity: 100, radius: 10})
    })
    document.getElementById("right").addEventListener("mousedown", _event => {
      console.log("right")
      channel.push("drive", {velocity: 100, radius: -10})
    })
    document.getElementById("reset").addEventListener("click", _event => {
      console.log("reset")
      channel.push("reset", {})
    })
    document.getElementById("safe").addEventListener("click", _event => {
      console.log("safe")
      channel.push("safe", {})
    })
    document.getElementById("position_reset").addEventListener("click", _event => {
      console.log("position reset")
      channel.push("position_reset", {})
    })
    document.addEventListener("mouseup", function(ev){
      console.log("stop!")
      channel.push("drive", {velocity: 0, radius: 0})
    })
    console.log("Joined successfully", resp)
  }).receive("error", resp => { console.log("Unable to join", resp) })

channel.on("sensor_update", sensors => {
  getByClass("battery_capacity").textContent = sensors.battery_capacity;
  getByClass("battery_charge").textContent = sensors.battery_charge;
  getByClass("bumper_left").setAttribute("fill", sensors.bumper_left == 0 ? "black" : "red")
  getByClass("bumper_right").setAttribute("fill", sensors.bumper_right == 0 ? "black" : "red")
  getByClass("light_bumper_left").setAttribute("display", sensors.light_bumper_left == 0 ? "none" : "block")
  getByClass("light_bumper_left_front").setAttribute("display", sensors.light_bumper_left_front == 0 ? "none" : "block")
  getByClass("light_bumper_left_center").setAttribute("display", sensors.light_bumper_left_center == 0 ? "none" : "block")
  getByClass("light_bumper_right").setAttribute("display", sensors.light_bumper_right == 0 ? "none" : "block")
  getByClass("light_bumper_right_front").setAttribute("display", sensors.light_bumper_right_front == 0 ? "none" : "block")
  getByClass("light_bumper_right_center").setAttribute("display", sensors.light_bumper_right_center == 0 ? "none" : "block")
})

channel.on("position_update", position => {
  getByClass("position_x").textContent = position.x.toFixed(1);
  getByClass("position_y").textContent = position.y.toFixed(1);
  getByClass("position_heading").textContent = position.heading.toFixed(1);
})

export default socket
