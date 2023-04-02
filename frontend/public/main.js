import * as THREE from './three.module.js';

import { CinematicCamera } from 'three/addons/cameras/CinematicCamera.js';

			let camera, scene, renderer;

			const radius = 100;
			let theta = 0;

			init();
			animate();

			function init() {
				camera = new CinematicCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.setLens(5);
				camera.position.set( 2, 1, 500 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color(0x00000);

				scene.add( new THREE.AmbientLight(0xffffff, 0.3 ) );

				const light = new THREE.DirectionalLight( 0xffffff, 0.35 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

				const geometry = new THREE.IcosahedronGeometry(3,1,2);

				for ( let i = 0; i < 1500; i ++ ) {
          const  h = 240;
          const  s = Math.floor(Math.random() * 100);
          const l = Math.floor(Math.random() * 100);
          const  color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
					const object = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: color } ) );

					object.position.x = Math.random() * 800 - 400;
					object.position.y = Math.random() * 800 - 400;
					object.position.z = Math.random() * 800 - 400;

					scene.add(object);

				}

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize );

				const effectController = {

					focalLength: 15,
					//jsDepthCalculation: true,
					// shaderFocus: false,
					//
					fstop: 2.8,
					// maxblur: 1.0,
					//
					showFocus: false,
					focalDepth: 3,
					// manualdof: false,
					// vignetting: false,
					// depthblur: false,
					//
					// threshold: 0.5,
					// gain: 2.0,
					// bias: 0.5,
					// fringe: 0.7,
					//
					// focalLength: 35,
					// noise: true,
					// pentagon: false,
					//
					// dithering: 0.0001

				};

				const matChanger = function ( ) {
					for ( const e in effectController ) {
						if ( e in camera.postprocessing.bokeh_uniforms ) {
							camera.postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];
						}
					}

					camera.postprocessing.bokeh_uniforms[ 'znear' ].value = camera.near;
					camera.postprocessing.bokeh_uniforms[ 'zfar' ].value = camera.far;
					camera.setLens( effectController.focalLength, camera.frameHeight, effectController.fstop, camera.coc );
					effectController[ 'focalDepth' ] = camera.postprocessing.bokeh_uniforms[ 'focalDepth' ].value;
				};

				matChanger();
				window.addEventListener( 'resize', onWindowResize );
			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}


			function animate() {
				requestAnimationFrame( animate, renderer.domElement );
				render();
			}

			function render() {
				theta += 0.1;
				camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
				camera.lookAt( scene.position );
				camera.updateMatrixWorld();
				if ( camera.postprocessing.enabled ) {
					camera.renderCinematic( scene, renderer );
				} else {
					scene.overrideMaterial = null;
					renderer.clear();
					renderer.render( scene, camera );
				}
			}