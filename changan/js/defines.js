var _DEBUG_ = false; //一些调试状态下的定义和输出。

var _MOBILE_ = Detector.isMobile; //判断当前设备是否为手机，非平板和PC。因为将要采用两套模型和贴图，按此区分。

var viewer;

//初始相机参数。由于每个车门的打开关闭时相机的位置不同，因此将其定义在每个车门结构中。
var CAM_INFO = {

	position : [-203.24515318007838,130.4666925164717,403.3807716600176,false],
    target   : [135.59099718925472,59.633483611841704,-17.89080818498167,false]
};


// 热点位置
var HOTPOINTS_INFO = {
    'door': {
        position: [126.4876,-86.8229,100.1199, true],
        spritePoint: null,
        textureInfo: 'point.png',
        material: null
    }

};
//考虑到扩展性，由于每个车门动画类似，将其所有状态和参数进行如下定义
var DOOR_INFO = { 

	'LeftFront' : {

		meshArray:[], //该车门包含的模型部件组
        position: [43.2579,- 82.5649,35.36,true],//车门的旋转轴上的一点， true表示该坐标为3DMAX的坐标
		state:{   //车门动画时，车门模型组的状态记录。考虑到扩展性，这里应该定义旋转方向。此时默认为绕Y轴
			angle: 0, //初始弧度
			maxAngle: -Math.PI/2.5, //车门转动的最大弧度
			opened: -1 //车门当前开关的状态 ： -1 未打开 1 打开
		},
		camera:{  //车门动画时，相机的状态记录。

			'InCar' : {
                //position : [154.253,125.38468,34.1564,false], // true表示该坐标为3DMAX的坐标,否则为WEBGL坐标系
				position : [152.3860219274,133.80737508,34.658120401,false], // true表示该坐标为3DMAX的坐标,否则为WEBGL坐标系
                target   : [-20,-10,0,false],
				//target   : [134.253,125.3846,34.1564,false],
				distance : [10,200],
				polarAngle: [10,170]
			},

			'OutCar' : {
                // position: [-160.36538646927596, 381.21672804031414, 744.9420325681753, false],
                // target: [136.37329650529378, 94.8081188547417, -14.842498488645418, false],
                position : [-203.24515318007838,130.4666925164717,403.3807716600176,false],
                target   : [135.59099718925472,59.633483611841704,-17.89080818498167,false],
				distance : [400,1000],
				polarAngle: [10,89]
			},

			state : 1 //相机在车外 ，-1则为车内
		},
		running : 0 //当前动画是否在运行 1：是 0 ：否
	}
};

var itemsColors = {

    'cheshen':{
        'bai':{
            toneMappingExposure:1.2,
            reflectivity: 0.1,
            shininess:10,
            specular:0x343434,
            color: 0xffffff,
            emissive: 0x373737
        },
        'yin':{
            toneMappingExposure:1.2,
            reflectivity: 0.1,
            shininess:22,
            specular:0x595959,
            color: 0xaaaaaa,
            emissive: 0x161616
        },
        'hong':{
            toneMappingExposure:1.3,
            reflectivity: 0.1,
            shininess:19,
            specular:0x612d29,
            color: 0x8c1c1c,
            emissive: 0x3d1111
        },
        'hui':{
            toneMappingExposure:1.2,
            reflectivity: 0.1,
            shininess:10,
            specular:0x3c3c3c, 
            color: 0x183355,//0x3e4859,//109 122 138  6d 7a 8a
            emissive: 0x414141
        }
    },
    'cheding':{
        'bai':{
            toneMappingExposure:1.2,
            reflectivity: 0.1,
            shininess:10,
            specular:0x343434,
            color: 0xffffff,
            emissive: 0x373737
        },
        'hei':{
            toneMappingExposure:1.2,
            reflectivity: 0.1,
            shininess:22,
            specular:0x595959,
            color: 0x666666,
            emissive: 0x161616
        }
    }
};



var _TEXTURE_ = {

    'ao.jpg': {
       isFirScreen: 1,
       loadState: -1, // -1未加载 0 加载中 1加载完成
       map: 'aoMap',
       materialName: ['jinshu_bai','jinshu_bai_cheding','jinshu_peijian','jinshu_yinse','jinshu_heise'],
       node: undefined
    },
    'zuoyi.jpg': {
        isFirScreen: 0,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['xiangjiao_zuoyi'],
        node: undefined
    },
    //'cheding2.jpg': {
    //    isFirScreen: 0,
    //    loadState: -1, // -1未加载 0 加载中 1加载完成
    //    map: 'map',
    //    materialName: ['suliao_cheding2'],
    //    node: undefined
    //},
    'neishi2.jpg': {
        isFirScreen: 0,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['Material__2578', 'suliao_neishi2', 'Material__2580'],
        node: undefined
    },
    'neishi1.jpg': {
        isFirScreen: 0,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['suliao_neishi1'],
        node: undefined
    },
    'luntai.jpg': {
        isFirScreen: 1,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['Material__2573', 'xiangjiao_luntai', 'Material__2583'],
        node: undefined
    },
    'chetie.png': {
        isFirScreen: -1,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['lahua'],
        node: undefined
    },
    'chetie2.png': {
        isFirScreen: -1,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['lahua'],
        node: undefined
    },
    'chetie3.png': {
        isFirScreen: -1,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['lahua'],
        node: undefined
    },
    'chetie4.png': {
        isFirScreen: -1,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        map: 'map',
        materialName: ['lahua'],
        node: undefined
    }
};
var _MODELS_ = {

    'anniu': {
        isFirScreen: 1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'Material__2578'
    },
    'anniu2': {
        isFirScreen: 1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'Material__2580'
    },
    'chedi': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'zuoyi': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'xiangjiao_zuoyi'
    },
    'yibiaopan': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'suliao_neishi2'
    },

    'cheshen': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_bai'
    },
    'chechuang': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_yinsi'
    },
    'chemennei': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'geshan2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'chemennei2': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'deng2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_hongse'
    },
    'deng': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'Material__2573'
    },

    'geshan': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'cheshen2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'luosi': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'zhuangxiangpan': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'suliao_neishi2'
    },
    'chuwuxiang': {
        isFirScreen: 0,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'xiangjiao_zuoyi'
    },
    'luntai': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'xiangjiao_luntai'
    },
    'chepai': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'xiangjiao_luntai'
    },
    'lunguB1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'luntaiB': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'xiangjiao_luntai'
    },
    'cheshen3': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'shachepian': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'shachepian1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_hongse'
    },
    'peijian': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'lunguA1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'zuochemenB': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成 
        node: undefined,
        materialName: 'jinshu_bai'
    },
    'zuochechuangB': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_yinsi'
    },
    'zuochechuangA': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_yinsi'
    },
    'youchechuangA': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_yinsi'
    },
    'youchechuangB': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_yinsi'
    },
    'zuochemenA2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'zuochemenB2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'youchemenB2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'youchemenA2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'tianchuang': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_dengzhao'
    },
    'peijian2': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_peijian'
    },
    'cheding2_wuchuang': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'cheding': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_bai_cheding'
    },
    'zuochemenA': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_bai'
    },
    'cheding2': {
        isFirScreen: -1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'suliao_neishi1'
    },
    'cheding1_wuchuang': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_bai_cheding'
    },
    'cheding1': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'youchemenA': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_bai'
    },
    'youchemenB': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_bai'
    },
    'peijian3': {
        isFirScreen: -1,
        visible: false,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'zuochemenA1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'zuochemenA3': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'zuochemenA4': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'Material__2583'
    },
    'zuochemenB3': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'zuochemenB1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'zuochemenA5': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_houshijing'
    },
    'youchemenA1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'youchemenA3': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'youchemenA4': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'xiangjiao_luntai'
    },
    'youchemenB1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'youchemenB3': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_yinse'
    },
    'youchemenA5': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_houshijing'
    },
    'dengzhao': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'boli_dengzhao'
    },
    'shachepian1': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_hongse'
    },
    'lunguA2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    },
    'luntaiA': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'xiangjiao_luntai'
    },
    'lunguB2': {
        isFirScreen: 1,
        visible: true,
        loadState: -1, // -1未加载 0 加载中 1加载完成
        node: undefined,
        materialName: 'jinshu_heise'
    }

};