// @name: Red Flash on Click                                                                                                                                             
// @description: Tap Pixel 0 (left-most pixel) in the Police-Cap to create a quick red-flash in the VR glasses
// @author: Sherone

var flashOn = false;                                                                                                                                                     
var flashTimer = 0;
                                                                                                                                                                           
function pluginClick(idx) {
   if(idx === 0) {
      flashOn = true;
      flashTimer = 30;
      console.log("Flash activated!");
   }                                                                                                                                                                     
}
                                                                                                                                                                         
function pluginRender(ctx, gX, gY, gW, gH, scale) {
   if(!flashOn) return false;
   flashTimer--;
   var alpha = flashTimer / 30;                                                                                                                                          
   ctx.fillStyle = "rgba(255, 0, 0, " + alpha + ")";
   ctx.fillRect(gX, gY, gW, gH);                                                                                                                                         
   if(flashTimer <= 0) flashOn = false;                                                                                                                                  
   return true;
}  
