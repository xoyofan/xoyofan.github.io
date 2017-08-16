'use strict'
!function(){

    var c = 0;
    var t;

    function timedCount()
    {
        
        c=c+1;
        if(c>100){
            clearTimeout(t);
        }else{
            $('#LoadingProgress').css('width',c+'%');
            t = setTimeout(timedCount,100);
        }
        

    }
    timedCount();


	if(!Detector.support3D){
		alert('该浏览器不支持3D显示，请使用2D图片方案！')
		return;
	}

	var tmp = 1;
	$("#menu").click(function() {
		 //$(".menu").toggle();
         $(".bottomMenu").slideToggle("slow"); 
		 tmp *= -1;
		$(this).css("transform", "rotateZ(" + tmp  * 180 + "deg)");
		$(this).css("-webkit-transform", "rotateZ(" + tmp * 180 + "deg)");
		$(this).css("-moz-transform", "rotateZ(" + tmp * 180 + "deg)");
	});
    $(".menu").click(function() {

        
        if ($(this).hasClass("cura")) {
            $(this).children(".new-sub").hide();
            $(".menu").removeClass("cura");
        } else {
            $(".menu").removeClass("cura");
            $(this).addClass("cura"); 
            $(".menu").children(".new-sub").slideUp("normal"); 
            $(this).children(".new-sub").slideDown("normal"); 
        }
    });
	

    //车型
	$('#carType .new-sub li').click(function() {

        var id = $(this).index();
    
        for(var key in ITEMS["carType"]){

            var _value = ITEMS["carType"][key][id];

            if(key == 'boli'){
                viewer.HtMaterial['boli'].color = new THREE.Color(_value);
            }else{    

                var isMulti = ITEMS["carType"][key][3];        
                if(isMulti == 1){
                    viewer.setMultiVisible(key,_value);
                }else{
                    viewer.setMeshVisible(key,_value);
                }
            }
        }
 

	});
    //开关车门
    $("#showParameter").click(function () {
        // var ui = document.getElementById('showParameter');
        // ui.style.visibility = "hidden";
        $("#showParameter").css('visibility',"hidden");
        viewer.doorAnimate(DOOR_INFO['LeftFront']);
    });

    var curColorId = 0;
    //车身颜色
    var keys=['bai','yin','hong','hui'];

	$('#bodyColor .new-sub li').click(function() {

		var id = $(this).index();
        curColorId = id;

        var params = ITEMS['mainColor']['cheshen'][keys[id]];

		viewer.updateMaterial('cheshen',params);
        viewer.updateMaterial('cheding',params);

	});

    //车顶颜色
    $('#topColor .new-sub li').click(function() {

        var id = $(this).index();
     
        //与车身同色
        if (id == 0) {

            viewer.updateMaterial('cheding',ITEMS['mainColor']['cheshen'][keys[curColorId]]);
        }
        //炭晶灰
        else if (id == 1) {
             viewer.updateMaterial('cheding',ITEMS['mainColor']['cheding']['hei']);
        }
        //纯白
        else if (id == 2) {
            viewer.updateMaterial('cheding',ITEMS['mainColor']['cheding']['bai']);
        }
        
    });

    //运动外观套件
    $('#peijian .new-sub li').click(function () {

        var id = $(this).index();//$(this).attr("id");
       
        //运动套件无

        var isVisible = id == 0 ? false : true;
        viewer.setMultiVisible('peijian_zhengti',isVisible);

        //卡钳颜色：无外观套件为灰，有则为红色
        var kaqianColor = id == 0 ? ITEMS["kaqianColor"][0] : ITEMS["kaqianColor"][1];
        viewer.HtMaterial['kaqian'].color = new THREE.Color(kaqianColor);
        //套件颜色
        viewer.HtMaterial['peijian'].color = new THREE.Color(ITEMS["peijianColor"][id]);
    });
    


    //玻璃
    $('#boli .new-sub li').click(function () {

        var id = $(this).index();
      
        new TWEEN.Tween(viewer.HtMaterial['boli'].color).to(new THREE.Color(ITEMS["boliColor"][id]), 1000).start();
       
    });
	

    //天窗
    $('#tianchuang .new-sub li').click(function () {

        var id = $(this).index();

        var hasTianchuang = id == 0 ? false : true;
        viewer.setMultiVisible('wuTianChuangcheding',!hasTianchuang);
        viewer.setMultiVisible('tianChuangcheding',hasTianchuang);

    });


    //拉花
    $('#lahua .new-sub li').click(function () {

        var id = $(this).index();

        (function(name){

            var bVisible = name === undefined ? false : true;

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], bVisible);
            }
            
            if(!bVisible) return;

            if (viewer.HtData.texture[name].loadState == -1) {

                viewer.HtData.texture[name].loadState = 0;
                viewer.HtMaterial['lahua'].map = viewer.loadTexture(name);
            }else {

                viewer.HtMaterial['lahua'].map = viewer.HtData.texture[name].node;
            }
        })(ITEMS["lahua"][id]);
       

    });

    $("#TimeString").click(function () {

        alert(viewer.debugStr);

    });

 

    

}();


!function(){

	var filePath = Detector.isMobile() ? 'mobile/' : 'pc/';//判断当前设备是否为手机，非平板和PC。因为将要采用两套模型和贴图，按此区分。
	viewer = new carViewer('goodsViewer',filePath);

	viewer.init();

	
    var envCubeMap2 = viewer.initCubeMap('images/lightBr/','.jpg',0);

    var envCubeMap = viewer.initCubeMap('images/cube_hw/','.jpg',0);

    // var envCubeMap = new THREE.TextureLoader().load(filePath+'/textures/equire_forest.jpg' );
    // envCubeMap.mapping = THREE.SphericalReflectionMapping;
    // envCubeMap.format = THREE.RGBFORMAT; 

    viewer.initMaterials(envCubeMap,envCubeMap2);
    viewer.loadHtFiles('ht/');

   // viewer.initGui('cheshen',ITEMS['mainColor']['cheshen']['hong']);

}();
