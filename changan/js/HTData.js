
function HTData(htConfig,texConfig) {

    this.config = htConfig;
    this.texture = texConfig;
   
    this.COUNT = {

        loadedMesh : 0,
        firScrMesh : 0,
        secScrMesh : 0,
        totalsMesh : 0,
        loadedTexture : 0,
        firScrTexture : 0,
        secScrTexture : 0,
        totalsTexture : 0

    };

    this.modelUrl = undefined;

    this.textureUrl = undefined;
   
    this.meshGroup = {

        'peijian_zhengti': ['peijian', 'peijian2', 'peijian3'],
        'tianChuangcheding': ['cheding', 'cheding1', 'tianchuang', 'cheding2'],
        'wuTianChuangcheding': ['cheding2_wuchuang', 'cheding1_wuchuang'],
        'dipei_lungu': ['lunguA1','lunguA2'],
        'gaopei_lungu': ['lunguB1', 'lunguB2'],
        'lahua': ['cheshen', 'zuochemenB', 'zuochemenA', 'youchemenA', 'youchemenB'],
        'chemenlahua': [ 'lahua_zuochemenA'],
        'chemen': ['zuochemenA','zuochemenA1','zuochemenA2','zuochemenA3','zuochemenA4',
            'zuochemenA5','zuochechuangA']

    };

    this.matGroup = {

        'cheshen' : null,
        'cheding' : null,
        'boli': null,
        'kaqian' : null,
        'peijian' : null,
        'neishi1' : null,
        'Material__2578' : null,
        'zuoyi': null,
        'lahua': null

    };
};

HTData.prototype = {

    constructor: HTData,

    init: function(){

         for (var key in this.config) {

            var _tmp = this.config[key].isFirScreen;

            if(_tmp == 1){

                this.COUNT.firScrMesh++;

            }else if(_tmp == 0){

                this.COUNT.secScrMesh++;

            }

            this.COUNT.totalsMesh++;
        }

        for (var key in this.texture) {

            var _tmp = this.texture[key].isFirScreen;

            if (_tmp == 1) {

                this.COUNT.firScrTexture++;

            }
            else if (_tmp == 0) {

                this.COUNT.textureSecScreen++;

            }

            this.COUNT.totalsTexture++;
        }

    },

    
    isFirLoadMeshFinish: function () {

        return this.COUNT.loadedMesh >= this.COUNT.firScrMesh ?  true : false;

    },

    isSecLoadMeshFinish: function () {

        return this.COUNT.loadedMesh >= (this.COUNT.firScrMesh + this.COUNT.secScrMesh) ? true : false;

    },

    isFirLoadTextureFinish: function () {

        return this.COUNT.loadedTexture >= this.COUNT.firScrTexture ?  true : false;

    },

    isSecLoadTextureFinish: function () {

        return this.COUNT.loadedTexture >= (this.COUNT.firScrTexture + this.COUNT.secScrTexture) ? true : false;

    },

    setValueMesh: function (child, name) {

        this.config[name].node = child;
        this.config[name].node.visible = this.config[name].visible;
        this.config[name].loadState = 1;
        this.COUNT.loadedMesh++;
    },

    setValueTexture: function (child,name) {

        this.texture[name].node = child;
        this.texture[name].loadState = 1;
        this.COUNT.loadedTexture++;
    },

    getMeshName: function (name) {

        return this.meshGroup[name];
    },

    getMeshNode: function (name) {

        return this.config[name].node;
    },

    getTextureNode: function (name) {

        return this.texture[name].node;
    }

};