import * as echarts from '../../utils/ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '支付分布饼图',
      left: 'center',
      top: '5%',
      textStyle: { fontSize: 15 }
    },
    tooltip: {
      trigger: 'item',
      confine: true,
      textStyle: { fontSize: 10 },
      extraCssText: 'padding:4px 6px;border-radius:4px;'
    },
    legend: {
      bottom: '6%',
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 10 }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius:'60%',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5
        },
        label: { show: false },
        emphasis: {
          label: {
            show: false,
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Component({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
