// @name: PoliceCap-Pixel_ID-Logger (all 5 pixels)                                                                                                                       
// @description: Logs every cap-pixel tap, including engine-reserved ones (1: EKG, 2: Equalizer)                                                                         
// @author: Sherone                                                                                                                                                     
                                                                                                                                                                         
// Cap pixel names with reserved-status flag                                                                                                                             
var CAP_NAMES = [
   "Scanner",       // 0 - overridable                                                                                                                                   
   "EKG",           // 1 - RESERVED (engine-protected)
   "Equalizer",     // 2 - RESERVED (engine-protected)                                                                                                                   
   "Flash Burn",    // 3 - overridable                                                                                                                                   
   "Pong"           // 4 - overridable
];                                                                                                                                                                       
                
// Cap pixels 0, 3, 4 route through pluginClick - easy interception                                                                                                      
function pluginClick(idx) {
   console.log("Cap pixel " + idx + " clicked: " + CAP_NAMES[idx]);                                                                                                      
}                                                                                                                                                                        

// Cap pixels 1 and 2 are wired DIRECTLY to toggleEKG / toggleEqualizer in the engine.                                                                                   
// They never reach pluginClick. To still log them, we monkey-patch the functions:
// wrap each so it logs first, then calls the original.                                                                                                                  
if(typeof toggleEKG === "function") {                                                                                                                                    
   var _origToggleEKG = toggleEKG;
   toggleEKG = function() {                                                                                                                                              
      console.log("Cap pixel 1 clicked: EKG (Note: this button is reserved by the engine and cannot be overridden by a plugin)");                                        
      return _origToggleEKG.apply(this, arguments);                                                                                                                      
   };                                                                                                                                                                    
}                                                                                                                                                                        
                
if(typeof toggleEqualizer === "function") {
   var _origToggleEqualizer = toggleEqualizer;
   toggleEqualizer = function() {                                                                                                                                        
      console.log("Cap pixel 2 clicked: Equalizer (Note: this button is reserved by the engine and cannot be overridden by a plugin)");
      return _origToggleEqualizer.apply(this, arguments);                                                                                                                
   };           
}                                                                                                                                                                        
                
function pluginInit(config, canvas, ctx) {                                                                                                                               
   console.log("Click Logger plugin initialized - logging all 5 cap-pixel taps");
   console.log("Canvas: " + canvas.width + "x" + canvas.height + ", Mode: " + config.mode);                                                                              
}  
