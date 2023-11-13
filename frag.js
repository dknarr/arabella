const frag = `#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float seed;


uniform sampler2D image;


varying vec2 v_texcoord;

vec2 aspect( vec2 uv, float texture_ratio, float canvas_ratio) {

 // if the canvas is too portrait for the texture, stretch across
    // else canvas is too lanscape for the texture, stretch down
    if (texture_ratio > canvas_ratio){
        float diff = canvas_ratio / texture_ratio;
        uv.x *= diff;
        uv.x += (1.0 - diff) / (2.0);
    } else {
        float diff = texture_ratio / canvas_ratio;
        uv.y *= diff;
        uv.y += (1.0 - diff) / (2.0);
    
    }
    
    return uv;
}

void main(void)
{
    vec2 uv = v_texcoord;
    //uv.y = 1.0 - uv.y;
    
    
     // find out the aspect ratios
    float texture_ratio = 1200.0 / 1800.0;
    float canvas_ratio = u_resolution.x / u_resolution.y;
    
    // copy the original coordinate system
    vec2 coords = aspect(uv, texture_ratio, canvas_ratio);
    
    //make a safe area
    coords = mix(vec2(0.1, 0.1), vec2(0.9, 0.9), coords);
    
    //make a normalized mouse
    vec2 mouse = u_mouse / u_resolution;
    
    float blocks = 12.0;
    float x = floor(uv.x * blocks) / blocks;
    float y = floor(uv.y * blocks)/ blocks;
    
    vec2 distortion = 0.1 * vec2(
        sin(u_time * 0.5 + x * 1.0 + y * 1.5 + mouse.x * 2.0 + mouse.y + seed),
        cos(u_time * 0.2 + x *1.1 + y * 2.0 + mouse.x * 0.5 + mouse.y + seed)
    );
    
    //float dist = distance(vec2(0.5, 0.5), uv);
    //float strength = smoothstep(0.6, 0.0, dist);
    
    //vec2 distortion = 0.1 * vec2(
   // sin(time * strength * 0.1 / uv.x), 
   // cos(time * strength * 0.1 / uv.y)
   // );
    
    
    vec4 color = texture2D(image, coords + distortion);
    
    gl_FragColor = color;
}`;
