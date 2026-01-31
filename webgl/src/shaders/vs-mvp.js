var vs_mvp=`#version 300 es
#define POSITION_LOCATION 0
#define COLOR_LOCATION 1

precision highp float;
precision highp int;

layout(location = POSITION_LOCATION) in vec3 pos;

out vec4 v_color;

void main()
{
  v_color = vec4(1.0,0.0,0.0,1.0);
  gl_Position = vec4(pos , 1.0);
}`;
