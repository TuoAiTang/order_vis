<template>
  <div class="container">
    <div class="handle-box">
      <el-select
              v-model="orders"
              placeholder="订单列表"
              class="handle-input handle-select mr10"
              multiple
      >
        <el-option
                v-for="order in orderList"
                :key="order.name"
                :label="order.name"
                :value="order.id"
        ></el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
    </div>
    <div ref="map" class="map" id="main"></div>
  </div>
</template>

<script>
  /* eslint-disable */
  import mapConfig from '../data/map-config.json'
  import linesDataJson from '../data/lines-data.json'
  export default {
    name: 'Map',
    data () {
      return {
        linesData:linesDataJson,
        orderList:[],
        orders:[],
        chart: this.$echarts.ECharts,
        bmap: {},
        points:[
          {
            id: 1,
            name: '红枣新疆特产灰枣红枣',
            lineId: 1,
            pre: { 'id': 8, 'name': '西宁', 'value': [101.82139605321802, 36.62634069485973] },
            next: { 'id': 9, 'name': '乌鲁木齐', 'value': [87.53582115349052, 43.847009771041094] },
            travlled: 0.3,
            speed:'81km/h',
            express_id:'29028193178332342',
            img:'https://gaitaobao2.alicdn.com/tfscom/i1/2206510748148/O1CN01CcN5px2A3pj9CXz5M_!!2206510748148.jpg_240x240xz.jpg_.webp',
          },
          {
            id: 2,
            name: '红枣新疆特产灰枣红枣',
            lineId: 1,
            pre: { "id": 6, "name": "西安", "value": [108.94505006818304, 34.38216118776803] },
            next: { "id": 7, "name": "兰州", "value": [103.89904509514152, 36.03646139505536] },
            travlled: 0.3,
            speed:'81km/h',
            express_id:'29028193178332342',
            img:'https://gaitaobao2.alicdn.com/tfscom/i1/2206510748148/O1CN01CcN5px2A3pj9CXz5M_!!2206510748148.jpg_240x240xz.jpg_.webp',
          },
          {
            id: 3,
            name: '红枣新疆特产灰枣红枣',
            lineId: 1,
            next: { "id": 6, "name": "西安", "value": [108.94505006818304, 34.38216118776803] },
            pre: { "id": 14, "name": "石家庄", "value": [114.4712305290683, 38.07207484076872] },
            travlled: 0.3,
            speed:'81km/h',
            express_id:'29028193178332342',
            img:'https://gaitaobao2.alicdn.com/tfscom/i1/2206510748148/O1CN01CcN5px2A3pj9CXz5M_!!2206510748148.jpg_240x240xz.jpg_.webp',
          },
          {
            id: 22,
            name: '王味螺螺蛳粉253克*10',
            lineId: 2,
            pre: { "id": 18, "name": "长沙", "value": [113.071503, 28.152942] },
            next: { "id": 19, "name": "广州", "value": [113.264437, 23.154981] },
            travlled: 0.3,
            speed:'89km/h',
            express_id:'7843627483526545',
            img:'https://img.alicdn.com/imgextra/i4/2206448209116/O1CN01VO5B8R2HDB7xvf4Ol_!!0-item_pic.jpg_430x430q90.jpg',
          },
        ],
        linesSeries: [],
        scatterSeries: [],
        effectScatterSeries: [],
        mapZoom: 6,
        trainIcon: `path://M678.4 122.9c75.1-11.3 145.5 11.7 202.6 65.8 58 54.9 85.7 127.4 77.9 203.3-7.9 75-48.8 149-117.8 214.4-19.3 18.3-71 67.5-145.1 138.2-33.3 31.8-68.9 65.7-104.6 99.8l-34.8 33.1-13.8 13.2c-16.6 15.8-43 15.8-59.6 0L363.1 775.9l-25.4-24.2c-50.9-48.5-101.9-97-152.8-145.4C116 541 75 466.9 67.1 391.8c-7.9-76 19.9-148.3 77.9-203.3 57.1-54.1 127.6-77.1 202.6-65.8 55.8 8.5 112.3 35.4 165.4 78.5 53.2-43 109.7-70 165.4-78.3z`,
        // trainIcon: `path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z`
        // trainIcon: `image://https://tuocheng.oss-cn-beijing.aliyuncs.com/UTOOLS1586013674763.png`,
        carIcon: `image://https://tuocheng.oss-cn-beijing.aliyuncs.com/UTOOLS1586013674763.png`,
      }
    },
    async mounted () {
      await this.initAll();
    },
    methods: {
      async initAll() {
        await Promise.all([
          this.getOrdersOption(),
          this.getLinesData()
        ])
        this.initMap()
      },
      getOrdersOption() {
        this.orderList = [];
        return new Promise((res,rej)=>{
          this.$http.get("http://localhost:6789/orders").then(response => {
            this.orderList = response.data;
            res();
          })
        })

      },
      handleSearch(){
        console.log("orders:", this.orders);
        let linesData = [];
        for(let i = 0; i < this.linesData.length; i++){
          let line = this.linesData[i];
          for(let j = 0; j < this.orders.length; j++) {
            if (this.orders[i] === line.id){
              linesData.push(line);
              break;
            }
          }
        }
        // let linesData = this.linesData.filter(line => {
        //   for(let j = 0; j < this.orders.length; j++) {
        //     if (this.orders[i] === line.id){
        //       return true;
        //     }
        //   }
        //   return false;
        // });
        this.linesData = linesData;
        var add = (function(){
          var counter = 0;
          return function(){
            if (counter === 2) {
              counter = -1
            }
            return(++counter);
          }
        })();
        this.refreshSeries(this.points, add);
      },

      // refreshMap(){
      //   // setInterval(refreshSeries, 3);
      //   var points = this.points;
      //   var add = (function(){
      //     var counter = 0;
      //     return function(){
      //       if (counter === 2) {
      //         counter = -1
      //       }
      //       return(++counter);
      //     }
      //   })();
      //   setInterval(this.refreshSeries, 1000, points, add);
      // },

      refreshSeries(){
        console.log("refreshSeries");
        this.getLineSeries();
        this.getScatterSeries();
        this.getEffectScatterSeries();
        this.chart.setOption({
          series:[
            ...this.linesSeries, // 带有起点和终点信息的线数据的绘制
            ...this.scatterSeries, // 散点（气泡）图
            ...this.effectScatterSeries // 带有涟漪特效动画的散点（气泡）图
          ]
        })
      },
      getLinesData: function () {
        console.log("getLinesData");
        return new Promise((res,rej)=>{
          this.$http.get("http://localhost:6789/lines").then(response => {
            console.log("response.data:", response.data);
            this.linesData = response.data;
            console.log("回调函数里面：this.linesData:", this.linesData)
            res()
          });
        })

      },
      initMap () {
        this.chart = this.$echarts.init(document.getElementById("main"));
        console.log("this.linesData:", this.linesData);
        this.getLineSeries();
        this.getScatterSeries();
        this.getEffectScatterSeries();

        this.chart.setOption({
          animation: false,
          legend: {
            orient: 'vertical',
            top: 30,
            left: 30,
            data: this.linesData.map(v => v.name),
            textStyle: {
              color: '#222222'
            },
            selectedMode: 'multiple'
          },
          bmap: { // 加载 bmap 组件
            center: [104.114129, 37.550339],
            zoom: 6, // 地图当前的缩放比例
            roam: true, // 开启鼠标缩放和平移漫游
            mapStyle: {
              styleJson: mapConfig
            }
          },
          series: [
            ...this.linesSeries, // 带有起点和终点信息的线数据的绘制
            ...this.scatterSeries, // 散点（气泡）图
            ...this.effectScatterSeries // 带有涟漪特效动画的散点（气泡）图
          ]
        });
        // 获取百度地图实例，使用百度地图自带的控件
        this.bmap = this.chart.getModel().getComponent('bmap').getBMap();
        this.bmap.setMinZoom(6);// 设置地图最小缩放比例
        this.bmap.setMaxZoom(12); // 设置地图最大缩放比例
        // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
        this.bmap.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));// 在左下角显示比例尺控件
        const _this = this;
        // 监听地图比例缩放， 可以根据缩放等级控制某些图标的显示
        this.bmap.addEventListener('zoomend', function () {
          _this.mapZoom = _this.bmap.getZoom()
        });
      },
      getLineSeries () {
        let series = [];
        console.log("getLineSeries");
        console.log("this.linesData:", this.linesData);
        this.linesData.forEach(line => {
          series.push({
            name: line.name,
            type: 'lines',
            coordinateSystem: 'bmap',
            silent: true, // 图形不响应和触发鼠标事件
            polyline: true,
            lineStyle: { color: line.primaryColor },
            z: 3,
            // effect:{
            //   show:true,
            //   period:10,
            //   trailLength:0.3,
            //   symbolSize:[15, 15],
            //   color:'red',
            //   loop:false,
            // },
            data: [
              { // 浅色底线
                coords: line.stations.map(v => v.value),
                lineStyle: { // 单个数据（单条线）的样式设置。
                  normal: {
                    type: 'solid',
                    color: line.bgColor,
                    width: 4,
                    opacity: 0.6
                  }
                }
              },
              { // 深色虚线
                coords: line.stations.map(v => v.value),
                lineStyle: { // 单个数据（单条线）的样式设置。
                  normal: {
                    type: 'dashed',
                    color: line.primaryColor,
                    width: 4
                  }
                }
              }
            ]
          })
        });
        console.log("series:", series);
        this.linesSeries = series
      },
      getScatterSeries () {
        let series = [];
        this.linesData.forEach(line => {
          series.push({
            name: line.name,
            type: 'scatter',
            coordinateSystem: 'bmap',
            symbol: 'circle',
            symbolSize: 10,
            z: 4,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                color: '#777777',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#FFFFFF',
                borderColor: '#777777',
                borderWidth: 2
              }
            },
            data: line.stations
          })
        })

        this.scatterSeries = series
      },
      getEffectScatterSeries () {
        let series = [];
        const points = this.points;
        const getMiddlePoint = (start, end, percent) => {
          const x = start[0] + (end[0] - start[0]) * percent;
          const y = start[1] + (end[1] - start[1]) * percent;
          return [x, y]
        };

        this.linesData.forEach(line => {
          const pointsOnLine = points.filter(v => v.lineId === line.id);
          if ( pointsOnLine &&  pointsOnLine.length > 0) {
            const data =  pointsOnLine.map(train => {
              const formatter = `{img|}
                              {p2|\n${train.name}}
                              {p4|\n快递单号：${train.express_id}}
                              {p3|\n当前车速：${train.speed}}
                              {p4|\n即将到达：${train.pre.name}}`;
              return {
                itemStyle: {
                  normal: {
                    color: 'red'
                  },
                  emphasis: {
                    color: 'red'
                  }
                },
                label: {
                  normal: {
                    formatter,
                    rich: {
                      img: {
                        backgroundColor: {
                          image: train.img,
                        },
                        height:100,
                      }
                    }
                  }
                },
                value: getMiddlePoint(train.pre.value, train.next.value, train.travlled)
              }
            });
            series.push({
              name: line.name,
              type: 'effectScatter', // 带有涟漪特效动画的散点（气泡）图
              coordinateSystem: 'bmap',
              symbol: this.carIcon, // 使用自定义的SVG图标
              symbolSize: [40, 40],
              legendHoverLink: false,
              z: 6,
              effectType: 'ripple',
              rippleEffect: {
                period: 5, // 涟漪特效的动画周期
                scale: 1, // 涟漪特效动画中波纹的最大缩放比例
                brushType: 'fill' // 涟漪特效的波纹绘制方式
              },
              label: { // 鼠标浮动到特效点上时会显示标签
                normal: {
                  show: false,
                  position: ['100%', '100%'],
                  distance: 5,
                  color: '#222222',
                  align: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 5,
                  padding: 20,
                  shadowColor: 'rgba(0,0,0,0.16)',
                  shadowBlur: 6,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                  width: 250,
                  rich: { // 富文本标签样式
                    p2: {
                      fontSize: 16,
                      color: '#222222',
                      fontWeight: 'bolder',
                      lineHeight: 40
                    },
                    p3: {
                      fontSize: 14,
                      color: '#222222',
                      lineHeight: 18
                    },
                    p4: {
                      fontSize: 14,
                      color: '#222222',
                      lineHeight: 18
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              data: data
            })
          }
        })
        this.effectScatterSeries = series
      }
    }
  }
</script>

<style scoped>
  .map {
    width: 100%;
    height: 800px;
  }
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .table {
    width: 100%;
    font-size: 14px;
  }
  .red {
    color: #ff0000;
  }
  .mr10 {
    margin-right: 10px;
  }
  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
