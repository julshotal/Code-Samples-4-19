
   //$10
    var sceneBill = new THREE.Scene();
    var cameraBill = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('#ten').appendChild(renderer.domElement);

    cameraBill.position.z = 3;

    var frontB = new THREE.PlaneGeometry(2, 1, 1, 1);
    var backB = new THREE.PlaneGeometry(2, 1, 1, 1);

    backB.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );

    var textureFrontB = new THREE.TextureLoader().load('img/tenfront.png' );      
    var textureBackB = new THREE.TextureLoader().load('img/tenback.png' );

    var material1B = new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureFrontB } );
    var material2B = new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureBackB } );

    // card
    bill = new THREE.Object3D();

            // mesh
    mesh1B = new THREE.Mesh( backB, material1B );
    bill.add( mesh1B );
    mesh2B = new THREE.Mesh( frontB, material2B );
    bill.add( mesh2B );


    sceneBill.add( bill );


    function animate() {
        requestAnimationFrame( animate );
        renderer.render( sceneBill, cameraBill );
        
        mesh1B.rotation.y += .01;
        mesh2B.rotation.y += .01;
        
        renderer.autoclear = false;
    }

    animate();
 
 if ($('#quarter').click) {
  //create scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('#quarter').appendChild(renderer.domElement);
    
    camera.position.z = 3;
    
    var front = new THREE.CircleGeometry(.5, 35);
    var back = new THREE.CircleGeometry(.5, 35);

    back.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );

    var textureFront = new THREE.TextureLoader().load('img/quarterfront.png' );      
    var textureBack = new THREE.TextureLoader().load('img/quarterback.png' );

    var material1 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureFront } );
    var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureBack } );

    // card
    coin = new THREE.Object3D();

            // mesh
    mesh1 = new THREE.Mesh( back, material1 );
    coin.add( mesh1 );
    mesh2 = new THREE.Mesh( front, material2 );
    coin.add( mesh2 );


    scene.add( coin );


    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );

      renderer.autoclear = false;
        
      mesh1.rotation.y += .01;
      mesh2.rotation.y += .01;  
        
    }

    animate();
 }





