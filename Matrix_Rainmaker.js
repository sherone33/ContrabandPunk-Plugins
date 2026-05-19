// @name: Matrix Rain
// @description: Falling green characters in the glasses display                                                                                                         
// @author: Sherone
                                                                                                                                                                         
var matrixCols = [];
var matrixChars = "01";
var matrixInited = false;

function pluginRender(ctx, gX, gY, gW, gH, scale) {                                                                                                                      
   if(!CRTIsOn) return false;
   var colW = Math.max(4, scale * 0.4);                                                                                                                                  
   var numCols = Math.floor(gW / colW);                                                                                                                                  
   if(!matrixInited) {
      for(var i = 0; i < numCols; i++) matrixCols.push({ y: Math.random() * gH, speed: 0.1 + Math.random() * 0.3 });                                                     
      matrixInited = true;                                                                                                                                               
   }
   ctx.font = Math.round(colW) + "px monospace";                                                                                                                         
   for(var i = 0; i < matrixCols.length; i++) {
      var col = matrixCols[i];                                                                                                                                           
      var ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillStyle = "rgba(0, 255, 68, 0.9)";                                                                                                                           
      ctx.fillText(ch, gX + i * colW, gY + col.y);
      ctx.fillStyle = "rgba(0, 255, 68, 0.3)";                                                                                                                           
      ctx.fillText(ch, gX + i * colW, gY + col.y - colW);
      col.y += col.speed;                                                                                                                                                
      if(col.y > gH) { col.y = 0; col.speed = 0.1 + Math.random() * 0.3; }
   }                                                                                                                                                                     
   return true; 
}                       
