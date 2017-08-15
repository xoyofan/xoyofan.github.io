!function(){

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
    

    $('#carType .new-sub li').click(function() {

        //车型

        var id = $(this).index();
       
        //精英型 轮毂1 无天窗
        if (id == 0) {

            viewer.setMultiVisible('dipei_lungu',true);
            viewer.setMultiVisible('gaopei_lungu',false);
            viewer.setMultiVisible('wuTianChuangcheding',true);
            viewer.setMultiVisible('tianChuangcheding',false);
           
            viewer.setMeshVisible('yaoshikou',true);
            viewer.setMeshVisible('yijianqidong',false);
            viewer.setMeshVisible('wukongtiao',true);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(itemsBoliColor[0]);
        }
        //豪华型 轮毂1 天窗
        else if (id == 1) {

            viewer.setMultiVisible('dipei_lungu',true);
            viewer.setMultiVisible('gaopei_lungu',false);
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
      
            viewer.setMeshVisible('yaoshikou',true);
            viewer.setMeshVisible('yijianqidong',false);
            viewer.setMeshVisible('wukongtiao',true);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(itemsBoliColor[0]);
        }
        //尊贵型 轮毂2 隐私玻璃
        else if (id == 2) {

            viewer.setMultiVisible('dipei_lungu',false);
            viewer.setMultiVisible('gaopei_lungu',true);
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
            
            viewer.setMeshVisible('yaoshikou',false);
            viewer.setMeshVisible('yijianqidong',true);
            viewer.setMeshVisible('wukongtiao',false);
            //玻璃
            viewer.HtMaterial['boli'].color = new THREE.Color(itemsBoliColor[1]);
        }

    });

    $("#showParameter").click(function () {
        // var ui = document.getElementById('showParameter');
        // ui.style.visibility = "hidden";
        $("#showParameter").css('visibility',"hidden");
        viewer.doorAnimate(DOOR_INFO['LeftFront']);
    });
        //出车门

    var keys=['bai','yin','hong','hui'];

    $('#bodyColor .new-sub li').click(function() {

        var id = $(this).index();
        curColorId = id;

        viewer.updateMaterial('cheshen',itemsColors['cheshen'][keys[id]]);
        viewer.updateMaterial('cheding', itemsColors['cheshen'][keys[id]]);

    });

    //运动外观套件
    $('#peijian .new-sub li').click(function () {

        var id = $(this).index();//$(this).attr("id");
       
        //运动套件无

        if (id == 0) {
            viewer.setMultiVisible('peijian_zhengti',false);
            viewer.HtMaterial['kaqian'].color = new THREE.Color(0x222222);
        }
        else {
            viewer.setMultiVisible('peijian_zhengti',true);
            viewer.HtMaterial['peijian'].color = new THREE.Color(itemsPeijianColor[id]);
            viewer.HtMaterial['kaqian'].color = new THREE.Color(0xaa001a);
        }
    });
    
    $('#topColor .new-sub li').click(function() {

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
    $('#boli .new-sub li').click(function () {

        var id = $(this).index();
      
        new TWEEN.Tween(viewer.HtMaterial['boli'].color).to(new THREE.Color(itemsBoliColor[id]), 1000).start();
       
    });
    //玻璃

    //天窗
    $('#tianchuang .new-sub li').click(function () {
        var id = $(this).index();//$(this).attr("id");
        //天窗无
        if (id == 0) {
            
            viewer.setMultiVisible('wuTianChuangcheding',true);
            viewer.setMultiVisible('tianChuangcheding',false);
        }else {
            
            viewer.setMultiVisible('wuTianChuangcheding',false);
            viewer.setMultiVisible('tianChuangcheding',true);
        }
    });
        //天窗


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
        })(itemsLaHua[id]);
       

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

    //viewer.initGui('cheshen',itemsColors['cheshen']['hong']);

}();