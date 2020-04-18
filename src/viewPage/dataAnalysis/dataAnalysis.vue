<template>
  <div>
    <div class="charts-box">
      <!-- bar -->
      <div class="bar-box">
        <div id="bar" style="width: 100%;height:100%;" ref='bar'></div>
      </div>
      <!-- line -->
      <div class="line-box">
        <div id="line" style="width: 100%;height:100%;" ref='line'></div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {

      }
    },
    mounted() {
      // 解决初始化图表宽度超出容器
      setTimeout(()=>{
        this.initBarChart()
        this.initLineChart()
      },0)
    },
    methods: {
      // 初始化图表
      initBarChart() {

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs['bar']);

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '柱状图',
            subtext:"2020-03-08 10:16:20"
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => myChart.resize()
      },
      initLineChart() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs['line']);


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '直接访问',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: '搜索引擎',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        });
        window.onresize = () => myChart.resize()
      },
    },
  }
</script>

<style>
  .charts-box {
    display: flex;
    justify-content: space-between;
  }
  .bar-box, .line-box {
    width: 48%;height:400px;border: 1px solid #ccc;padding: 20px
  }
</style>
