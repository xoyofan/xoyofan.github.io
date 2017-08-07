

//定义汽车渲染的基本场景和逻辑函数

function carViewer(containerId,filePath){

	this.container = $('#'+containerId);

	this.width = $('#'+containerId).width();
	this.height = $('#'+containerId).height();


	this.camera = null;
	this.renderer = null;
	this.controls = null; 
	this.scene = null;

	this.mouse = new THREE.Vector2();
	this.raycaster = new THREE.Raycaster();
	this.pickingArray = [];//所有可拾取节点的集合

	this.clock = new THREE.Clock();
	this.hotPoints = null;

	this.HtData = new HTData(_MODELS_,_TEXTURE_);
	this.htLoader = new THREE.OBJLoader();
	this.textureLoader = new THREE.TextureLoader();

	this.textureUrl = filePath + 'textures/';
	this.modelUrl = filePath + 'models/';

	this.mats = null;


	this.HtMaterial = this.HtData.matGroup;

	this.firstTime = 0.0;
	this.secondTime = 0.0;

	this.debugStr = '';

}

carViewer.prototype = {

	constructor: carViewer,

	init : function(){

	    //console.time('firstScreen');
		//console.time('totalScreen');

		this.clock.start();


		this.initSceneAndGroups();
		this.initRenderer();

		this.initCamera();
		this.initControls();

		this.initLights();

		this.HtData.init();


		$(window).resize(this.onViewportResize.bind(this));
		this.container.mousedown(this.onMouseDown.bind(this));
		//this.container.on('touchstart',onTouchStart) ;

		this.renderCallback();
		
	},

	getViewer : function(){

		return this;
	},

	convert3dMaxAxis : function(p){

		return (p[3] == true) ? new THREE.Vector3(p[0],p[2],-p[1]) : new THREE.Vector3(p[0],p[1],p[2]);
	},

	//考虑到扩展性，一些新增的全局group节点在此处初始化
	initSceneAndGroups : function(){

		this.scene = new THREE.Scene();

	},

	updateMaterial : function(key,params,callback){

		var _this = this;

		this.HtMaterial[key].reflectivity = params.reflectivity;
		this.HtMaterial[key].shininess = params.shininess;
		this.HtMaterial[key].specular = new THREE.Color(params.specular);
		this.HtMaterial[key].emissive = new THREE.Color(params.emissive);
		this.HtMaterial[key].needsUpdate = true;

		// new TWEEN.Tween(_this.HtMaterial[key]).to({

		// 	reflectivity : params.reflectivity,
		// 	shininess : params.shininess,
		// 	//specular : new THREE.Color(params.specular),
		// 	color : new THREE.Color(0xffffff),//new THREE.Color(params.color),
		// 	//emissive : new THREE.Color(params.emissive)

		// }, 2000).onComplete(function(){
		// 	_this.HtMaterial[key].needsUpdate = true;
		// }).start();

        new TWEEN.Tween(_this.HtMaterial[key].color).to(new THREE.Color(params.color), 1000).start().onComplete(function () {
            if (typeof callback == 'function') {
                callback();
            }
        });

		this.renderer.toneMappingExposure = params.toneMappingExposure;
	},

	initGui :function(key,params){

		var _this = this;
		var guiChanged = function(){
			_this.updateMaterial(key,params);
		};

		var gui = new dat.GUI();

		gui.add( params, 'toneMappingExposure',1.0,2.0,0.1 ).onChange(guiChanged);
		gui.add( params, 'reflectivity',0.0,1.0,0.02 ).onChange( guiChanged);
		gui.add( params, 'shininess',10,100,1 ).onChange( guiChanged);
		gui.addColor( params, 'specular' ).onChange( guiChanged);
		gui.addColor( params, 'color' ).onChange(guiChanged);
		gui.addColor( params, 'emissive' ).onChange(guiChanged);

		gui.open();
		guiChanged();
		
		$('.ac').css('right','500px');
	},

	initCamera : function(){

		this.camera = new THREE.PerspectiveCamera( 35, this.width / this.height, 1, 20000 );
		this.camera.position.copy(this.convert3dMaxAxis(CAM_INFO.position));
	},

	initControls : function(){

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.autoRotate = false;
	    this.controls.autoRotateSpeed = 0.5;
	    this.controls.phiRotationSpeed = 0.15;
	    this.controls.enabledAutoRotatePhi = true;
	    this.controls.enablePan = true;
	   // this.controls.target.copy(this.convert3dMaxAxis(CAM_INFO.target));
	    this.changeControlsState(0);
	},

    //@param door :某一个车门
	changeControlsState : function(door){

		 var target,distance,angle;

         if (door > 0){

             var vec = this.convert3dMaxAxis(DOOR_INFO['LeftFront'].camera['InCar'].position)
             target = vec.clone().add(this.convert3dMaxAxis(DOOR_INFO['LeftFront'].camera['InCar'].target));
             distance = DOOR_INFO['LeftFront'].camera['InCar'].distance;
             angle = DOOR_INFO['LeftFront'].camera['InCar'].polarAngle;
			
		 }else{

             target = this.convert3dMaxAxis(DOOR_INFO['LeftFront'].camera['OutCar'].target);
             distance = DOOR_INFO['LeftFront'].camera['OutCar'].distance;
             angle = DOOR_INFO['LeftFront'].camera['OutCar'].polarAngle;
		 }

		 this.controls.target.copy(target);
		

		 this.controls.minDistance = distance[0];
         this.controls.maxDistance = distance[1];
	
		 this.controls.minPolarAngle = THREE.Math.degToRad(angle[0]);
         this.controls.maxPolarAngle = THREE.Math.degToRad(angle[1]);
		 this.controls.update();
	},

	initLights : function(){

		var a = new THREE.PointLight(0x888888, 1.0);
    		a.position.set(1180, 2000, -2300);
	    var b = new THREE.PointLight(0x888888, 1.0);
	    	b.position.set(1180, 2000, 2300);
	    var c = new THREE.PointLight(0xababab, 0.6);
	    	c.position.set(-1200, 200, 0);
	    var d = new THREE.HemisphereLight(0xffffff, 0xdddddd, 1.0);
		this.scene.add(a);
		this.scene.add(b);
		this.scene.add(c);
		this.scene.add(d);

	},

	initRenderer : function(){

		this.renderer =  new THREE.WebGLRenderer({antialias: true,alpha: true});
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.getCurrentViewportSize();
		this.renderer.setSize( this.width, this.height );

		// renderer.shadowMap.enabled = true;
		// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//renderer.shadowMap.enabled = true;
		//	renderer.gammaInput = true;
		//renderer.gammaOutput = true;
		//	renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.toneMappingExposure = 1.2;
		//	renderer.toneMappingExposure = 1.0;
		//	renderer.physicallyCorrectLights = true;
		//	renderer.gammaFactor = 1.5;
		// renderer.toneMapping = THREE.CineonToneMapping;
	 	// renderer.toneMappingExposure = Math.pow( 1.1, 4.0 );
		this.container.append( this.renderer.domElement );

	},

	onViewportResize : function(){

		this.getCurrentViewportSize();


		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		if(this.hotPoints) this.hotPoints.resize();

		this.renderer.setSize( this.width, this.height );
		if(_DEBUG_) console.log('当前renderer: ' + this.renderer.getSize().width + ' ' +　this.renderer.getSize().height );
	},

	getCurrentViewportSize : function(){

		this.width = this.container.width();
		this.height = this.container.height();
		if(_DEBUG_) console.log('当前container: ' + this.width + ' ' +　this.height );

	},

	renderCallback : function() {

		requestAnimationFrame( this.renderCallback.bind(this) );
		
		if(TWEEN) TWEEN.update();
		if(this.controls) this.controls.update();

		if(this.hotPoints) this.hotPoints.update();

		this.renderer.render(this.scene, this.camera);
	},

	getPickedObject : function(x,y){
		 
		this.mouse.x = ( x / this.width ) * 2 - 1;
		this.mouse.y = - ( y / this.height ) * 2 + 1;

		
		this.raycaster.setFromCamera( this.mouse, this.camera );

		var intersects = this.raycaster.intersectObjects(this.pickingArray);
		return intersects.length > 0 ? intersects[ 0 ].object : null;
	},

	
	onMouseDown : function(event){

		event.preventDefault();

		if(this.pickingArray.length < 1) return;

		var x = event.pageX - this.container.offset().top; 
		var y = event.pageY - this.container.offset().left;
		if(_DEBUG_)console.log(x,y);

		var pickedMesh = this.getPickedObject(x,y);
        if (_DEBUG_) console.log(pickedMesh);

        if (pickedMesh !== null && pickedMesh.name == 'lfWheel') {

            HOTPOINTS_INFO['door'].spritePoint.visible = DOOR_INFO['LeftFront'].camera.state > 0 ? false : true; //进入车内 应该让所有热点不可见、不可拾取
            this.doorAnimate(DOOR_INFO['LeftFront']);
        }
	},

	initHotPoints : function(){

        _this = this;

		var material = new THREE.ShaderMaterial( {

			uniforms: {
				iGlobalTime: { value: 1.0 },
				iResolution: { value: new THREE.Vector2(this.width,this.height) }
			},
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			transparent:true

		} ); 

		//var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var geometry = new THREE.PlaneBufferGeometry( 15,15);

		// var mesh = new THREE.Sprite(material);
		// mesh.scale.multiplyScalar(15);

        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'lfWheel';
        mesh.position.copy(this.convert3dMaxAxis(HOTPOINTS_INFO['door'].position));
        HOTPOINTS_INFO['door'].spritePoint = mesh;
        this.pickingArray.push(mesh);
		this.scene.add(mesh);

		function resize(){

			material.uniforms.iResolution.value.x = 50;
			material.uniforms.iResolution.value.y = 50;
		}

		function update(){

			var delta = _this.clock.getDelta();

			material.uniforms.iGlobalTime.value = _this.clock.elapsedTime * 0.5;
			
			// mesh.rotation.y += delta * 0.5 ;
			// mesh.rotation.x += delta * 0.5 ;

		}

		this.hotPoints =  {

			resize : resize,
			update: update
		};
		
	}, 


	initCubeMap: function (path,format,nameIndex){

		var	imageNames = [    
			'px','nx','py','ny','pz','nz',
			'posx','negx','posy','negy','posz','negz',
			'xpos','xneg','ypos','yneg','zpos','zneg',
			'rt','lt','up','dn','ft','bk',
			'right','left','up','down','front','back'
		];

		var urls = [];
		for(var i = 0; i < 6; i++){
			urls.push(path + imageNames[nameIndex*6+i] + format);
		}

		var cubeMap = new THREE.CubeTextureLoader().load( urls );
		cubeMap.format = THREE.RGBFormat;

		return cubeMap;
	},

	//@param door : DOOR_INFO['LeftFront']
	doorAnimate: function(door){  

		var _this = this;

		var pos = this.convert3dMaxAxis(door.position);
		var preMat = new THREE.Matrix4().makeTranslation(-pos.x,-pos.y,-pos.z);
		var posMat = new THREE.Matrix4().makeTranslation(pos.x,pos.y,pos.z);
		
		var getMatrixFromPosAndYAngle = function(){

			var matrix;

			return function getMatrixFromPosAndYAngle(angle){

				if ( matrix === undefined ) matrix = new THREE.Matrix4();

				return matrix.makeRotationY(angle).multiply(preMat).premultiply(posMat);

			};
			
		}();


		function updateDoor(){

			var mat = getMatrixFromPosAndYAngle(door.state.angle);

			var meshes = door.meshArray;
			for(var i = 0 ; i < meshes.length ; i++){

                meshes[i].matrix.identity();
                meshes[i].applyMatrix(mat);
                meshes[i].scale.multiplyScalar(0.1);
                meshes[i].updateMatrix();
			}
		}	

		function tweenDoor(){

			var _angle = door.state.opened < 0 ? door.state.maxAngle : 0.0; 
			
			return  new TWEEN.Tween(door.state).to({angle:_angle}, 2000).onUpdate(updateDoor).start();
		}

		function tweenCamera(){

			var key = door.camera.state > 0 ? 'InCar' : 'OutCar';

			var pos = _this.convert3dMaxAxis(door.camera[key].position);

			return new TWEEN.Tween(_this.camera.position).to({x:pos.x,y:pos.y,z:pos.z}, 2000).start();
		}

		//return function switchDoor(){

		if(door.running) return; //考虑到扩展性，这种定义有误，应该所有动画共享一个running状态
		door.running = 1;

        tweenDoor().onComplete(function () { 
			
            _this.changeControlsState(door.camera.state);
            door.state.opened *= -1;
            tweenCamera().onComplete(function () {
                tweenDoor().onComplete(function () {
                    door.camera.state *= -1;
                    door.running = 0;
                    door.state.opened *= -1;
                    HOTPOINTS_INFO['door'].spritePoint.visible = door.camera.state > 0 ? true : false; //进入车内 应该让所有热点不可见、不可拾取
                    var ui = document.getElementById('showParameter');
                    ui.style.visibility = door.camera.state > 0 ? "hidden" : "visible";
                });
			});

		});

	},


	initMaterials : function(srcUrl,envCubeMap,envCubeMap2){

		var _this = this;

		// var textureBasePath = this.textureUrl + srcUrl;

		// var loadTexture = function(name){

		// 	var _tex = _this.textureLoader.load(textureBasePath + name );
		// 	_tex.anisotropy = 8;
		// 	_tex.format = THREE.RGBFormat;

		// 	return _tex;
		// };

		// var map_cheAo = loadTexture('ao.jpg');

		var def_color = 0xffffff;
		var def_black = 0x222222;
		var def_white = 0xffffff;
		var def_gray = 0x888888;
		var def_red = 0xff0000;

		var createMat = function(type,color,map){

			var _color = color ? color : def_color;
			var _map = map ? map : null;
			

			if(type == 'jinshu'){

				return new THREE.MeshPhongMaterial({
					color: _color,
					side:THREE.DoubleSide,
					map:_map,
					//aoMap : map_cheAo,
					envMap: envCubeMap2,
					shininess:20,
		            specular:0xffffff,
		            emissive: 0x323232,
		            reflectivity : 1.0
				});

			}else if(type == 'suliao'){

				return new THREE.MeshPhongMaterial({
					color: _color,
					side:THREE.DoubleSide,
					map:_map,
					specular:0x383838,
					shininess: 20
				});

			}else if(type == 'boli'){

				return new THREE.MeshBasicMaterial( { 
					color: _color, 
					envMap: envCubeMap2, 
					opacity: 0.35, 
					transparent: true, 
					combine: THREE.MixOperation, 
					reflectivity: 0.25 
				} );
			}
		}


		this.HtMaterial['cheshen'] = new THREE.MeshPhongMaterial({
			side : THREE.DoubleSide,
			//aoMap : map_cheAo,
			aoMapIntensity: 1.0,
			envMap : envCubeMap
			
        });
        this.updateMaterial('cheshen',itemsColors['cheshen']['bai']);

        this.HtMaterial['lahua'] = new THREE.MeshBasicMaterial({
            transparent: true,
        });

		this.HtMaterial['cheding'] = _this.HtMaterial['cheshen'].clone();
		this.HtMaterial['cheding'].envMap = envCubeMap2;
		this.HtMaterial['cheding'].reflectivity = 1.0;

		this.HtMaterial['peijian'] = createMat('jinshu',def_black);

		this.HtMaterial['boli'] = new THREE.MeshBasicMaterial({ 
			color : def_gray, 
			envMap : envCubeMap, 
			opacity : 0.35, 
			transparent : true, 
			combine : THREE.MixOperation, 
			reflectivity: 0.25 
		});

		this.HtMaterial['kaqian'] = new THREE.MeshPhongMaterial({
			envMap : envCubeMap2,
			color : 0x222222,
			reflectivity: 1.0,
			shininess:19
		});
		

		this.HtMaterial['neishi1'] = new THREE.MeshPhongMaterial({
			color : def_gray
		});

		this.HtMaterial['neishi2'] = new THREE.MeshPhongMaterial({
			color : def_gray
		}); 

		this.HtMaterial['zuoyi']  = new THREE.MeshPhongMaterial({
			color : def_gray
		}); 

		var boli_tianchuang = new THREE.MeshBasicMaterial( { 
			color: 0x1a1a1a, 
			envMap: envCubeMap2, 
			opacity: 0.75, 
			transparent: true, 
			combine: THREE.MixOperation, 
			reflectivity: 0.15 
		} );

		this.mats =  {

			"jinshu_bai" : _this.HtMaterial['cheshen'],                                     //车身
			"jinshu_bai_cheding" : _this.HtMaterial['cheding'],                         //车顶
			"boli_yinsi" : _this.HtMaterial['boli'],                               		//车窗玻璃
			"jinshu_peijian" : _this.HtMaterial['peijian'],                      		//运动配件 改颜色
			"jinshu_hongse" : _this.HtMaterial['kaqian'],								//卡钳

			"xiangjiao_zuoyi" : _this.HtMaterial['zuoyi'],	  							//座椅
			"suliao_neishi1" : _this.HtMaterial['neishi1'],	 							//内饰2
            "suliao_neishi2": _this.HtMaterial['neishi2'],	  							//内饰1

            "lahua": _this.HtMaterial['lahua'],	                                          //拉花

			"jinshu_heise" : createMat('suliao',def_gray),             //运动配件 有无 不改颜色
			"jinshu_yinse" : createMat('jinshu',def_white),  			
			"boli_tianchuang" : boli_tianchuang,
			"boli_dengzhao" : createMat('boli',0x223333),
			"boli_houshijing" :  createMat('suliao',def_black),
            "xiangjiao_luntai": createMat('suliao', def_gray/*,map_luntai*/),  //轮胎
            "Material__2583" : createMat('suliao', def_gray),
            "Material__2578" :  createMat('suliao', def_gray),
            "Material__2580": createMat('suliao', def_gray),
            "Material__2573": createMat('suliao', def_gray),
            "Material__2590": createMat('suliao', def_gray),
            "suliao_cheding2": createMat('suliao', def_gray)
            
		};

	},

	setMeshVisible: function (key, state) {

        var curModel = this.HtData.config[key];

        if (curModel.loadState == 1){

            curModel.visible = state;
            curModel.node.visible = state;

        }else if (curModel.loadState == -1) {

           this.parseHT(key,curModel,function(){
           		curModel.visible = state;
            	curModel.node.visible = state;
           });

        }else {

        	console.warn('模型加载中,状态应该为0！,而状态为:'+curModel.loadState );
        }
    },

    setMultiVisible: function (name, isVisible) {

        var vcNames = this.HtData.getMeshName(name);
        for (var i = 0; i < vcNames.length; i++) {

            this.setMeshVisible(vcNames[i], isVisible);

        }
    },


	parseHT : function(key,curModel,onLoad){

		var _this = this;
		curModel.loadState = 0;

    	JSZipUtils.getBinaryContent( this.modelUrl + key + '.ht', function (err, data) {

            if (err) { throw err; }// or handle err

	        var text = new JSZip(data).file(key + '.obj').asText();
            var object = _this.htLoader.parse(text).children[0];
            object.material = _this.mats[curModel.materialName];
	        object.scale.multiplyScalar(0.1);
            _this.HtData.setValueMesh(object, key);
	        _this.scene.add(object);
            
	        if( typeof onLoad === 'function' ){
	        	onLoad();
	        }

       	});
	},

    loadLahuaNode : function() {

        var vcName = this.HtData.getMeshName('lahua');
        for (var j = 0; j < vcName.length; j++) {

            var lahuaObj = this.HtData.getMeshNode(vcName[j]).clone();
            if (lahuaObj === undefined) { return false;}
            this.scene.add(lahuaObj);
            lahuaObj.material = this.mats['lahua'];
            lahuaObj.material.needsUpdate = true;
            lahuaObj.visible = false;
            var name = 'lahua_' + vcName[j];
            this.HtData.config[name] = {

                isFirScreen: 1,
                visible: false,
                loadState: 1, // -1未加载 0 加载中 1加载完成
                node: lahuaObj,
                materialName: 'lahua'
            
            };

        }
    },

    loadTexture : function(name, callback) {

        var anisotropy = this.renderer.getMaxAnisotropy();
        var _this = this;

        var _tex = this.textureLoader.load(this.textureUrl + name, function (texture) {

            _this.HtData.setValueTexture(texture, name);
            var texTure = _this.HtData.texture;
            texture.anisotropy = anisotropy;
            for (var i = 0; i < texTure[name].materialName.length; i++) {

                var curName = texTure[name].materialName[i];
                _this.mats[curName][texTure[name].map] = texture;
                _this.mats[curName].needsUpdate = true;

            }
            if (callback !== undefined) { callback(); }

        });
        return _tex;
    },

    loadTexFiles : function(screenNum,callback) {

        var texTure = this.HtData.texture;
        var _this = this;
        function isLoadFinish() {

            if (_this.HtData.isFirLoadTextureFinish() && typeof callback === 'function') { 

            	_this.loadTexFiles(0);
            	callback(0);
            }  
        }

        for (var key in texTure) {

            if (texTure[key].isFirScreen !== screenNum) { continue; }
            texTure[key].loadState = 0;
            var _tex = this.loadTexture(key, isLoadFinish);
        
        }
    },

	loadHtFiles : function(url) {

		this.modelUrl += url;
		var _this = this;
;

	    var loadHT = function(isFirst){

	    	var config = _this.HtData.config;
	    	for (var key in config) {

		        var curModel = config[key];
		        if(curModel.isFirScreen !== isFirst) continue;
                _this.parseHT(key, curModel, function () {

                    if (isFirst) {

                        if (_this.HtData.isFirLoadMeshFinish()) {

                            //console.timeEnd('firstScreen');

                            _this.firstTime = _this.clock.getDelta();
			       			//首屏加载完
			       			//复制拉花mesh
                            _this.loadLahuaNode();
                            // 车门部件
                            var names = _this.HtData.getMeshName('chemen');
                            for (var i = 0; i < names.length; i++) {

                                DOOR_INFO.LeftFront.meshArray.push(_this.HtData.getMeshNode(names[i])); 
                            }
                            var names = _this.HtData.getMeshName('chemenlahua');
                            for (var i = 0; i < names.length; i++) {

                                DOOR_INFO.LeftFront.meshArray.push(_this.HtData.getMeshNode(names[i]));
                            }
                            _this.initHotPoints();
			       			//首屏贴图加载
			       			_this.loadTexFiles(1,loadHT);
			       			
			       		}
			       	}else{

                        if (_this.HtData.isSecLoadMeshFinish()) {

			       			//console.timeEnd('totalScreen');
			       			_this.secondTime = _this.clock.getDelta();

			       			var totalTime = _this.firstTime + _this.secondTime;

			       			_this.debugStr = '首屏:'+_this.firstTime+'s 总:'+totalTime+'s 设备:'+navigator.userAgent;
	            			//第二屏加载完
		       			}
			       	}
		        });
		    }

		};
        loadHT(1);

	}

};

