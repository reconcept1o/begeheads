// Vertex Shader
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDirection;

void main() {
    vNormal = normalize(vec3(normalMatrix * vec4(normal, 0.0)));
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    vViewDirection = normalize(vPosition - cameraPosition);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform sampler2D tBackground;
uniform float uRefractionRatio;
uniform float uMagnification;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDirection;

void main() {
    vec3 normal = normalize(vNormal); 
    
    float refractionIndex = uRefractionRatio;
    vec3 refractionVec;

    // Normalin kameraya göre yönüne bağlı olarak kırılma veya içten yansıma
    if (dot(vViewDirection, normal) < 0.0) { // Dışarıdan içeri
        refractionVec = refract(vViewDirection, normal, refractionIndex);
    } else { // İçeriden dışarı
        refractionVec = refract(vViewDirection, -normal, 1.0 / refractionIndex); 
    }

    vec2 uv = gl_FragCoord.xy / vec2(textureSize(tBackground, 0));
    uv += refractionVec.xy * uMagnification; 

    vec4 bgColor = texture2D(tBackground, uv);

    gl_FragColor = vec4(bgColor.rgb, 1.0); 
}