// @name: Crosshair Overlay                                                                                                                                              
// @description: Draws a targeting crosshair that follows a sine wave
// @author: built-in

var crossT = 0;

function pluginFrame() {                                                                                                                                                 
   crossT += 0.03;
}                                                                                                                                                                        
                
function pluginRender(ctx, gX, gY, gW, gH, scale) {
   if(!CRTIsOn) return false;
   var cx = gX + gW / 2 + Math.sin(crossT) * gW * 0.3;
   var cy = gY + gH / 2 + Math.cos(crossT * 0.7) * gH * 0.3;                                                                                                             
   var r = Math.min(gW, gH) * 0.15;                                                                                                                                      
   ctx.save();                                                                                                                                                           
   ctx.strokeStyle = "#00ff44";                                                                                                                                          
   ctx.shadowColor = "#00ff44";
   ctx.shadowBlur = 8;                                                                                                                                                   
   ctx.lineWidth = 1;
   ctx.beginPath();                                                                                                                                                      
   ctx.arc(cx, cy, r, 0, Math.PI * 2);
   ctx.stroke();                                                                                                                                                         
   ctx.beginPath();
   ctx.moveTo(cx - r * 1.5, cy); ctx.lineTo(cx + r * 1.5, cy);                                                                                                           
   ctx.moveTo(cx, cy - r * 1.5); ctx.lineTo(cx, cy + r * 1.5);                                                                                                           
   ctx.stroke();                                                                                                                                                         
   ctx.restore();                                                                                                                                                        
   return false;                                                                                                                                                         
}               
