'use strict';
var gl;
var vertexPosBuffer;

var translation={
  "x":0.0,
  "y":0.0,
  "z":0.0,
};

function _createShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

function _createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  var program = gl.createProgram();
  var vshader = _createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fshader = _createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.deleteShader(vshader);
  gl.attachShader(program, fshader);
  gl.deleteShader(fshader);
  gl.linkProgram(program);

  var log = gl.getProgramInfoLog(program);
  if (log) {
    console.log(log);
  }

  log = gl.getShaderInfoLog(vshader);
  if (log) {
    console.log(log);
  }

  log = gl.getShaderInfoLog(fshader);
  if (log) {
    console.log(log);
  }

  return program;
};

function _InitContext(){
  // -- Init Canvas
  var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 640;
  document.getElementById("webgl").appendChild(canvas);

  // -- Init WebGL Context
  gl = canvas.getContext('webgl2', { antialias: false });
  var isWebGL2 = !!gl;
  if (!isWebGL2) {
    document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
    return false;
  }
  return true;
}

function _InitUI(){

  const gui = new dat.GUI({name:"translation"});

  // Add a number controller slider.
  gui.add(translation, 'x', -1.0, 1.0, 0.001).onChange(_UpdateVertices);
  gui.add(translation, 'y', -1.0, 1.0, 0.001).onChange(_UpdateVertices);
  gui.add(translation, 'z', -1.0, 1.0, 0.001).onChange(_UpdateVertices);
}

function _UpdateVertices(){
  var vertices = new Float32Array([
    -0.3+translation.x, -0.3+translation.y,0.0+translation.z,// point A,
    0.3+translation.x, -0.3+translation.y,0.0+translation.z,// point B,
    0.0+translation.x, 0.3+translation.y,0.0+translation.z,// point C,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function Init(){
  console.log("Init");

  _InitUI();

  if(!_InitContext()){
    return false;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // -- Init Program
  var program = _createProgram(gl, vs_mvp,fs_pass_color);
  gl.useProgram(program);

  // -- Init Buffers
  vertexPosBuffer = gl.createBuffer();
  _UpdateVertices();
  const vertexPosLocation = 0;  // set with GLSL layout qualifier
  gl.enableVertexAttribArray(vertexPosLocation);
  gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
};

function Render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
  gl.drawArrays(gl.TRIANGLES,0,3);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
