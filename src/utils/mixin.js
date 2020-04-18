import api from '@/api/index'
import moment from 'moment';
export const initWebsocket = {
    data() {
      return {
        clientId:'da8bc6f5-df6f-4aeb-af84-38f3becfeb1f',
        functionId: this.$route.query.id,
        serverName: window.location.host,
        consoleLog:[],
        websocket:null
      }
    },
    created() {
      // this.initWebsocket();
      // this.websocket.onopen = this.onopenWebsocket()
      // this.websocket.onerror = this.onerrorWebsocket()
      // this.websocket.onmessage = this.onmessageWebsocket(event)
    },
    methods: {
      // window.onbeforeunload = this.onbeforeunload(websocket)

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      // onbeforeunload(websocket) {
      //   websocket.close();
      // },
      //关闭连接
      // closeWebSocket() {
      //   this.websocket.close();
      // },
      
      // 设置日志
      setMessageInnerHTML(message) {
          const consoleLogTime = moment().format('LLLL')
          const consoleText = consoleLogTime +' : '+ message;
          this.consoleLog.push(consoleText)
      },
      // 链接建立的回调方法
      onopenWebsocket(event) {
        this.setMessageInnerHTML("连接后台成功");
      },
      // 链接错误的回调方法
      onerrorWebsocket(event) {
        this.setMessageInnerHTML("连接后台错误");
      },
      // 接收到消息的回调方法
      onmessageWebsocket(event) {
          var msg = JSON.parse(event.data);
          var param = msg.scriptCommand;
          switch (msg.atCommand) {
            case 1:
              this.exeConnected(msg);
              break
            case 3:
              this.exeRecord(msg);
              break;
            case 4:
              this.exeVerify(msg);
              break;
            case 14:
              this.exeOutput(msg);
              break;
            case 19:
              this.exeMaterial(msg);
              break;
            case 10:
              this.exeStepOver(msg);
              break;
            case 768:
              this.exeStepOK(msg);
              break;
            case 259:
              this.exeStopRun(msg);
              break;
            case 769:
              this.exeError(msg);
              break;
            default:
              this.exeMessage(msg);
              break;
          }
      },

      //  连接关闭的回调方法
      oncloseWebsocket() {
        this.websocket.close();
        this.setMessageInnerHTML("连接后台断开");
      },
      // 初始化websocket
      initWebsocket() {
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
          this.websocket = new WebSocket("ws://127.0.0.1:9000/autobot/websocket");
          console.log(this.websocket)
        } else {
          alert('当前浏览器不支持websocket!')
        }
      },

      exeMessage(msg) {
        var param = msg.scriptCommand;
        var message = param.value;
        setMessageInnerHTML(message);
      },

      exeConnected(msg) {
        setMessageInnerHTML("[" + msg.scriptCommand.method + "] 系统连接成功");
      },

      exeRecord(msg) {
        var param = msg.scriptCommand;
        var message = "[" + msg.scriptCommand.method + "] 录制脚本: " + param.execScriptStep.scriptStep.plainScript;
        setMessageInnerHTML(message);
      },

      exeVerify(msg) {
        var param = msg.scriptCommand;
        var message = "[" + msg.scriptCommand.method + "] 添加验证点: " + param.execScriptStep.scriptStep.plainScript;
        setMessageInnerHTML(message);
      },

      exeOutput(msg) {
        var param = msg.scriptCommand;
        var message = "[" + msg.scriptCommand.method + "] 添加输出参数: " + param.execScriptStep.scriptStep.plainScript;
        setMessageInnerHTML(message);
      },

      exeMaterial(msg) {
        var param = msg.scriptCommand;
        var message = "[" + msg.scriptCommand.method + "] 添加材料: " + param.execScriptStep.scriptStep.plainScript;
        setMessageInnerHTML(message);
      },

      exeStopRun(msg) {
        setMessageInnerHTML("[" + msg.scriptCommand.method + "] 功能点执行成功");
      },

      exeStepOver(msg) {
        var param = msg.scriptCommand;

        var message = "[" + msg.scriptCommand.method + "] 开始执行脚本: " + param.execScriptStep.runnableScript;
        setMessageInnerHTML(message);
      },

      exeStepOK(msg) {
        var param = msg.scriptCommand;
        var message = "脚本执行成功";
        setMessageInnerHTML(message);
      },

      exeError(msg) {
        var param = msg.scriptCommand;
        var message = "";
        if (param.result && param.result.result == "false") {
          message = param.result.errorMessage;
          setMessageInnerHTML(message);
        } else {
          message = "[" + msg.scriptCommand.method + "] 验证对象属性失败: ";
          message += "预期值=" + param.value + ", 实际值=" + param.newValue;
          setMessageInnerHTML(message);
        }
      },
    },
    // 销毁前
    beforeDestroyed() {
      this.websocket.onclose = this.oncloseWebsocket()
    },
}
export const scriptOperation = {
  methods:{
    // 开始回放
    play() {
      const data = { appId: this.clientId}
      this.$axios.post(api.startPlay,data)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
    },
    // 结束回放
    stopPlay() {
      const data = { appId: this.clientId}
      this.$axios.post(api.endPlay,data)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
    },
    // 停止启动
    stop() {
      const data = { appId: this.clientId, userFunctionId: this.$route.query.id, clientId:this.clientId}
      this.$axios.post(api.shutDownAut,data)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
    },
    // 启动
    startAut() {
      const data = { appId: this.clientId, userFunctionId: this.$route.query.id, clientId:this.clientId}
        this.$axios.post(api.startAut,data)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    },
    // 开始录制
    record() {
      const data = { appId: this.clientId, startIndex: 0}
        this.$axios.post(api.beginRecord,data)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    },
    // 停止录制
    stopRecord() {
      const data = { appId: this.clientId}
        this.$axios.post(api.endRecord,data)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    },
  }
}
