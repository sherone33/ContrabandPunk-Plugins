// @name: Stock Ticker
  // @description: Scrolling stock ticker with fake prices and green/red changes
  // @author: sherone

  var tickerX = 0;
  var tickerInited = false;
  var tickerItems = [];
  var tickerTotalW = 0;

  function initTicker(ctx, gH) {
     var stocks = [
        {sym:"ETH",price:3842.17,chg:2.4},
        {sym:"BTC",price:97215.50,chg:-0.8},
        {sym:"PUNK",price:69.42,chg:12.1},
        {sym:"SOL",price:187.33,chg:-3.2},
        {sym:"AAPL",price:228.50,chg:1.1},
        {sym:"TSLA",price:341.75,chg:-1.9},
        {sym:"DOGE",price:0.42,chg:8.7},
        {sym:"NVDA",price:892.10,chg:0.6}
     ];
     var fontSize = Math.max(6, Math.round(gH * 0.35));
     ctx.font = "bold " + fontSize + "px monospace";
     tickerItems = [];
     tickerTotalW = 0;
     for(var i = 0; i < stocks.length; i++) {
        var s = stocks[i];
        var sign = s.chg >= 0 ? "+" : "";
        var arrow = s.chg >= 0 ? "\u25B2" : "\u25BC";
        var label = "  " + s.sym + " $" + s.price.toFixed(2) + " " + arrow + sign + s.chg.toFixed(1) + "%  ";
        var w = ctx.measureText(label).width;
        tickerItems.push({label:label, w:w, up:s.chg>=0});
        tickerTotalW += w;
     }
     tickerX = 0;
     tickerInited = true;
  }

  function pluginRender(ctx, gX, gY, gW, gH, scale) {
     if(!CRTIsOn) return false;
     if(!tickerInited) initTicker(ctx, gH);
     var fontSize = Math.max(6, Math.round(gH * 0.35));
     ctx.font = "bold " + fontSize + "px monospace";
     ctx.textBaseline = "middle";
     var y = gY + gH / 2;
     var x = gX + tickerX;
     for(var r = 0; r < 2; r++) {
        for(var i = 0; i < tickerItems.length; i++) {
           var t = tickerItems[i];
           if(x + t.w > gX && x < gX + gW) {
              ctx.fillStyle = t.up ? "#00ff44" : "#ff3333";
              ctx.shadowColor = t.up ? "#00ff44" : "#ff3333";
              ctx.shadowBlur = 4;
              ctx.fillText(t.label, x, y);
              ctx.shadowBlur = 0;
           }
           x += t.w;
        }
     }
     tickerX -= 1.2;
     if(tickerX < -tickerTotalW) tickerX += tickerTotalW;
     return true;
  }
