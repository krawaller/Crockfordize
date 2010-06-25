(function(){
    
var slice = Array.prototype.slice;

// Fetch potential Crockfordifiable images
var imgs = slice.call(document.getElementsByTagName('img'));
imgs.sort(function(a,b){
    var area1 = a.offsetWidth*a.offsetHeight, area2 = b.offsetWidth*b.offsetHeight;
    return area1 == area2 ? 0 : area1 < area2 ? 1 : -1;
});

// We don't want to kill the face.com detection API
imgs.splice(4);

var canvas = document.createElement('canvas');
canvas.width = 480;
canvas.height = 480;
canvas.style.position = 'absolute';
canvas.style.left = '-1000px';
document.body.appendChild(canvas);
var context = canvas.getContext("2d");

// A few face positioning factors to experiment with
var yFactor = 4.2;
var xFactor = 4.2;
var yawFactor = 3;
var pitchFactor = -3;
var scaleFactor = 1.05;

var jsonpBase = '_crockfordizeJSONP_';
var reabsoluteUrl = /^http/;

var tmp;
var scriptParent = ((tmp = document.getElementsByTagName('head')) && ((tmp && tmp.length) ? tmp[0] : document.body));

imgs.forEach(function(img){
    var wrapper = document.createElement('div');
    wrapper.style.width = img.offsetWidth + 'px';
    wrapper.style.height = img.offsetHeight + 'px';
    wrapper.style.display = 'inline-block';
    wrapper.style.position = 'relative';
    
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    
    var fid = jsonpBase + new Date().getTime();
    var imgSrc = img.getAttribute('src');
    if(!reabsoluteUrl.test(imgSrc)){
        imgSrc = location.href + imgSrc;
    }
    
    var tmp;
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.id = fid;
    s.src = 'http://api.face.com/faces/detect.json?api_key=836d8e863d5d77ed01ef89ab55d40d79&api_secret=77f07f51879de76b8ec403d99761d4f0&urls='+imgSrc+'&callback=' + fid;
    scriptParent.appendChild(s);
    
    window[fid] = function(faces){
        var s = document.getElementById(fid);
        if(s) { s.parentNode.removeChild(s); }
        
        var photo = faces.photos[0];
        
        var mask = new Image();
        mask.src = 'data:image/png;base64,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'; 
        
        // Mask must be loaded before proceeding
        if(!mask.complete){
            mask.onload = arguments.callee;
            return;
        }
        
        // Prepare canvas
        canvas.width = canvas.width;
    
        // Fetch arr with num of crockford pics
        var crockfordIds = [];
        for(var i = 0; i < crockfordPics.length; i++){
            crockfordIds.push(i);
        }
        
        for (var i = 0, len = Math.min(photo.tags.length, crockfordPics.length); i < len; i++) {
            // Get data for face to replace
            var from = getFace(photo, i);
            
            // Pick a Crockford pic, anyone (except those you've already had)
            var pid = crockfordIds[Math.floor(Math.random() * crockfordIds.length)];
            crockfordIds.splice(crockfordIds.indexOf(pid), 1);
            // Get data for Crockford's face
            var crockford = crockfordPics[pid];
            var to = getFace(crockford.photos[0], Math.floor(Math.random() * crockford.photos[0].tags.length));
    
            // Better to flip face than to rotate - eeh
            var flipFactor = !((from.yaw > 0 && to.yaw > 0) || (from.yaw < 0 && to.yaw < 0)) ? -1 : 1;
    
            // Draw mask to canvas and rotate it accordingly
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(to.roll * Math.PI / 180);
            context.translate(-canvas.width / 2, -canvas.height / 2);
            
            // Offset to not cut off mask during rotation
            context.drawImage(mask, 80, 80);
            
            // Create face div
            var face = document.createElement('div');
            face.className = 'face';
            face.style.position = 'absolute';
            face.style.width = to.w + 'px';
            face.style.height = to.h + 'px';
            face.style.background = 'url(' + to.url + ')' + (to.w / 2 - to.c.x) + 'px ' + (to.h / 2 - to.c.y) + 'px';
            face.style.webkitMaskBoxImage = 'url("'+canvas.toDataURL("image/png")+'")';
            
            // Position it
            face.style.top = from.c.y + 'px';
            face.style.left = from.c.x + 'px';
            face.style.webkitTransform = 'translate(-50%, -50%) rotateY(0deg) rotateZ(' + (flipFactor == -1 ? (to.roll + from.roll) : (from.roll - to.roll)) + 'deg) scale(' + (flipFactor * from.w / to.w * scaleFactor) + ', ' + (from.h / to.h * scaleFactor) + ')';
            wrapper.appendChild(face);
        }
        
    }  
});
          
// Faces to insert
var crockfordPics = [
{"photos":[{"url":"http:\/\/79.99.1.153\/tmp\/pics\/crockford.jpg","pid":"F@82856fef9cd2253e295c644010773bc4_4b4b4c6d54c37","width":465,"height":349,"tags":[{"tid":"TEMP_F@82856fef9cd2253e295c644010773bc4_4b4b4c6d54c37_54.95_44.56_0","threshold":null,"uids":[],"gid":null,"label":"","confirmed":false,"manual":false,"tagger_id":null,"width":31.18,"height":41.55,"center":{"x":54.95,"y":44.56},"eye_left":{"x":48.76,"y":40.19},"eye_right":{"x":60.21,"y":40.46},"mouth_left":{"x":49.08,"y":55.52},"mouth_center":{"x":54.67,"y":58.2},"mouth_right":{"x":60.44,"y":55.63},"nose":{"x":54.66,"y":50.17},"ear_left":null,"ear_right":null,"chin":null,"yaw":4.27,"roll":1.01,"pitch":-2.48,"attributes":{"face":{"value":"true","confidence":1.81024},"gender":{"value":"male","confidence":85},"glasses":{"value":"false","confidence":13},"smiling":{"value":"true","confidence":98}}}]}],"status":"success","usage":{"used":71,"remaining":"unlimited","limit":"unlimited","reset_time_text":"unlimited","reset_time":0}}
];

// Calculate face data
function getFace(photo, tagNum){
    var tag = photo.tags[tagNum];
    return { 
        w: (tag.eye_right.x - tag.eye_left.x) * xFactor / 100 * photo.width,
        h: (tag.mouth_center.y - (tag.eye_left.y + tag.eye_right.y) / 2) * yFactor / 100 * photo.height,
        c: {
            x: (tag.nose.x - Math.sin(tag.yaw / (180 / Math.PI)) * yawFactor) / 100 * photo.width,
            y: (tag.nose.y - Math.sin(tag.pitch / (180 / Math.PI)) * pitchFactor) / 100 * photo.height
        },
        roll: tag.roll,
        photo: {
            w: photo.width,
            h: photo.height
        },
        yaw: tag.yaw,
        url: photo.url
    }   
}

})();