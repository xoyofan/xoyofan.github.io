!function(){

	if(!Detector.support3D){
		alert('该浏览器不支持3D显示，请使用2D图片方案！')
		return;
	}

	var tmp = 1;
	$("#menu").click(function() {
		$(".topRight ul").toggle();
		 tmp *= -1;
		$(this).css("transform", "rotateZ(" + tmp  * 180 + "deg)");
		$(this).css("-webkit-transform", "rotateZ(" + tmp * 180 + "deg)");
		$(this).css("-moz-transform", "rotateZ(" + tmp * 180 + "deg)");
	});
	$("#showParameter").click(function() {
		$("#parameter0" ).toggle();
	});

	$('.models li').click(function() {

		//车型

        var id = $(this).index();
        strModel = $(this).text();
        var bolicolor = [
            0x223333,
            0x225533
        ];
        //精英型 轮毂1 无天窗
        if (id == 0) {

            viewer.setMultiVisible('dipei_lungu',true);
            viewer.setMultiVisible('gaopei_lungu',false);
            viewer.setMultiVisible('wuTianChuangcheding',true);
            viewer.setMultiVisible('tianChuangcheding',false);
           
            viewer.setMeshVisible('anniu', false);
            viewer.setMeshVisible('anniu2', false);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(bolicolor[0]);
        }
        //豪华型 轮毂1 天窗
        else if (id == 1) {

            viewer.setMultiVisible('dipei_lungu',true);
            viewer.setMultiVisible('gaopei_lungu',false);
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
      
            viewer.setMeshVisible('anniu', false);
            viewer.setMeshVisible('anniu2', true);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(bolicolor[0]);
        }
        //尊贵型 轮毂2 隐私玻璃
        else if (id == 2) {

            viewer.setMultiVisible('dipei_lungu',false);
            viewer.setMultiVisible('gaopei_lungu',true);
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
            
            viewer.setMeshVisible('anniu', true);
            viewer.setMeshVisible('anniu2', true);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(bolicolor[1]);
        }

	});

    $("#showParameter").click(function () {
        var ui = document.getElementById('showParameter');
        ui.style.visibility = "hidden";
        viewer.doorAnimate(DOOR_INFO['LeftFront']);
    });
		//出车门

    var keys=['bai','yin','hong','hui'];
    var curColorId = 0;

	$('.color li').click(function() {

		var id = $(this).index();
        curColorId = id;

		viewer.updateMaterial('cheshen',itemsColors['cheshen'][keys[id]]);
        viewer.updateMaterial('cheding', itemsColors['cheshen'][keys[id]]);

	});

    //运动外观套件
    $(".topRight .peijian_color li").click(function () {

        var id = $(this).index();//$(this).attr("id");
        var peijiancolor = [
            0x555555,
            0xffffff,
            0xff9900,
            0x0099ff,
            0x00ff00
        ];
        //运动套件无

        if (id == 0) {
            viewer.setMultiVisible('peijian_zhengti',false);
            viewer.HtMaterial['kaqian'].color = new THREE.Color(0x222222);
        }
        else {
            viewer.setMultiVisible('peijian_zhengti',true);
            viewer.HtMaterial['peijian'].color = new THREE.Color(peijiancolor[id]);
            viewer.HtMaterial['kaqian'].color = new THREE.Color(0xaa001a);
        }
    });
    
	$('.cheding_color li').click(function() {

        var id = $(this).index();
     
        //与车身同色
        if (id == 0) {

            viewer.updateMaterial('cheding',itemsColors['cheshen'][keys[curColorId]]);
        }
        //炭晶灰
        else if (id == 1) {
             viewer.updateMaterial('cheding',itemsColors['cheding']['hei']);
        }
        //纯白
        else if (id == 2) {
            viewer.updateMaterial('cheding',itemsColors['cheding']['bai']);
        }
		
    });

    //玻璃
    $(".topRight .boli li").click(function () {

        var id = $(this).index();
        var bolicolor = [
            0x888888,
            0x225533
        ];
        new TWEEN.Tween(viewer.HtMaterial['boli'].color).to(new THREE.Color(bolicolor[id]), 1000).start();
       
    });
	//玻璃

    //天窗
    $(".topRight .tianchuang li").click(function () {
        var id = $(this).index();//$(this).attr("id");
        //天窗无
        if (id == 0) {
            
            viewer.setMultiVisible('wuTianChuangcheding',true);
            viewer.setMultiVisible('tianChuangcheding',false);
        }
        else {
            
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
        }
    });
		//天窗

    //拉花
    $(".topRight .lahua li").click(function () {
        var id = $(this).index();
        //无
        if (id == 0) {

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], false);
            }

        }
        //赛道风云
        else if (id == 1) {

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], true);
            }
            if (viewer.HtData.texture['chetie3.png'].loadState == -1) {

                viewer.HtData.texture['chetie3.png'].loadState = 0;
                viewer.HtMaterial['lahua'].map = viewer.loadTexture('chetie3.png');
            }
            else {

                viewer.HtMaterial['lahua'].map = viewer.HtData.texture['chetie3.png'].node;
            }
        }
        //御风而行
        else if (id == 2) {

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], true);
            }
            if (viewer.HtData.texture['chetie4.png'].loadState == -1) {

                viewer.HtData.texture['chetie4.png'].loadState = 0;
                viewer.HtMaterial['lahua'].map = viewer.loadTexture('chetie4.png');
            }
            else {

                viewer.HtMaterial['lahua'].map = viewer.HtData.texture['chetie4.png'].node;
            }
        }
        //繁花似锦
        else if (id == 3) {

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], true);
            }

            if (viewer.HtData.texture['chetie2.png'].loadState == -1) {

                viewer.HtData.texture['chetie2.png'].loadState = 0;
                viewer.HtMaterial['lahua'].map = viewer.loadTexture('chetie2.png');
            }
            else {

                viewer.HtMaterial['lahua'].map = viewer.HtData.texture['chetie2.png'].node;
            }

        }
        //缤纷生活
        else if (id == 4) {

            var vcNames = viewer.HtData.getMeshName('lahua');
            for (var i = 0; i < vcNames.length; i++) {
                viewer.setMeshVisible('lahua_' + vcNames[i], true);
            }

            if (viewer.HtData.texture['chetie.png'].loadState == -1) {

                viewer.HtData.texture['chetie.png'].loadState = 0;
                viewer.HtMaterial['lahua'].map = viewer.loadTexture('chetie.png');
            }
            else {

                viewer.HtMaterial['lahua'].map = viewer.HtData.texture['chetie.png'].node;
            }
        }
    });

    $("#TimeString").click(function () {

        alert(viewer.debugStr);

    });

    

}();



!function(){

	var filePath = Detector.isMobile() ? 'mobile/' : 'pc/';
	viewer = new carViewer('goodsViewer',filePath);

	viewer.init();


	
    var envCubeMap2 = viewer.initCubeMap('images/cubeTop/','.png',0);

    var envCubeMap = new THREE.TextureLoader().load('images/equire_forest.jpg' );
    envCubeMap.mapping = THREE.SphericalReflectionMapping;
    envCubeMap.format = THREE.RGBFORMAT;

    viewer.initMaterials('',envCubeMap,envCubeMap2);
    viewer.loadHtFiles('ht/');

}();