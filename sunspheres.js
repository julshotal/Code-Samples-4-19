
//make sure DOM content is loaded before running any javaScript
document.addEventListener("DOMContentLoaded", function() {
    //only run this code for the index page
    if (window.location.pathname == '/igme230/InteractiveGraphics/index.html') {

        //if the window is mobile sized, disable the jquery for dropdown menu
        if($(window).width() > 800){
            $(".dropdown").mouseover(function() {
                $("#sub").css("display", "flex");
            });

            $("#sub").mouseleave(function() {
                $(this).css("display", "none");
            });
        }

        //declare variable
        let fireflies;

        //resize the scene as the browser window is resized
        //taken from https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
        window.addEventListener( 'resize', onWindowResize, false );

        //page 1
        //create a new scene, camera, and renderer with antialias(to prevent pixelization)
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 10000 );
        var renderer = new THREE.WebGLRenderer({antialias: true});


        //get the window height and width and set the renderer to that size
        renderer.setSize( window.innerWidth, window.innerHeight);

        //push the renderer into the empty div on the index page
        document.querySelector('#page1').appendChild(renderer.domElement);

        //make camera look at position 1000(x) 500(y) 0(z)
        camera.lookAt(1000, 500, 0);

        // create audio listener and add it to the camera
        var listener = new THREE.AudioListener();
        camera.add( listener );

        // create a global audio source
        var sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'music/index.wav', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });

        //if the sound button is clicked and music is playing, stop it. If it's stopped, play it.
        //strikethrough button on mute
        $(".sound").click(function() {
            if(sound.isPlaying == true){
                sound.stop();
                $(".sound").css('textDecoration','line-through');
            } else {
                sound.play();
                $(".sound").css('textDecoration', "none");
            }
        });

        /*---------------------------------------------------skyspere-----------------------------------------------------*/

        //function to create the skydome, sun, pointlight, directional light, and push them to the scene
        //takes in texture image, sun color, scene number, sun height, and sun size as parameters
        createSky("daysky", 0xffffff, scene, 500, 600);


        //create a new geometry and array for the fireflies
        fireflies = new THREE.Geometry();
        let flyMaterial = [];
        
        //create 5000 fireflies, spread them about the page, then push them to the fireflies array
        //create new PointsMaterial and each point
        for ( var i = 0; i < 5000; i ++ ) {
            
            var fly = new THREE.Vector3();
            fly.x = THREE.Math.randFloatSpread( 2000 );
            fly.y = THREE.Math.randFloatSpread( 2000 );
            fly.z = THREE.Math.randFloatSpread( 2000 );
        
            fireflies.vertices.push( fly );
            
            flyMaterial[i] = new THREE.PointsMaterial( { color: 0xffffff } );
            
            var allFlies = new THREE.Points( fireflies, flyMaterial[i] );
        }

        //add fireflies to scene on click
        $(window).click(function() {
            scene.add( allFlies );
        });

        
    
        /*-----------------------------------------------------functions and lights-----------------------------------------------------*/

        //create new ambient light and add it to the scene
        var ambLight = new THREE.AmbientLight( 0xd3f2ff , .6 ); 
        scene.add(ambLight);
    
        //set camera's z position
        camera.position.z = 5; 

        //animate the scene and camera
        function animate() {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );

            //move the fireflies positions into the sun in the center
            allFlies.position.x += Math.random();
            allFlies.position.y += Math.random();
            allFlies.position.z += Math.random();
        }   


        //call animation frame
        animate();


    //only calls the below code for page2.html
    } else if (window.location.pathname == '/igme230/InteractiveGraphics/page2.html') {

        /*-----------------------------------------------------Page 2-----------------------------------------------------*/
        /*-----------------------------------------------------Page 2-----------------------------------------------------*/
        /*-----------------------------------------------------Page 2-----------------------------------------------------*/
        /*-----------------------------------------------------Page 2-----------------------------------------------------*/

        //h2 fades when the mouse is held down to orbit the scene
        $("body").mousedown(function() {
            $('h2').fadeTo(500, 0);
        });


        //page 2
        //create a new scene, camera, and renderer with antialias(to prevent pixelization)
        var scene2 = new THREE.Scene();
        var camera2 = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 10000 );
        var renderer2 = new THREE.WebGLRenderer({antialias: true});

         //get the window height and width and set the renderer to that size
        renderer2.setSize( window.innerWidth, window.innerHeight );

        //push renderer to page2 div on page
        document.querySelector('#page2').appendChild(renderer2.domElement);

        //resizes the scene on window resize
        //taken from https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
        window.addEventListener( 'resize', onWindowResize, false );

        // create audio listener and add it to camera
        var listener2 = new THREE.AudioListener();
        camera2.add( listener2 );

        // create two global audio sources
        var sound2 = new THREE.Audio( listener2 );
        var sound4 = new THREE.PositionalAudio( listener2 );

        // load a sound and set it as the Audio object's buffer
        var audioLoader2 = new THREE.AudioLoader();
        audioLoader2.load( 'music/page2.wav', function( buffer ) {
            sound2.setBuffer( buffer );
            sound2.setLoop( true );
            sound2.setVolume( 0.3 );
            sound2.play();
        });

        //load second sound (later is set to the water object) - this is the positional audio
        audioLoader2.load( 'music/waternoise.wav', function( buffer ) {
            sound4.setBuffer( buffer );
            sound4.setRefDistance( 50 );
            sound4.play();
        });

        //on/off sound button functionality for page 2
        $(".sound").click(function() {
            if(sound2.isPlaying == true){
                sound2.stop();
                $(".sound").css('textDecoration','line-through');
            } else {
                sound2.play();
                $(".sound").css('textDecoration', "none");
            }
        });

        /*---------------------------------------------------skyspere-----------------------------------------------------*/

        //called createsky function to create page2 skydome
        createSky("dusklight", 0xfff2c1, scene2, 100, 300);


        /*---------------------------------------------------water-------------------------------------------------------*/

        //create a plane geometry and place a water texture over it
        var waterGeo2 = new THREE.PlaneBufferGeometry( 1000, 1000 );
                var water2 = new THREE.Water(
                    waterGeo2,
                    {
                        textureWidth: 1000,
                        textureHeight: 1000,
                        waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        } ),
                        scale: 10,
                        color: 0xffffff,
                        flowDirection: new THREE.Vector2( -2, 0 )
                    }
                );

                //rotate the plane to be horizantal and at camera level
                water2.rotation.x = - Math.PI / 2;

                //add the water plane to the scene
                scene2.add( water2 );

                //add the positional audio from above to the water plane 
                water2.add( sound4 );

                
        /*-----------------------------------------------------Look around-----------------------------------------------------*/

        //call orbit controls for the camera - click and drag controls 
        orbitC( camera2 );
            
        /*-----------------------------------------------------functions and lights-----------------------------------------------------*/

        //create ambient light and add it to the scene
        var ambLight2 = new THREE.AmbientLight( 0xFFAEC2 , .5 ); 
        scene2.add(ambLight2);

        //set camera's z position
        camera2.position.z = 5;

        //create animate function for this page's scene and renderer
        function animate() {
            requestAnimationFrame( animate );
            renderer2.render( scene2, camera2 );
        }   

        //call animate function
        animate();

    //only call this javascript for page2.html
    } else if (window.location.pathname == '/igme230/InteractiveGraphics/page3.html') {

    /*-----------------------------------------------------Page 3-----------------------------------------------------*/
    /*-----------------------------------------------------Page 3-----------------------------------------------------*/
    /*-----------------------------------------------------Page 3-----------------------------------------------------*/
    /*-----------------------------------------------------Page 3-----------------------------------------------------*/

    //h2 fades out when the  mouse is pressed for the orbit controls
    $("body").mousedown(function() {
        $('h2').fadeTo(500, 0);
    });
    
    //window resize event listener for the scence
    //taken from https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
    window.addEventListener( 'resize', onWindowResize, false );
    
    //page 3
    //create scene aand camera, set them to the window width and height, then push them to the empty page3 div
    var scene3 = new THREE.Scene();
    var camera3 = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 10000 );
    renderer3 = new THREE.WebGLRenderer({antialias: true});
    renderer3.setSize( window.innerWidth, window.innerHeight );
    
    document.querySelector('#page3').appendChild(renderer3.domElement);
    
    //create new audio listener and add it to the camera
    var listener3 = new THREE.AudioListener();
    camera3.add( listener3 );
    
    // create a global audio source
    var sound3 = new THREE.Audio( listener3 );
    var sound6 = new THREE.PositionalAudio( listener3 );
    
    // load a sound and set it as the Audio object's buffer
    var audioLoader3 = new THREE.AudioLoader();
    audioLoader3.load( 'music/page3.flac', function( buffer ) {
        sound3.setBuffer( buffer );
        sound3.setLoop( true );
        sound3.setVolume( 0.3 );
        sound3.play();
    });      
    
    //load the water effects noise for the positional audio
    audioLoader3.load( 'music/waternoise.wav', function( buffer ) {
        sound6.setBuffer( buffer );
        sound6.setRefDistance( 50 );
        sound6.play();
    });      
    
    //on/of sound button
    $(".sound").click(function() {
        if(sound3.isPlaying == true){
            sound3.stop();
            $(".sound").css('textDecoration','line-through');
        } else {
            sound3.play();
            $(".sound").css('textDecoration', "none");
        }
    });
    
    /*---------------------------------------------------skyspere-----------------------------------------------------*/
    
    //call function to create page3 skydome
    createSky("duskdark2", 0xCB253E, scene3, 50, 300);
    
    
    /*---------------------------------------------------water-------------------------------------------------------*/
    
    //create a plane and add water texture to it
    var waterGeo3 = new THREE.PlaneBufferGeometry( 1000, 1000 );
            var water3 = new THREE.Water(
                waterGeo3,
                {
                    textureWidth: 1000,
                    textureHeight: 1000,
                    waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    } ),
                    scale: 10,
                    color: 0xffffff,
                    flowDirection: new THREE.Vector2( -2, 0 ) 
                    
                }
            );
    
            //rotate plane to be horizantal camera level and push to scene
            water3.rotation.x = - Math.PI / 2;
            scene3.add( water3 );
            
            //add positional audio to the water plane
            water3.add( sound6 );
            
    /*-----------------------------------------------------Look around-----------------------------------------------------*/
    
    //orbit controls on mouse click and drag
    orbitC( camera3 );
        
    /*-----------------------------------------------------functions and lights-----------------------------------------------------*/
    
    //create new ambient light and push to scene
    var ambLight3 = new THREE.AmbientLight( 0xc3b4e4 , .5 ); 
    scene3.add(ambLight3);
    
    //set camera's z position
    camera3.position.z = 5;

    //create function to animate renderer and camera
    function animate() {
        requestAnimationFrame( animate );
        renderer3.render( scene3, camera3 );
    }   
    
    //cal animate function
    animate();

//call this javascript only for doc.html
} else if (window.location.pathname == '/igme230/InteractiveGraphics/doc.html') {
    /*-----------------------------------------------------documentation-----------------------------------------------------*/
    /*-----------------------------------------------------documentation-----------------------------------------------------*/
    /*-----------------------------------------------------documentation-----------------------------------------------------*/
    /*-----------------------------------------------------documentation-----------------------------------------------------*/

    //even listener to resize scene on window resize
     //taken from https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
     window.addEventListener( 'resize', onWindowResize, false );
     
     //page 4
     //create camera, scene, and rendered and set them to the window size and push them to the doc div
     var scene4= new THREE.Scene();
     var camera4 = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 10000 );
     renderer4 = new THREE.WebGLRenderer({antialias: true});
     renderer4.setSize( window.innerWidth, window.innerHeight );
 
     document.querySelector('#doc').appendChild(renderer4.domElement);
 
     // create an audiolistener and add it to the camera
     var listener4 = new THREE.AudioListener();
     camera4.add( listener4 );
 
     // create a global audio source
     var sound4 = new THREE.Audio( listener4 );
 
     // load a sound and set it as the Audio object's buffer
     var audioLoader4 = new THREE.AudioLoader();
     audioLoader4.load( 'music/underwater.wav', function( buffer ) {
         sound4.setBuffer( buffer );
         sound4.setLoop( true );
         sound4.setVolume( 0.8 );
         sound4.play();
     });
 
 
     //sound on/off button functionality
     $(".sound").click(function() {
         if(sound4.isPlaying == true){
             sound4.stop();
             $(".sound").css('textDecoration','line-through');
         } else {
             sound4.play();
             $(".sound").css('textDecoration', "none");
         }
     });
 
     /*---------------------------------------------------skyspere-----------------------------------------------------*/
 
     //create the skydome using a sphere, add an image as the inside textute (our "sky")
     var skyGeo = new THREE.SphereGeometry(1000, 50, 50); 
     var loader  = new THREE.TextureLoader(),
     texture = loader.load( "img/" + "night" + ".jpg" );

     //map the texture to a object material
     var material = new THREE.MeshPhongMaterial({ 
         map: texture,
     });

     //push the sky into the scene and wrap material
     var sky = new THREE.Mesh(skyGeo, material);
     sky.material.side = THREE.BackSide;
     scene4.add(sky);
 
     /*---------------------------------------------------water-------------------------------------------------------*/
 
     //create plane and add a water texture to it. This water is made to have more texture and be choppier than earlier scenes
     var waterGeo4 = new THREE.PlaneBufferGeometry( 500, 500 );
             var water4 = new THREE.Water(
                 waterGeo4,
                 {
                     textureWidth: 1000,
                     textureHeight: 1000,
                     waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
                         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                     } ),
                     scale: 15,
                     opacity: .3,
                     color: 0xffffff,
                     flowDirection: new THREE.Vector2( 0, -1 )
                 }
             );
             
             //rotate the water to be directly in front of camera and add to scene
             water4.rotation.x = 0;
             scene4.add( water4 );
         
     /*-----------------------------------------------------functions and lights-----------------------------------------------------*/
 
     //create an ambient liht and push to scene
     var ambLight4 = new THREE.AmbientLight( 0x00ffff,  .9 ); 
     scene4.add(ambLight4);
 
     //set camera's z position
     camera4.position.z = 5;
 
     //create function to animate renderer and camera
     function animate() {
         requestAnimationFrame( animate );
         renderer4.render( scene4, camera4 );
     }   
 
     //call animate function
     animate();
}
        
    /*-----------------------------------------------------functions-----------------------------------------------------*/

    //function to create skydomes
    function createSky(name, sunColor, sceneNum, sunHeight, sunSize) {

        //creates sphere the camera will be place inside
        var skyGeo = new THREE.SphereGeometry(1000, 50, 50); 
        var loader  = new THREE.TextureLoader(),

        //image path to image that will be used as texture
        texture = loader.load( "img/" + name + ".jpg" );

        //map the texture image to a object material
        var material = new THREE.MeshPhongMaterial({ 
            map: texture,
        });

        //wrap the material and push to scene
        var sky = new THREE.Mesh(skyGeo, material);
        sky.material.side = THREE.BackSide;
        sceneNum.add(sky);

        //new sphere which will encase the pointlight that acts as the sun
        var sun = new THREE.SphereBufferGeometry( sunSize, 30, 100 );

        //new point light, sphere made above addes as a mesh and the light is moved to be on the faux horizon
        //this point light will provide dim illumination to the area across from the sphere
        //then push light to scene
        var light1 = new THREE.PointLight( sunColor , .1 );
        light1.add( new THREE.Mesh( sun, new THREE.MeshBasicMaterial( { color: sunColor } ) ) );
        light1.position.set(1000, sunHeight, 0);
        sceneNum.add( light1);

        //create a directional light that illuminates the sphere to give the appearence of a glow
        //push to scene
        var sunRay = new THREE.DirectionalLight(sunColor , .6);
        sunRay.target.position.set(1000, sunHeight, 0);
        sceneNum.add( sunRay, sunRay.target);

    }

    //orbit controls for the camera called with mouse click & drag
    //gives 360 rotational view and allows the user to look up and down to a limited point
    function orbitC(cameraN) {
        var controls = new THREE.OrbitControls( cameraN );
        controls.maxPolarAngle = Math.PI * 0.495;
                controls.target.set( 0, 10, 0 );
                controls.minDistance = 40.0;
                controls.maxDistance = 200.0;
                cameraN.lookAt( controls.target );
    }

    //function called on the window resize event listener
    //updates the scene and camera to correct browser size
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }
    

});