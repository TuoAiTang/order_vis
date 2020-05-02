<template>
  <div class="container">
    <el-steps :active="active" finish-status="success">
      <el-step title="选择订单"></el-step>
      <el-step title="搜索"></el-step>
      <el-step title="物流"></el-step>
    </el-steps>
    <div class="handle-box">
      <el-select
              v-model="orders"
              placeholder="订单列表"
              @change="next"
              class="handle-input handle-select mr10"
              multiple
              clearable
              filterable
      >
        <el-option
                v-for="order in orderList"
                :key="order.id"
                :label="order.name"
                :value="order.id"
                class="option"
        >
          <span style="float: left">{{ order.id }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px;">{{ order.name }}</span>
        </el-option>
      </el-select>
      <el-divider direction="vertical"></el-divider>
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
        ws:null,
        active:1,
        //一旦初始化就不再更改
        baseLinesData:[],
        linesData:[],
        orderList:[],
        orders:[],
        chart: this.$echarts.ECharts,
        bmap: {},
        points:[],
        // 带有起点和终点信息的线数据的绘制
        linesSeries: [],
        // 散点（气泡）图
        scatterSeries: [],
        // 带有涟漪特效动画的散点（气泡）图
        effectScatterSeries: [],
        //左上角图例
        baseLegend: {
          orient: 'vertical',
          top: 30,
          left: 30,
          data: [],
          textStyle: {
            color: '#222222'
          },
          selectedMode: 'multiple'
        },
        baseOption:{
          animation: false,
          // 加载 bmap 组件
          bmap: {
            center: [104.114129, 37.550339],
            // 地图当前的缩放比例
            zoom: 6,
            // 开启鼠标缩放和平移漫游
            roam: true,
            mapStyle: {
              styleJson: mapConfig
            }
          },
        },
        mapZoom: 6,
        carIcon: `image://https://tuocheng.oss-cn-beijing.aliyuncs.com/UTOOLS1586013674763.png`,
      }
    },
    mounted () {
      this.initAll();
    },
    methods: {
      initAll() {
        this.getOrdersOption();
        this.initPointsWs();
        this.getLinesData();
      },

      getOrdersOption() {
        this.orderList = [];
        this.$http.get("http://localhost:6789/orders").then(response => {
            this.orderList = response.data;
        });
      },

      initPointsWs(){
        this.ws = new WebSocket('ws://localhost:6789/points');
        this.ws.onopen = function(evt) {
          console.log("Connection open ...");
        };

        this.ws.onmessage = event =>  {
          this.points = JSON.parse(event.data);
          this.refreshSeries();
        };

        this.ws.onclose = function(evt) {
          console.log("Connection closed.");
        };
      },

      handleSearch(){
        console.log("orders:", this.orders);
        let linesData = [];
        for(let i = 0; i < this.baseLinesData.length; i++){
          let line = this.baseLinesData[i];
          for(let j = 0; j < this.orders.length; j++) {
            if (this.orders[j] === line.id){
              linesData.push(line);
              break;
            }
          }
        }
        this.linesData = linesData;
        console.log("after search:", this.linesData);
        this.baseLegend.data = this.linesData.map(v => v.name);
        this.refreshSeries();
        this.active=3;
        this.$message({
          message: '加载了' + this.orders.length + "条订单物流",
          type: 'success'
        });
      },

      refreshSeries(){
        console.log("refreshSeries");
        this.getLineSeries();
        this.getScatterSeries();
        this.getEffectScatterSeries();
        this.chart.setOption({
          legend:this.baseLegend,
          series:[
            ...this.linesSeries,
            ...this.scatterSeries,
            ...this.effectScatterSeries
          ]
        })
      },
      getLinesData: function () {
        console.log("getLinesData");
        this.$http.get("http://localhost:6789/lines").then(response => {
          console.log("response.data:", response.data);
          this.linesData = [];
          this.baseLinesData = response.data;
          this.initMap();
          console.log("回调函数里面：this.linesData:", this.linesData);
        });
      },
      initMap () {
        this.chart = this.$echarts.init(document.getElementById("main"));
        this.baseLegend.data = this.linesData.map(v => v.name);
        console.log("baseLegend:", this.baseLegend);
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
            ...this.linesSeries,
            ...this.scatterSeries,
            ...this.effectScatterSeries
          ]
        });
        // console.log("初始化地图：option：", option);
        // 获取百度地图实例，使用百度地图自带的控件
        this.bmap = this.chart.getModel().getComponent('bmap').getBMap();
        this.bmap.setMinZoom(4);// 设置地图最小缩放比例
        this.bmap.setMaxZoom(12); // 设置地图最大缩放比例
        // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
        // this.bmap.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));// 在左下角显示比例尺控件
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
        let deep = true;
        this.linesData.forEach(line => {
          if(deep){
            deep = false;
            line.primaryColor = "#479CD4";
            line.bgColor = "#DAEBF6";
          } else {
            deep = true;
            line.primaryColor = "#A56743";
            line.bgColor = "#EDE1D9";
          }
          series.push({
            name: line.name,
            type: 'lines',
            coordinateSystem: 'bmap',
            silent: true, // 图形不响应和触发鼠标事件
            polyline: true,
            lineStyle: { color: line.primaryColor },
            z: 3,
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
        });

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
          const pointsOnLine = points.filter(v => v.id === line.id);
          console.log("pointsOnLine:", pointsOnLine);
          const data =  pointsOnLine.map(point => {
            let formatter = `{img|}
                            {p2|\n${point.name}}
                            {p4|\n订单号：${point.id}}
                            {p3|\n当前车速：${point.speed}km/h}
                            {p4|\n即将到达：${point.next_name}}`;
            if (point.speed === 0) {
              formatter = `{img|}
                          {p2|\n${point.name}}
                          {p4|\n订单号：${point.id}}
                          {p3|\n目前到达：${point.next_name}}
                          {p4|\n等待下一阶段运输}`;
            }
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
                        image: point.img_url,
                      },
                      height:100,
                    }
                  }
                }
              },
              value: getMiddlePoint(point.pre, point.next, point.travelled)
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
        });
        this.effectScatterSeries = series
      },
      next(){
        if (this.active++ > 2) this.active = 0;
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
    width: 600px;
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
