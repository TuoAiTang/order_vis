<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div id="main" style="width: 100%;height:1000px;"></div>
  </div>
</template>

<script>
  import mapConfig from './data/map-config.json'
  export default {
    name: "app",
    methods: {
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("main"));
        var geoCoorddata = {
                  '武汉': [114.30539299999998, 30.593099],
                  '深圳': [114.05786499999999, 22.543096],
                  '北京': [116.40739499999995, 39.904211],
                  '阿克苏': [80.26338699999997, 41.167548]
                };
        let option = {
            bmap: {
              center: [113.65, 34.76],
              zoom: 5,
              roam: true,
              mapStyle: {
                styleJson:mapConfig,
              }
            },
            series: [{
              type: 'lines',
              mapType: 'china',
              coordinateSystem: 'bmap',
              zlevel: 1,
              data: [{
                name: '武汉',
                toname: '北京',
                coords: [geoCoorddata['武汉'], geoCoorddata['北京']]
              }, {
                name: '深圳',
                toname: '北京',
                coords: [geoCoorddata['深圳'], geoCoorddata['北京']]
              }, {
                name: '阿克苏',
                toname: '北京',
                coords: [geoCoorddata['阿克苏'], geoCoorddata['北京']]
              }],
              //线上面的动态特效
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: 'red',
                symbolSize: 4
              },
              lineStyle: {
                normal: {
                  width: '',
                  color: '#a6c84c',
                  curveness: 0.2
                }
              }
            }, {
              type: 'effectScatter',
              mapType: 'china',
              coordinateSystem: 'bmap',
              zlevel: 3,
              data: [{
                name: '北京',
                value: geoCoorddata['北京'].concat(200)
              }, ],
              rippleEffect: {
                period: 10,
                scale: 5,
                brushType: 'fill'
              },
            }]
          };
        myChart.setOption(option);
      }
    },
    mounted() {
      this.drawChart();
    }
  };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
